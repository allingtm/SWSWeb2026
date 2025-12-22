import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { formatDate } from "@/lib/utils";
import type { BlogPostWithRelations } from "@/types";

interface PostContentProps {
  post: BlogPostWithRelations;
}

export function PostContent({ post }: PostContentProps) {
  return (
    <article className="py-8">
      <Container className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${post.category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {post.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <Badge
            className="mb-4"
            style={{
              backgroundColor: post.category.color || undefined,
              color: "white",
            }}
          >
            {post.category.name}
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="text-xl text-muted-foreground mb-6">{post.subtitle}</p>
          )}

          {/* Author and meta */}
          <div className="flex items-center gap-4">
            {post.author.avatar_url && (
              <Image
                src={post.author.avatar_url}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{post.author.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {post.published_at && (
                  <time dateTime={post.published_at}>
                    {formatDate(post.published_at)}
                  </time>
                )}
                {post.read_time_minutes && (
                  <>
                    <span>·</span>
                    <span>{post.read_time_minutes} min read</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* AI Summary / TL;DR */}
        {post.ai_summary && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-2">TL;DR</h2>
            <p className="text-muted-foreground">{post.ai_summary}</p>
          </div>
        )}

        {/* Key Takeaways */}
        {post.key_takeaways && post.key_takeaways.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Key Takeaways</h2>
            <ul className="space-y-2">
              {post.key_takeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* FAQs */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="border-t border-border pt-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {post.faqs.map((faq) => (
                <div key={faq.id}>
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/tag/${tag.slug}`}>
                <Badge variant="outline" className="hover:bg-muted cursor-pointer">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Sources */}
        {post.sources && post.sources.length > 0 && (
          <section className="border-t border-border pt-8 mb-8">
            <h2 className="text-lg font-semibold mb-4">Sources & References</h2>
            <ul className="space-y-2">
              {post.sources.map((source, index) => (
                <li key={index}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Author Bio */}
        {post.author.bio && (
          <section className="bg-muted/50 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              {post.author.avatar_url && (
                <Image
                  src={post.author.avatar_url}
                  alt={post.author.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              )}
              <div>
                <h3 className="font-semibold mb-1">About {post.author.name}</h3>
                <p className="text-muted-foreground text-sm">{post.author.bio}</p>
                {post.author.expertise && post.author.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.author.expertise.map((exp, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </Container>
    </article>
  );
}
