import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";
import { TrackedLink } from "@/components/ui/tracked-link";
import { ProjectsCarousel } from "@/components/about/projects-carousel";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GlowingEffect } from "@/components/ui/glowing-effect";
// Lives under components/pricing/ but is a generic decorative primitive;
// /book-diagnostic already imports it from there for the same reason.
import { DottedBackground } from "@/components/pricing/grid-lines";
import { JsonLd } from "@/components/seo/json-ld";
import { getNavCategories } from "@/lib/supabase/queries";
import { generateMetadata as generateSiteMetadata } from "@/lib/seo/metadata";
import {
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/seo/constants";
import {
  Sparkles,
  Server,
  FileSpreadsheet,
  Wrench,
  ArrowLeftRight,
  Smartphone,
  PoundSterling,
  KeyRound,
  Timer,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = generateSiteMetadata({
  title: "About — Colchester Software Consultancy",
  description:
    "Software development consultancy in Colchester, Essex. Custom web, mobile and AI systems for UK businesses since 2012. Fixed prices, published up front.",
  path: "/about",
});

export const revalidate = 60;

// The three stages, summarised from /pricing. Figures are repeated here rather
// than imported because /pricing owns the full terms and this is the short
// version. If a number changes there, it has to change here too.
const ladder = [
  {
    step: 1,
    name: "Diagnostic",
    price: "£950 + VAT",
    description:
      "We come to you and map how the work actually runs, including the parts nobody has written down. You get a specification and a fixed price to build it, yours to keep whether or not we go further.",
  },
  {
    step: 2,
    name: "Build phases",
    price: "£12,000-£15,000",
    description:
      "One process at a time, working, in your hands in about six weeks. Not a prototype. You decide whether to continue at the end of each phase.",
  },
  {
    step: 3,
    name: "Care plan",
    price: "18% a year",
    description:
      "Support, hosting, small changes and priority access once you are live. Sold as part of phase one, cancellable on 30 days' notice.",
  },
];

// Concrete jobs, listed in the lead cell's footer. They answer the question the
// paragraph above them raises ("one specific job" — such as?) and they carry the
// bottom half of a cell that is two rows tall.
const aiExamples = [
  "Pulling order details from supplier PDFs into your system, instead of someone retyping them",
  "Reading every inbound enquiry and sending it to the right person with the context attached",
  "Drafting the quote reply for a salesperson to check and send in one click",
  "Answering 'what did we agree with this client last year?' from your own files, not from memory",
  "Turning a two-year case history into a one-page summary before the meeting",
];

// Framed by the situation the reader is in rather than by our capability. The
// carousel above already proves what we build and the stack below already lists
// what we build it with; this section exists so someone can recognise their own
// week and work out whether to call.
const calledIn = [
  {
    icon: Sparkles,
    title: "You want AI in your business without betting the business on it.",
    // Roughly twice the length of the others, plus the footer list below. This
    // cell spans two rows, so it is as tall as the two cards beside it and
    // needs about their combined content to not read as empty.
    description:
      "There are two ways in. The first is low risk: give your team AI tools that speed up the work they already do. The second goes deeper: build AI into your systems themselves, so it runs your processes rather than assisting them. Each suits different businesses, budgets and appetites for risk. We build both, and we run both. Our own platforms use the Claude API in production, and our own delivery process is AI-assisted from first design to final release. Colchester.Network sat on a registered domain for years because the build cost was too high. AI-assisted development dramatically lowered the risk, and we shipped it in eight weeks. So when we talk about risk and reward, it comes from operating experience. We will show you what is possible in your organisation today, that is safe and secure to use.",    lead: true,
  },
  {

    icon: Server,
    title: "A legacy system you can now afford to replace",
    description:
      "You have a legacy system that is old, outdated and clunky. Your whole team hates it, but the cost of replacing it is too high. Our Full Stack Dev + AI Engineering techniques allow us to build a new system that is modern, efficient and tailored to your needs, at a price that is affordable. We can help you transition smoothly and ensure that your new system meets all your requirements.",
  },
  {
    icon: FileSpreadsheet,
    title: "The spreadsheet became the system",
    description:
      "Spreadsheets are great for a while, but they are not a system. They are not secure, they are not scalable, and they are not reliable. We can help you replace your spreadsheet with a proper system that is designed to meet your needs, and that will grow with your business.",
  },
  {
    icon: Wrench,
    title: "Internal systems are now affordable",
    description:
      "The tool that would save your team an hour a day never made it up the list, because building it cost more than the hour was worth. The floor has come down. Small internal systems are worth costing again.",
  },
  {
    icon: ArrowLeftRight,
    title: "Two systems that will not talk",
    description:
      "Someone is retyping data from one screen into another, and by Friday the two disagree. Often the fix is an integration rather than a replacement, and we will tell you if it is.",
  },
  {
    icon: Smartphone,
    title: "Your customers expect it on their phone",
    description:
      "Booking, ordering, tracking, account access — the things people used to ring up for. Native where it needs to be native, and honest about when a good mobile website would have done the job.",
  },
];

// Every one of these is a commitment published elsewhere on the site, not a
// sentiment. If one stops being true on /pricing, it has to change here too.
const differentiators = [
  {
    icon: PoundSterling,
    title: "Our prices are on the website",
    description:
      "Most development companies will not publish theirs. A fixed price also means the risk of an overrun sits with us rather than you, which is where it belongs.",
  },
  {
    icon: KeyRound,
    title: "You own the result",
    description:
      "Full source code and ownership transfer to you on final payment. No licence, no lock-in, no charge for leaving, and mainstream technology any competent developer can pick up.",
  },
  {
    icon: Timer,
    title: "Something working in six weeks",
    description:
      "Each phase takes one process and gets it live. Soon enough to find out whether we understood how you work, before you commit to anything bigger.",
  },
  {
    icon: ShieldCheck,
    title: "Fourteen years in serious sectors",
    description:
      "NHS services, UK retail banking, group litigation, haulage and construction. Regulated work teaches you to specify carefully first, because being wrong costs more than a late release.",
  },
];

const expertise = [
  {
    title: "Frontend",
    technologies: "React, Next.js, Angular, TypeScript, Tailwind CSS, shadcn/ui",
  },
  {
    title: "Backend",
    technologies: ".NET, C#, Node.js, Python, PostgreSQL, MS SQL Server, Supabase",
  },
  {
    title: "Mobile",
    technologies: "Flutter, Dart, React Native, iOS, Android",
  },
  {
    title: "Cloud & DevOps",
    technologies: "Azure, AWS, Cloudflare, Vercel, Docker, GitHub Actions, CI/CD",
  },
  {
    title: "AI & Automation",
    technologies: "Anthropic Claude, OpenAI, MCP, RAG, Agentic Workflows, Process Automation",
  },
  {
    title: "Integration",
    technologies: "REST APIs, GraphQL, Webhooks, Stripe, SendGrid, Third-party Services",
  },
];

export default async function AboutPage() {
  const navCategories = await getNavCategories();
  const phoneHref = `tel:${siteConfig.phone.replace(/-/g, "")}`;

  const localBusinessSchema = generateLocalBusinessSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "About", url: `${siteConfig.url}/about` },
  ]);

  return (
    <>
      <JsonLd data={localBusinessSchema} id="local-business" />
      <JsonLd data={breadcrumbSchema} id="breadcrumb-about" />
      <Header categories={navCategories} />
      <main className="min-h-screen">
        {/* Hero — same 5/7 split and dot texture as the /pricing hero, so this
            page reads as part of that set rather than a plainer template. The
            gradient stays because the band below is also unmuted; without it
            the two run together. */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-linear-to-b from-muted/50 to-background">
          <DottedBackground />
          <Container className="relative max-w-[60rem]">
            <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:col-span-5 md:text-5xl lg:text-6xl">
                We are Full Stack Devs + AI Engineers
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground md:col-span-7">
                A software consultancy in Colchester, building custom systems
                for UK businesses since 2012. Fixed prices, published up front.
                One process at a time, working, in your hands.
              </p>
            </div>
          </Container>
        </section>

        {/* Who We Are */}
        <section className="py-16">
          <Container className="max-w-4xl">
            <div className="mx-auto">
              <h2 className="text-3xl font-bold mb-6 tracking-tight">Who we are</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Solve With Software Ltd is a software development consultancy in
                Colchester, Essex. We started in 2012, which makes this our
                fourteenth year building custom systems for businesses across the
                United Kingdom.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Much of that work has been in sectors where getting it wrong is
                expensive: NHS mental health services, UK retail banking, group
                litigation, haulage and construction. Regulated industries are
                unforgiving of vagueness. They teach you to be careful about what
                you promise and precise about what you deliver.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                That is why we map your process before we quote, put a fixed price
                on the build so the risk of an overrun is ours, and deliver one
                process at a time. You see something real in about six weeks,
                rather than finding out at the end whether we understood you.
              </p>
            </div>
          </Container>
        </section>

        {/* Projects */}
        <section className="py-16 overflow-hidden bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Where we have delivered
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Fourteen years of projects across regulated, high-stakes sectors
                where reliability and security are not optional. Select any card
                for more on the work.
              </p>
            </div>
          </div>
          <ProjectsCarousel />
        </section>

        {/* Why work with us */}
        <section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Why work with us
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Four things you can hold us to, rather than four things everybody
                says.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {differentiators.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* How the work is structured — the /pricing ladder in short form */}
        <section className="py-16 bg-muted/30">
          <Container className="max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                How the work is structured
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Three stages, each priced before you commit to it. Everything
                starts with a paid diagnostic, because a build quoted without one
                is a guess wearing a number.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {ladder.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-border bg-background p-6"
                >
                  <span
                    className="mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold tabular-nums text-foreground"
                    aria-hidden="true"
                  >
                    {item.step}
                  </span>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-primary tabular-nums">
                    {item.price}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Payment terms, what is included, what is not, and the answers to the
              awkward questions are all on the{" "}
              <TrackedLink
                href="/pricing"
                className="text-primary underline-offset-4 hover:underline"
                event="about_cta_click"
                eventProps={{ target: "pricing" }}
              >
                pricing page
              </TrackedLink>
              .
            </p>
          </Container>
        </section>

        {/* Where we get called in — the reader's situation, not our capability */}
        <section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                Where we usually get called in
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Six situations that come up again and again. If one of them
                sounds like your week, we have built the way out of it before.
              </p>
            </div>
            {/* The lead cell spans 2x2, so auto-placement fills the rest around
                it: card 2 and 3 stack in the third column, cards 4-6 form the
                bottom row. Below md the spans drop and everything stacks in DOM
                order, which still puts the lead first. */}
            <BentoGrid>
              {calledIn.map((item) => (
                <BentoGridItem
                  key={item.title}
                  className={item.lead ? "md:col-span-2 md:row-span-2" : undefined}
                  icon={<item.icon className="h-10 w-10 text-primary" />}
                  title={item.title}
                  description={item.description}
                  footer={
                    item.lead ? (
                      <>
                        <p className="text-sm font-semibold text-foreground">
                          Jobs we give AI
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {aiExamples.map((example) => (
                            <li
                              key={example}
                              className="rounded-md border border-border bg-background/60 px-3 py-1 text-sm text-muted-foreground"
                            >
                              {example}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : undefined
                  }
                >
                  {/* Same signal as the "Start here" card on /pricing and the
                      booking card on /book-diagnostic: this is the one that
                      matters most in its section. */}
                  {item.lead && (
                    <GlowingEffect
                      variant="brand"
                      spread={38}
                      glow
                      disabled={false}
                      proximity={72}
                      inactiveZone={0.01}
                      borderWidth={2}
                    />
                  )}
                </BentoGridItem>
              ))}
            </BentoGrid>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Whatever the situation, we build bespoke systems that meet your
              exact business needs, using the latest methods and technologies.{" "}
              <TrackedLink
                href="/pricing"
                className="text-primary underline-offset-4 hover:underline"
                event="about_cta_click"
                eventProps={{ target: "pricing", location: "called-in" }}
              >
                Book a diagnostic to get started
              </TrackedLink>
              .
            </p>
          </Container>
        </section>

        {/* Expertise */}
        <section className="py-16 bg-muted/30">
          <Container className="max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">
                What we build with
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                The stack we are working in during 2026. It looks nothing like the
                2012 list and will look different again in three years. Knowing
                which tool fits which problem is the part that carries over.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {expertise.map((item) => (
                <div key={item.title} className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.technologies}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <Container className="text-center">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">
              Start with the diagnostic
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              £950 + VAT. We come to you, map the process with whoever runs it day
              to day, and give you a written specification and a fixed price to
              build it within five working days. Yours to keep whether or not you
              use us to build it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TrackedButtonLink
                href="/book-diagnostic"
                size="lg"
                event="about_cta_click"
                eventProps={{ target: "book-diagnostic" }}
              >
                Book a diagnostic
              </TrackedButtonLink>
              <TrackedButtonLink
                href={phoneHref}
                variant="outline"
                size="lg"
                external
                event="about_call_click"
              >
                Call {siteConfig.phone}
              </TrackedButtonLink>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Want the numbers first?{" "}
              <TrackedLink
                href="/pricing"
                className="text-primary underline-offset-4 hover:underline"
                event="about_cta_click"
                eventProps={{ target: "pricing" }}
              >
                See what it costs
              </TrackedLink>
              . Not ready for either?{" "}
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
