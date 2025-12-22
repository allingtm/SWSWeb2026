import { siteConfig } from "./constants";
import type { BlogPostWithRelations, BlogCategory, BlogTag } from "@/types";

// Organization schema (for the entire site)
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo.png`,
      width: 200,
      height: 60,
    },
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    foundingDate: siteConfig.foundingDate,
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
    },
    sameAs: [
      "https://www.linkedin.com/company/solvewithsoftware",
      "https://twitter.com/solvewithsw",
      "https://github.com/solvewithsoftware",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: siteConfig.email,
      telephone: siteConfig.phone,
    },
    knowsAbout: [
      "Software Development",
      "Mobile App Development",
      "Web Application Development",
      "Artificial Intelligence",
      "Digital Transformation",
      "Business Process Automation",
    ],
  };
}

// WebSite schema (for the homepage)
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Article schema for blog posts
export function generateArticleSchema(post: BlogPostWithRelations) {
  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.subtitle || post.ai_summary || "",
    image: post.featured_image || siteConfig.ogImage,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author.name,
      ...(post.author.bio && { description: post.author.bio }),
      ...(post.author.avatar_url && { image: post.author.avatar_url }),
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/${post.slug}`,
    },
    articleSection: post.category.name,
    keywords: post.tags.map((t) => t.name).join(", "),
    wordCount: post.content?.split(/\s+/).length || 0,
    ...(post.read_time_minutes && {
      timeRequired: `PT${post.read_time_minutes}M`,
    }),
  };

  return articleSchema;
}

// FAQPage schema for posts with FAQs
export function generateFAQSchema(post: BlogPostWithRelations) {
  if (!post.faqs || post.faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// HowTo schema for tutorial/how-to posts
export function generateHowToSchema(
  title: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>,
  totalTime?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };
}

// BreadcrumbList schema
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ItemList schema for category/tag pages
export function generateItemListSchema(
  name: string,
  description: string,
  posts: BlogPostWithRelations[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteConfig.url}/${post.slug}`,
      name: post.title,
    })),
  };
}

// CollectionPage schema for category pages
export function generateCollectionPageSchema(
  category: BlogCategory,
  posts: BlogPostWithRelations[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description || `Articles about ${category.name}`,
    url: `${siteConfig.url}/${category.slug}`,
    mainEntity: generateItemListSchema(
      category.name,
      category.description || "",
      posts
    ),
  };
}
