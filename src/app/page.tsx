import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/layout/hero";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";
import { JsonLd } from "@/components/seo/json-ld";
import {
  FeaturedPosts,
  CategoryPills,
  LatestPosts,
  CategorySection,
  LeadCaptureHelper,
  LiveChatMount,
} from "@/components/blog";
import {
  getNavCategories,
  getFeaturedPosts,
  getHomepageCategories,
  getLatestPosts,
  getPostsByCategory,
  getActiveHelpOptions,
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
  const [navCategories, featuredPosts, homepageCategories, latestPosts, helpOptions] = await Promise.all([
    getNavCategories(),
    getFeaturedPosts(3),
    getHomepageCategories(),
    getLatestPosts(6),
    getActiveHelpOptions(),
  ]);

  // Fetch posts for each homepage category (6 posts each)
  const categoriesWithPosts = await Promise.all(
    homepageCategories.map(async (category) => ({
      category,
      posts: await getPostsByCategory(category.id, 6),
    }))
  );

  // Filter out empty categories
  const nonEmptyCategories = categoriesWithPosts.filter(({ posts }) => posts.length > 0);

  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <>
      <JsonLd data={organizationSchema} id="organization" />
      <JsonLd data={websiteSchema} id="website" />
      <Header categories={navCategories} />
      <main className="min-h-screen">
        {/* Hero Section - Above the Fold */}
        <Hero title={siteConfig.heroTitle} subtitle={siteConfig.heroSubtitle}>
          <TrackedButtonLink
            href="/pricing"
            size="lg"
            event="home_cta_click"
            eventProps={{ target: "pricing" }}
          >
            See what it costs
          </TrackedButtonLink>
          <TrackedButtonLink
            href={`tel:${siteConfig.phone.replace(/-/g, "")}`}
            variant="outline"
            size="lg"
            external
            event="home_call_click"
          >
            Call {siteConfig.phone}
          </TrackedButtonLink>
        </Hero>

        {/* Lead Capture Helper */}
        {helpOptions.length > 0 && (
          <LeadCaptureHelper helpOptions={helpOptions} />
        )}

        {/* Featured Posts */}
        <section className="py-8">
          <Container>
            <FeaturedPosts posts={featuredPosts} />
          </Container>
        </section>

        {/* Category Pills - Above Latest */}
        <section className="py-8">
          <Container>
            <CategoryPills categories={navCategories} />
          </Container>
        </section>

        {/* Latest Section */}
        <section className="border-t border-border">
          <Container>
            <LatestPosts posts={latestPosts} title="Latest" />
          </Container>
        </section>

        {/* Category Sections - ordered by display_order, empty filtered out */}
        {nonEmptyCategories.map(({ category, posts }) => (
          <Container key={category.id}>
            <CategorySection category={category} posts={posts} />
          </Container>
        ))}
      </main>
      <Footer categories={navCategories} />
      {/* Floating live chat button - only renders when an admin is online */}
      <LiveChatMount />
    </>
  );
}
