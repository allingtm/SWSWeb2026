import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { BlogPostWithRelations } from "@/types";

interface PostCardProps {
  post: BlogPostWithRelations;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <Link href={`/${post.slug}`} className="group block">
      <article
        className={`relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${
          featured ? "h-full" : ""
        }`}
      >
        {/* Image */}
        {post.featured_image && (
          <div
            className={`relative overflow-hidden ${
              featured ? "aspect-[16/10]" : "aspect-video"
            }`}
          >
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />

            {/* Category badge on image */}
            <div className="absolute bottom-3 left-3">
              <Badge
                variant="secondary"
                className="bg-background/90 backdrop-blur-sm"
                style={{ borderColor: post.category.color || undefined }}
              >
                {post.category.name}
              </Badge>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* If no image, show category here */}
          {!post.featured_image && (
            <Badge
              variant="outline"
              className="mb-2"
              style={{ borderColor: post.category.color || undefined }}
            >
              {post.category.name}
            </Badge>
          )}

          <h3
            className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 ${
              featured ? "text-xl md:text-2xl" : "text-lg md:text-xl"
            }`}
          >
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
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
      </article>
    </Link>
  );
}
