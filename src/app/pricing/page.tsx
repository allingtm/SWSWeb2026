import { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/seo/json-ld";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  DottedBackground,
  GridLineHorizontal,
} from "@/components/pricing/grid-lines";
import { PricingCta } from "@/components/pricing/pricing-cta";
import { StickyCtaBar } from "@/components/pricing/sticky-cta-bar";
import { PricingFaqItem } from "@/components/pricing/faq-item";
import { PricingAnalytics } from "@/components/pricing/pricing-analytics";
import { getNavCategories } from "@/lib/supabase/queries";
import { generateMetadata as generateSiteMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = generateSiteMetadata({
  title: "Pricing — Custom Software Development",
  description:
    "What custom software costs. Diagnostic £950. Most phase one builds run £12,000 to £15,000, working in about six weeks. Prices published up front, so you can decide before you call.",
  path: "/pricing",
});

const ladder = [
  {
    step: 1,
    name: "Diagnostic",
    duration:
      "On site with you and whoever runs the process. Documents within 5 working days.",
    price: "£950",
    description:
      "Your process mapped, a written specification, and a fixed price to build it. Yours to keep whether or not we work together.",
    startHere: true,
  },
  {
    step: 2,
    name: "Build phases",
    duration: "4-6 weeks each",
    priceLabel: "Phase one, most projects",
    price: "£12,000-£15,000",
    priceNote:
      "Later phases get priced when we reach them, once the one before has shown what's needed.",
    description:
      "One process at a time, working, in your hands. Not a prototype. The real thing, in use. You decide whether to continue at the end of each phase.",
  },
  {
    step: 3,
    name: "Care plan",
    duration: "Ongoing",
    price: "18%",
    pricePeriod: "of build cost, per year",
    priceNote: "On a £13,500 build, that's about £200 a month.",
    description:
      "Support, hosting, small changes and priority access. Sold as part of phase one.",
  },
];

const included = [
  "Discovery and specification",
  "Build, testing and deployment",
  "Data migration from your existing systems",
  "Works properly on a phone",
  "30 days of fixes after launch",
  "Full source code and ownership. The system is yours",
  "Handover documentation",
];

const notIncluded = [
  "Third-party licences and hosting",
  "Changes outside the agreed scope",
  "Ongoing support beyond the first 30 days. That's the care plan",
];

const paymentTerms = [
  "Diagnostic payable in advance",
  "Builds: 40% on signature, 40% at first working version, 20% on handover",
  "Care plans monthly by direct debit, 30 days' notice to cancel",
  "All figures exclude VAT",
];

const faqs = [
  {
    id: "faq-fixed-price",
    question: "Why fixed price rather than a day rate?",
    answer:
      "A day rate shifts the overrun risk onto you, while a fixed price keeps the risk of delays on us, where it should be. It also makes it easier for you to get approval since there's no uncertain range to consider.",
  },
  {
    id: "faq-overrun",
    question: "What if it takes you longer than you thought?",
    answer: "You pay the agreed price. The risk is ours to complete what was agreed.  Not  yours.",
  },
  {
    id: "faq-changes",
    question: "What if I want changes partway through?",
    answer:
      "Minor tasks are included. Any significant changes to the scope are quoted separately or postponed to phase two. Out-of-scope work is billed at £850 per day, so you'll know the cost of a change before requesting it.",
  },
  {
    id: "faq-ownership",
    question: "Do I own the code?",
    answer:
      "Yes. Full source code and ownership transfer to you on final payment. No licence, no lock-in, no charge for leaving.",
  },
  {
    id: "faq-availability",
    question: "What happens if you're unavailable in two years?",
    answer:
      "You've got the source code and documentation, and the system uses mainstream technology that any competent developer can easily learn. That's the straightforward truth, and it's a question worth asking anyone you're evaluating.",
  },
  {
    id: "faq-speed",
    question: "How do you deliver a phase in six weeks?",
    answer:
      "As full stack developers, AI engineers and solution architects with hundreds of projects behind us, we knew what good looked like long before AI came along. That matters more than it sounds. These tools will hand you something that looks right whether it is or not, and telling the difference is the work. Years of real deliveries taught us where AI adds value, where it quietly costs more than it saves, and how to verify what comes back. That's where the six weeks comes from, and it isn't something a subscription gives you. The specification, the decisions about how your business runs, and the review before anything ships stay with us, because those are the parts that go wrong when nobody is watching.",
  },
  {
    id: "faq-offshore",
    question: "Isn't it cheaper to use an offshore developer?",
    answer:
      "Cheaper per day, yes. Whether it's cheaper per outcome depends on how much specification and management you're able to do yourself. If you have someone technical who can direct the work, offshore can work well. If you don't, the cost usually reappears as rework.",
  },
  {
    id: "faq-diagnostic-charge",
    question: "Why is there a charge for the diagnostic?",
    answer:
      "Because it's real work, and it produces something you keep: a specification and a fixed quote you can take to any developer. It costs a fraction of the build it prices, and it's the only honest way to give you a fixed number instead of a range. Free quotes are priced into somebody's rate somewhere.",
  },
  {
    id: "faq-general-cost",
    question: "How much does custom software cost in general?",
    answer:
      "A system covering one business process, with a handful of roles, an integration or two and some data to migrate, is typically quoted between £15,000 and £30,000 in the UK. Smaller single-purpose tools run £5,000 to £10,000. Departmental systems covering several processes run £30,000 to £80,000.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default async function PricingPage() {
  const navCategories = await getNavCategories();
  const phoneHref = `tel:${siteConfig.phone.replace(/-/g, "")}`;

  return (
    <>
      <JsonLd data={faqSchema} id="pricing-faq" />
      <PricingAnalytics />
      <div className="print:hidden">
        <Header categories={navCategories} />
      </div>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <DottedBackground />
          <Container className="relative max-w-[60rem]">
            <div className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:col-span-5 md:text-5xl lg:text-6xl">
                What it costs
              </h1>
              <div className="space-y-5 md:col-span-7">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Most development companies won&apos;t publish prices. The
                  reason given is that every project is different. The real
                  reason is that the number depends on what they think
                  you&apos;ll pay.
                </p>
                <p className="text-lg leading-relaxed text-foreground">
                  So here&apos;s ours. What the work costs, how it&apos;s broken
                  into stages, and what you&apos;re committing to at each one.
                  The prices are fixed. You&apos;ll know before you call whether
                  this is worth your time.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* The ladder */}
        <section className="bg-muted/30 py-16 md:py-20">
          <Container className="max-w-[60rem]">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                How the work is structured
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Everything starts with a paid diagnostic. Then the first build
                phase takes one process and gets it working, usually in about
                six weeks. That&apos;s soon enough to see whether it does what
                you need, and whether we&apos;ve understood how you work, before
                you commit to anything bigger. Later phases follow the same
                shape. You decide whether to continue at the end of each one.
              </p>
            </div>
            {/* Subgrid so the name, price and description bands line up across
                all three cards regardless of how long each card's copy runs —
                the durations and price notes are very different lengths. */}
            <div className="grid gap-6 md:grid-cols-3 md:grid-rows-[auto_auto_1fr]">
              {ladder.map((item) => (
                <div
                  key={item.name}
                  className={cn(
                    // gap-6 matches the parent's row gap, so the bands sit the
                    // same distance apart whether the card is subgridded (md+)
                    // or a plain one-column grid (mobile).
                    "relative grid gap-6 rounded-xl border bg-background md:row-span-3 md:grid-rows-subgrid",
                    item.startHere
                      ? "border-primary/40 shadow-md shadow-primary/10"
                      : "border-border",
                  )}
                >
                  {item.startHere && (
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
                  <div className="relative px-6 pt-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
                          item.startHere
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground",
                        )}
                        aria-hidden="true"
                      >
                        {item.step}
                      </span>
                      {item.startHere && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          Start here
                        </span>
                      )}
                    </div>
                    <h3 className="mb-1 text-xl font-semibold">{item.name}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.duration}
                    </p>
                  </div>
                  <div className="relative px-6">
                    {item.priceLabel && (
                      <p className="mb-1 text-sm text-muted-foreground">
                        {item.priceLabel}
                      </p>
                    )}
                    <p className="text-3xl font-bold tracking-tight tabular-nums">
                      {item.price}
                    </p>
                    {item.pricePeriod && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.pricePeriod}
                      </p>
                    )}
                    {item.priceNote && (
                      <p className="mt-2 text-sm font-normal leading-relaxed text-muted-foreground">
                        {item.priceNote}
                      </p>
                    )}
                  </div>
                  <div className="relative px-6 pb-6">
                    <p className="border-t border-border pt-6 leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              All prices exclude VAT.
            </p>
            <div className="mt-10 text-center print:hidden">
              <PricingCta position="ladder" />
              <p className="mt-3 text-sm text-foreground">
                The next step is a short call, not a payment.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                £950 ex VAT &middot; on site with you &middot; the spec is yours
                to keep
              </p>
            </div>
          </Container>
        </section>

        {/* Sentinel: the mobile sticky bar appears after this scrolls out of view */}
        <div id="pricing-ladder-end" aria-hidden="true" />

        {/* Included / not included */}
        <section className="py-16 md:py-20">
          <Container className="max-w-[60rem]">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
              What&apos;s included
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="mb-5 border-b border-dashed border-border pb-4 text-xl font-semibold">
                  Included in every build
                </h3>
                <ul className="space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <Check
                        className="mt-1 h-5 w-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-6">
                <h3 className="mb-5 border-b border-dashed border-border pb-4 text-xl font-semibold">
                  Not included
                </h3>
                <ul className="space-y-3">
                  {notIncluded.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <Minus
                        className="mt-1 h-5 w-5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* Payment terms */}
        <section className="border-t border-border py-16 md:py-20">
          <Container className="max-w-[45rem]">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
              Payment terms
            </h2>
            <ul className="rounded-xl border border-border bg-background px-6">
              {paymentTerms.map((term) => (
                <li
                  key={term}
                  className="border-b border-dashed border-border py-4 leading-relaxed text-muted-foreground last:border-b-0"
                >
                  {term}
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-border py-16 md:py-20">
          <Container className="max-w-[45rem]">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">Questions</h2>
            <div className="rounded-xl border border-border bg-background px-6 [&>details:last-child]:border-b-0">
              {faqs.map((faq, index) => (
                <PricingFaqItem
                  key={faq.id}
                  id={faq.id}
                  question={faq.question}
                  defaultOpen={index === 0}
                >
                  <p>{faq.answer}</p>
                </PricingFaqItem>
              ))}
            </div>
          </Container>
        </section>

        {/* Closing CTA */}
        <section className="relative bg-muted/30 py-16 md:py-24">
          <GridLineHorizontal className="top-0" offset="200px" />
          <GridLineHorizontal className="bottom-0 top-auto" offset="200px" />
          <Container className="relative max-w-[45rem] text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Find out what yours would cost
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We come to you. You leave with your process mapped, a written
              specification, and a fixed price. £950, and the spec is yours
              professionally completed and ready for you to approve before we start the work.
            </p>
            <div className="print:hidden">
              <PricingCta position="closing" />
              <p className="mt-3 text-sm text-foreground">
                The next step is a short call, not a payment.
              </p>
              <p className="mt-2">
                <a
                  href={phoneHref}
                  className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  Or call {siteConfig.phone}
                </a>
              </p>
            </div>
          </Container>
        </section>

        {/* Prices reviewed + print-only footer */}
        <Container className="max-w-[45rem] py-8">
          <p className="text-center text-sm text-muted-foreground">
            Prices reviewed August 2026
          </p>
          <p className="mt-4 hidden text-center text-sm print:block">
            www.solvewithsoftware.com &middot; {siteConfig.phone}
          </p>
        </Container>
      </main>
      <div className="print:hidden">
        <Footer categories={navCategories} />
      </div>
      <StickyCtaBar />
    </>
  );
}
