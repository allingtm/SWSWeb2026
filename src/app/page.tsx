import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  FeaturedPosts,
  CategoryPills,
} from "@/components/blog";
import {
  getNavCategories,
  getFeaturedPosts,
} from "@/lib/supabase/queries";
import { generateMetadata as generateSiteMetadata } from "@/lib/seo/metadata";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/seo/constants";

export const metadata = generateSiteMetadata({
  title: siteConfig.tagline,
  description: siteConfig.description,
  path: "/",
});

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch all data in parallel
  const [navCategories, featuredPosts] = await Promise.all([
    getNavCategories(),
    getFeaturedPosts(3),
  ]);

  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <Header categories={navCategories} />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-16 pb-8">
          <Container>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                {siteConfig.heroTitle}
              </h1>
              <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
                {siteConfig.heroSubtitle}
              </p>
            </div>

            {/* Category Pills */}
            <div className="mb-12">
              <CategoryPills categories={navCategories} />
            </div>

            {/* Featured Posts */}
            <FeaturedPosts posts={featuredPosts} />
          </Container>
        </section>
      </main>
      <Footer categories={navCategories} />
    </>
  );
}
