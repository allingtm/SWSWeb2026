import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";
import { TrackedLink } from "@/components/ui/tracked-link";
import { ProjectsCarousel } from "@/components/about/projects-carousel";
import { getNavCategories } from "@/lib/supabase/queries";
import { generateMetadata as generateSiteMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/constants";
import { Code, Smartphone, Settings, Sparkles, MapPin, Calendar, Users, Award } from "lucide-react";

export const metadata: Metadata = generateSiteMetadata({
  title: "About Us",
  description: "Solve With Software Ltd is a software development consultancy based in Colchester, Essex. Since 2012, we have been delivering custom software solutions, web applications, and mobile apps for businesses across the UK.",
  path: "/about",
});

const services = [
  {
    icon: Code,
    title: "Web Applications",
    description: "Modern, responsive web applications built with cutting-edge technologies including Next.js, React, and .NET. Scalable solutions designed to grow with your business.",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Cross-platform mobile applications using Flutter, delivering native performance on iOS and Android from a single codebase.",
  },
  {
    icon: Settings,
    title: "Custom Software",
    description: "Bespoke software solutions tailored to your specific business requirements. From internal tools to customer-facing platforms.",
  },
  {
    icon: Sparkles,
    title: "AI Solutions",
    description: "Intelligent automation and AI integration to streamline operations, enhance decision-making, and unlock new capabilities.",
  },
];

const differentiators = [
  {
    icon: MapPin,
    title: "UK-Based",
    description: "Based in Colchester, Essex, we provide local expertise with a personal touch. Face-to-face meetings and UK timezone availability.",
  },
  {
    icon: Calendar,
    title: "Established Since 2012",
    description: "Over a decade of experience delivering successful software projects across diverse industries and technologies.",
  },
  {
    icon: Users,
    title: "Partnership Approach",
    description: "We work as an extension of your team, understanding your business goals and translating them into effective technical solutions.",
  },
  {
    icon: Award,
    title: "Quality-Focused",
    description: "Commitment to clean code, thorough testing, and maintainable architectures that stand the test of time.",
  },
];

export default async function AboutPage() {
  const navCategories = await getNavCategories();

  return (
    <>
      <Header categories={navCategories} />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
          <Container className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Solve With Software
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We deliver tailored business IT systems that meet your exact needs. Our team is dedicated to helping businesses
              solve complex challenges through elegant, efficient and cost-effective technology solutions.
            </p>
          </Container>
        </section>

        {/* About Section */}
        <section className="py-16">
          <Container className="max-w-4xl">
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Solve With Software Ltd is a software development consultancy headquartered
                in Colchester, Essex. Founded in 2012, we have spent over a decade building
                custom software solutions for businesses across the United Kingdom.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our approach centres on understanding your business objectives first, then
                applying the most appropriate technologies to achieve them. We believe that
                successful software projects are built on clear communication, technical
                excellence, and a genuine partnership between our team and yours.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether you need a web application, mobile app, API integration, or AI-powered
                automation, we have the expertise to deliver solutions that make a measurable
                impact on your business.
              </p>
            </div>
          </Container>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer a comprehensive range of software development services,
                each delivered with the same commitment to quality and results.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
                >
                  <service.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Projects Section */}
        <section className="py-16 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-4">Where We Have Delivered</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Over a decade of projects across regulated, high-stakes sectors
                where reliability and security are not optional.
              </p>
            </div>
          </div>
          <ProjectsCarousel />
        </section>

        {/* Expertise Section */}
        <section className="py-16">
          <Container className="max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Expertise</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our team brings deep technical knowledge across modern development
                platforms and frameworks.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <h3 className="font-semibold mb-2">Frontend</h3>
                <p className="text-sm text-muted-foreground">
                  React, Next.js, TypeScript, Tailwind CSS
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">Backend</h3>
                <p className="text-sm text-muted-foreground">
                  .NET, Node.js, PostgreSQL, Supabase
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">Mobile</h3>
                <p className="text-sm text-muted-foreground">
                  Flutter, Dart, iOS, Android
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">Cloud & DevOps</h3>
                <p className="text-sm text-muted-foreground">
                  Azure, AWS, Vercel, CI/CD
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">AI & Automation</h3>
                <p className="text-sm text-muted-foreground">
                  OpenAI, LLM Integration, Process Automation
                </p>
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">Integration</h3>
                <p className="text-sm text-muted-foreground">
                  REST APIs, GraphQL, Third-party Services
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                What sets Solve With Software apart from other development consultancies.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {differentiators.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <Container className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Get in touch to discuss how we can help bring your software vision to life.
              We would be delighted to learn about your requirements and explore how we can work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TrackedButtonLink
                href="/pricing"
                size="lg"
                event="about_cta_click"
                eventProps={{ target: "pricing" }}
              >
                See what it costs
              </TrackedButtonLink>
              <TrackedButtonLink
                href={`tel:${siteConfig.phone.replace(/-/g, "")}`}
                variant="outline"
                size="lg"
                external
                event="about_call_click"
              >
                Call {siteConfig.phone}
              </TrackedButtonLink>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Not ready for that?{" "}
              <TrackedLink
                href="/contact"
                className="text-primary underline-offset-4 hover:underline"
                event="about_cta_click"
                eventProps={{ target: "contact" }}
              >
                Send us a message
              </TrackedLink>{" "}
              and we will get back to you.
            </p>
          </Container>
        </section>
      </main>
      <Footer categories={navCategories} />
    </>
  );
}
