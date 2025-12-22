import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TagListing } from "@/components/blog";
import {
  getNavCategories,
  getTagBySlug,
  getPostsByTagSlug,
} from "@/lib/supabase/queries";
import { generateMetadata as generateSiteMetadata } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;
export const dynamic = "force-dynamic";

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return generateSiteMetadata({
      title: "Tag Not Found",
      description: "The tag you're looking for doesn't exist.",
      path: `/tag/${slug}`,
    });
  }

  return generateSiteMetadata({
    title: `${tag.name} - Tagged Articles`,
    description: tag.description || `Browse all articles tagged with ${tag.name}.`,
    path: `/tag/${slug}`,
  });
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const [navCategories, tag] = await Promise.all([
    getNavCategories(),
    getTagBySlug(slug),
  ]);

  if (!tag) {
    notFound();
  }

  const posts = await getPostsByTagSlug(slug, 24);

  return (
    <>
      <Header categories={navCategories} />
      <main className="min-h-screen">
        <TagListing tag={tag} posts={posts} />
      </main>
      <Footer categories={navCategories} />
    </>
  );
}
