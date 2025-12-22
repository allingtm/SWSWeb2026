// Types for AI-generated blog post content

export interface AIGeneratedContent {
  seo: {
    meta_title: string;
    meta_description: string;
    primary_keyword: string;
    secondary_keywords: string[];
  };
  content: {
    subtitle: string;
    excerpt: string;
    suggested_titles: string[];
  };
  ai_optimization: {
    ai_summary: string;
    key_takeaways: string[];
    questions_answered: string[];
    definitive_statements: string[];
  };
  categorization: {
    suggested_tag_ids: string[];
  };
  faqs: Array<{ question: string; answer: string }>;
  entities: Array<{ name: string; type: string }>;
  og_image?: {
    url: string;
    prompt: string;
  };
}

export interface GenerateContentRequest {
  title: string;
  content: string;
  availableTags: Array<{ id: string; name: string }>;
  generateImage?: boolean;
}

export interface GenerateImageRequest {
  title: string;
  excerpt: string;
}
