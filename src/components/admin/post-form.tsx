"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, Trash2, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "./markdown-editor";
import { StatusBadge } from "./status-badge";
import { AIGenerateButton } from "./ai-generate-button";
import { AIGenerationModal, type SelectedContent } from "./ai-generation-modal";
import { useAIGeneration } from "@/hooks/use-ai-generation";
import { cn } from "@/lib/utils";
import type { BlogPostWithRelations, BlogCategory, BlogTag, BlogFaq } from "@/types";
import type { AIGeneratedContent } from "@/lib/ai/types";

interface PostFormProps {
  post?: BlogPostWithRelations;
  categories: BlogCategory[];
  tags: BlogTag[];
  authorId: string;
}

interface FormData {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featured_image_alt: string;
  og_image: string;
  category_id: string;
  status: "draft" | "scheduled" | "published" | "archived";
  scheduled_for: string;
  is_featured: boolean;
  featured_order: number;
  meta_title: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords: string;
  ai_summary: string;
  key_takeaways: string;
  questions_answered: string;
  definitive_statements: string;
}

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PostForm({ post, categories, tags, authorId }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [formData, setFormData] = useState<FormData>({
    title: post?.title || "",
    slug: post?.slug || "",
    subtitle: post?.subtitle || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    featured_image: post?.featured_image || "",
    featured_image_alt: post?.featured_image_alt || "",
    og_image: post?.og_image || "",
    category_id: post?.category_id || categories[0]?.id || "",
    status: post?.status || "draft",
    scheduled_for: post?.scheduled_for?.slice(0, 16) || "",
    is_featured: post?.is_featured || false,
    featured_order: post?.featured_order || 1,
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
    primary_keyword: post?.primary_keyword || "",
    secondary_keywords: post?.secondary_keywords?.join(", ") || "",
    ai_summary: post?.ai_summary || "",
    key_takeaways: post?.key_takeaways?.join("\n") || "",
    questions_answered: post?.questions_answered?.join("\n") || "",
    definitive_statements: post?.definitive_statements?.join("\n") || "",
  });

  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags?.map((t) => t.id) || []
  );

  const [faqs, setFaqs] = useState<FaqItem[]>(
    post?.faqs?.map((f) => ({ id: f.id, question: f.question, answer: f.answer })) || []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSeoSection, setShowSeoSection] = useState(false);
  const [showAiSection, setShowAiSection] = useState(false);
  const [showFaqSection, setShowFaqSection] = useState(faqs.length > 0);
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const [showAiModal, setShowAiModal] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<AIGeneratedContent | null>(null);

  const { generate, isGenerating, error: aiError } = useAIGeneration({
    onSuccess: (data) => {
      setGeneratedContent(data);
      setShowAiModal(true);
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && formData.title) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [formData.title, slugEdited]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "slug") {
      setSlugEdited(true);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
    setShowFaqSection(true);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFaqChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  };

  const handleAIGenerate = async () => {
    await generate({
      title: formData.title,
      content: formData.content,
      availableTags: tags.map((t) => ({ id: t.id, name: t.name })),
      generateImage: !formData.og_image,
      existingExcerpt: formData.excerpt || undefined,
    });
  };

  const handleApplyAIContent = (selected: SelectedContent) => {
    setFormData((prev) => {
      const updated = { ...prev };

      // SEO fields
      if (selected.seo?.meta_title) updated.meta_title = selected.seo.meta_title;
      if (selected.seo?.meta_description) updated.meta_description = selected.seo.meta_description;
      if (selected.seo?.primary_keyword) updated.primary_keyword = selected.seo.primary_keyword;
      if (selected.seo?.secondary_keywords) {
        updated.secondary_keywords = selected.seo.secondary_keywords.join(", ");
      }

      // Content fields
      if (selected.content?.subtitle) updated.subtitle = selected.content.subtitle;
      if (selected.content?.excerpt) updated.excerpt = selected.content.excerpt;
      if (selected.content?.title) updated.title = selected.content.title;

      // AI optimization fields
      if (selected.ai_optimization?.ai_summary) {
        updated.ai_summary = selected.ai_optimization.ai_summary;
      }
      if (selected.ai_optimization?.key_takeaways) {
        updated.key_takeaways = selected.ai_optimization.key_takeaways.join("\n");
      }
      if (selected.ai_optimization?.questions_answered) {
        updated.questions_answered = selected.ai_optimization.questions_answered.join("\n");
      }
      if (selected.ai_optimization?.definitive_statements) {
        updated.definitive_statements = selected.ai_optimization.definitive_statements.join("\n");
      }

      // OG Image
      if (selected.og_image) updated.og_image = selected.og_image;

      return updated;
    });

    // Tags
    if (selected.categorization?.suggested_tag_ids) {
      setSelectedTags((prev) => {
        const newTags = new Set([...prev, ...selected.categorization!.suggested_tag_ids!]);
        return Array.from(newTags);
      });
    }

    // FAQs
    if (selected.faqs && selected.faqs.length > 0) {
      setFaqs((prev) => [...prev, ...selected.faqs!]);
      setShowFaqSection(true);
    }

    // Expand sections that received content
    if (selected.seo) setShowSeoSection(true);
    if (selected.ai_optimization) setShowAiSection(true);
  };

  const handleSubmit = async (saveStatus?: "draft" | "published") => {
    setIsLoading(true);
    setError("");

    const status = saveStatus || formData.status;

    const payload = {
      ...formData,
      status,
      author_id: authorId,
      // Convert empty strings to null for optional fields
      scheduled_for: formData.scheduled_for || null,
      featured_image: formData.featured_image || null,
      featured_image_alt: formData.featured_image_alt || null,
      og_image: formData.og_image || null,
      subtitle: formData.subtitle || null,
      excerpt: formData.excerpt || null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      primary_keyword: formData.primary_keyword || null,
      ai_summary: formData.ai_summary || null,
      secondary_keywords: formData.secondary_keywords
        ? formData.secondary_keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [],
      key_takeaways: formData.key_takeaways
        ? formData.key_takeaways.split("\n").map((k) => k.trim()).filter(Boolean)
        : [],
      questions_answered: formData.questions_answered
        ? formData.questions_answered.split("\n").map((k) => k.trim()).filter(Boolean)
        : [],
      definitive_statements: formData.definitive_statements
        ? formData.definitive_statements.split("\n").map((k) => k.trim()).filter(Boolean)
        : [],
      tags: selectedTags,
      faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
    };

    try {
      const url = isEditing
        ? `/api/admin/posts/${post.id}`
        : "/api/admin/posts";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save post");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !confirm("Are you sure you want to delete this post?")) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to delete post");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Post" : "New Post"}
          </h1>
          {isEditing && <StatusBadge status={post.status} className="mt-2" />}
        </div>
        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <Button variant="outline" size="sm" asChild>
                <a href={`/admin/posts/${post.id}/preview`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </a>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md p-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-background rounded-lg border border-border p-4 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
                placeholder="Post title"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
                Slug <span className="text-destructive">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
                placeholder="post-url-slug"
              />
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium mb-1.5">
                Subtitle
              </label>
              <input
                id="subtitle"
                name="subtitle"
                type="text"
                value={formData.subtitle}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
                placeholder="Optional subtitle"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-1.5">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={2}
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
                placeholder="Brief description for post cards"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-background rounded-lg border border-border p-4">
            <label className="block text-sm font-medium mb-1.5">
              Content <span className="text-destructive">*</span>
            </label>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
              height={500}
            />
          </div>

          {/* Media */}
          <div className="bg-background rounded-lg border border-border p-4 space-y-4">
            <h3 className="font-medium">Media</h3>
            <div>
              <label htmlFor="featured_image" className="block text-sm font-medium mb-1.5">
                Featured Image URL
              </label>
              <input
                id="featured_image"
                name="featured_image"
                type="url"
                value={formData.featured_image}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
                placeholder="https://..."
              />
            </div>
            <div>
              <label htmlFor="featured_image_alt" className="block text-sm font-medium mb-1.5">
                Featured Image Alt Text
              </label>
              <input
                id="featured_image_alt"
                name="featured_image_alt"
                type="text"
                value={formData.featured_image_alt}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
                placeholder="Describe the image"
              />
            </div>
            <div>
              <label htmlFor="og_image" className="block text-sm font-medium mb-1.5">
                OG Image URL
              </label>
              <input
                id="og_image"
                name="og_image"
                type="url"
                value={formData.og_image}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
                placeholder="https://... (auto-generated by AI)"
              />
              {formData.og_image && (
                <div className="mt-2">
                  <img
                    src={formData.og_image}
                    alt="OG Image preview"
                    className="rounded-md max-h-40 object-cover border border-border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-background rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setShowSeoSection(!showSeoSection)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <h3 className="font-medium">SEO Settings</h3>
              {showSeoSection ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {showSeoSection && (
              <div className="p-4 pt-0 space-y-4">
                <div>
                  <label htmlFor="meta_title" className="block text-sm font-medium mb-1.5">
                    Meta Title
                  </label>
                  <input
                    id="meta_title"
                    name="meta_title"
                    type="text"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    maxLength={60}
                    className={cn(
                      "w-full px-3 py-2 rounded-md border border-input bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                    placeholder="SEO title (max 60 chars)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.meta_title.length}/60 characters
                  </p>
                </div>
                <div>
                  <label htmlFor="meta_description" className="block text-sm font-medium mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    id="meta_description"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    maxLength={160}
                    rows={2}
                    className={cn(
                      "w-full px-3 py-2 rounded-md border border-input bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                    placeholder="SEO description (max 160 chars)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.meta_description.length}/160 characters
                  </p>
                </div>
                <div>
                  <label htmlFor="primary_keyword" className="block text-sm font-medium mb-1.5">
                    Primary Keyword
                  </label>
                  <input
                    id="primary_keyword"
                    name="primary_keyword"
                    type="text"
                    value={formData.primary_keyword}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full px-3 py-2 rounded-md border border-input bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                    placeholder="Main keyword"
                  />
                </div>
                <div>
                  <label htmlFor="secondary_keywords" className="block text-sm font-medium mb-1.5">
                    Secondary Keywords
                  </label>
                  <input
                    id="secondary_keywords"
                    name="secondary_keywords"
                    type="text"
                    value={formData.secondary_keywords}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full px-3 py-2 rounded-md border border-input bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            )}
          </div>

          {/* AI Optimization Section */}
          <div className="bg-background rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setShowAiSection(!showAiSection)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <h3 className="font-medium">AI Optimization</h3>
              {showAiSection ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {showAiSection && (
              <div className="p-4 pt-0 space-y-4">
                <div>
                  <label htmlFor="ai_summary" className="block text-sm font-medium mb-1.5">
                    AI Summary
                  </label>
                  <textarea
                    id="ai_summary"
                    name="ai_summary"
                    value={formData.ai_summary}
                    onChange={handleInputChange}
                    rows={3}
                    className={cn(
                      "w-full px-3 py-2 rounded-md border border-input bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                    placeholder="2-3 sentence TL;DR for AI citation"
                  />
                </div>
                <div>
                  <label htmlFor="key_takeaways" className="block text-sm font-medium mb-1.5">
                    Key Takeaways (one per line)
                  </label>
                  <textarea
                    id="key_takeaways"
                    name="key_takeaways"
                    value={formData.key_takeaways}
                    onChange={handleInputChange}
                    rows={4}
                    className={cn(
                      "w-full px-3 py-2 rounded-md border border-input bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                    placeholder="Key point 1&#10;Key point 2&#10;Key point 3"
                  />
                </div>
                <div>
                  <label htmlFor="questions_answered" className="block text-sm font-medium mb-1.5">
                    Questions Answered (one per line)
                  </label>
                  <textarea
                    id="questions_answered"
                    name="questions_answered"
                    value={formData.questions_answered}
                    onChange={handleInputChange}
                    rows={4}
                    className={cn(
                      "w-full px-3 py-2 rounded-md border border-input bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                    placeholder="What is X?&#10;How does X work?&#10;Why use X?"
                  />
                </div>
                <div>
                  <label htmlFor="definitive_statements" className="block text-sm font-medium mb-1.5">
                    Definitive Statements (one per line)
                  </label>
                  <textarea
                    id="definitive_statements"
                    name="definitive_statements"
                    value={formData.definitive_statements}
                    onChange={handleInputChange}
                    rows={4}
                    className={cn(
                      "w-full px-3 py-2 rounded-md border border-input bg-background",
                      "focus:outline-none focus:ring-2 focus:ring-ring"
                    )}
                    placeholder="Quotable facts from your content"
                  />
                </div>
              </div>
            )}
          </div>

          {/* FAQs Section */}
          <div className="bg-background rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setShowFaqSection(!showFaqSection)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <h3 className="font-medium">FAQs ({faqs.length})</h3>
              {showFaqSection ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {showFaqSection && (
              <div className="p-4 pt-0 space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">
                        FAQ #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Question</label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 rounded-md border border-input bg-background",
                          "focus:outline-none focus:ring-2 focus:ring-ring"
                        )}
                        placeholder="What is...?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Answer</label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                        rows={3}
                        className={cn(
                          "w-full px-3 py-2 rounded-md border border-input bg-background",
                          "focus:outline-none focus:ring-2 focus:ring-ring"
                        )}
                        placeholder="The answer is..."
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddFaq}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Generation */}
          <div className="bg-background rounded-lg border border-border p-4">
            <AIGenerateButton
              onClick={handleAIGenerate}
              isGenerating={isGenerating}
              disabled={isLoading}
              contentLength={formData.content.length}
            />
            {aiError && (
              <p className="text-xs text-destructive mt-2">{aiError}</p>
            )}
          </div>

          {/* Publish Settings */}
          <div className="bg-background rounded-lg border border-border p-4 space-y-4">
            <h3 className="font-medium">Publish</h3>
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1.5">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-input bg-background",
                  "focus:outline-none focus:ring-2 focus:ring-ring"
                )}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {formData.status === "scheduled" && (
              <div>
                <label htmlFor="scheduled_for" className="block text-sm font-medium mb-1.5">
                  Scheduled For
                </label>
                <input
                  id="scheduled_for"
                  name="scheduled_for"
                  type="datetime-local"
                  value={formData.scheduled_for}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 rounded-md border border-input bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-ring"
                  )}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                id="is_featured"
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="rounded border-input"
              />
              <label htmlFor="is_featured" className="text-sm">
                Featured post
              </label>
            </div>

            {formData.is_featured && (
              <div>
                <label htmlFor="featured_order" className="block text-sm font-medium mb-1.5">
                  Featured Order
                </label>
                <input
                  id="featured_order"
                  name="featured_order"
                  type="number"
                  min={1}
                  max={10}
                  value={formData.featured_order}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full px-3 py-2 rounded-md border border-input bg-background",
                    "focus:outline-none focus:ring-2 focus:ring-ring"
                  )}
                />
              </div>
            )}

            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button
                onClick={() => handleSubmit("published")}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Publish"}
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={isLoading}
              >
                Save as Draft
              </Button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-background rounded-lg border border-border p-4">
            <label htmlFor="category_id" className="block text-sm font-medium mb-1.5">
              Category <span className="text-destructive">*</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className={cn(
                "w-full px-3 py-2 rounded-md border border-input bg-background",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-background rounded-lg border border-border p-4">
            <h3 className="font-medium mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm transition-colors",
                    selectedTags.includes(tag.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {tag.name}
                </button>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No tags available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Generation Modal */}
      {generatedContent && (
        <AIGenerationModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          generatedContent={generatedContent}
          existingFields={{
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            primary_keyword: formData.primary_keyword,
            secondary_keywords: formData.secondary_keywords,
            subtitle: formData.subtitle,
            excerpt: formData.excerpt,
            ai_summary: formData.ai_summary,
            key_takeaways: formData.key_takeaways,
            questions_answered: formData.questions_answered,
            og_image: formData.og_image,
          }}
          availableTags={tags}
          onApply={handleApplyAIContent}
        />
      )}
    </div>
  );
}
