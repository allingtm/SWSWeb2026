// Database types for blog system

export interface BlogAuthor {
  id: string;
  user_id: string | null;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  social_links: Record<string, string>;
  expertise: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subtitle: string | null;
  meta_title: string | null;
  meta_description: string | null;
  color: string | null;
  icon: string | null;
  display_order: number;
  show_in_nav: boolean;
  show_on_homepage: boolean;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  featured_image_alt: string | null;
  og_image: string | null;
  author_id: string;
  category_id: string;
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  published_at: string | null;
  scheduled_for: string | null;
  is_featured: boolean;
  featured_order: number | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  primary_keyword: string | null;
  secondary_keywords: string[] | null;
  ai_summary: string | null;
  key_takeaways: string[] | null;
  definitive_statements: string[] | null;
  questions_answered: string[] | null;
  entities: Array<{ name: string; type: string; url?: string }>;
  topic_cluster: string | null;
  content_type: string | null;
  expertise_level: string | null;
  last_verified_at: string | null;
  sources: Array<{ title: string; url: string }>;
  read_time_minutes: number | null;
  word_count: number | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostWithRelations extends BlogPost {
  author: BlogAuthor;
  category: BlogCategory;
  tags: BlogTag[];
  faqs: BlogFaq[];
}

export interface BlogFaq {
  id: string;
  post_id: string;
  question: string;
  answer: string;
  display_order: number;
  created_at: string;
}

export interface BlogRelatedPost {
  post_id: string;
  related_post_id: string;
  relevance_score: number;
  is_manual: boolean;
}

export interface BlogSetting {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string | null;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}
