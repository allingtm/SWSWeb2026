import { Metadata } from "next";
import { Clock, FileText, Tag, Workflow } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  DottedBackground,
  GridLineHorizontal,
} from "@/components/pricing/grid-lines";
import { DiagnosticAnalytics } from "@/components/pricing/diagnostic-analytics";
import { DiagnosticCallButton } from "@/components/pricing/diagnostic-call-button";
import { CallbackForm } from "@/components/pricing/callback-form";
import { getNavCategories } from "@/lib/supabase/queries";
import { generateMetadata as generateSiteMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/constants";

// Diagnostic booking page. Booking is by phone (a deliberate qualifying step,
// not a stopgap) with a callback request as the second completion path.
// Online payment (phase 2) will slot in here without touching /pricing.
// noindex: this is a conversion step reached from /pricing, not a landing page.
export const metadata: Metadata = {
  ...generateSiteMetadata({
    title: "Book a Diagnostic",
    description:
      "Book a diagnostic: your process mapped, a written specification, and a fixed price to build it. £950 + VAT, yours to keep whether or not we work together.",
    path: "/book-diagnostic",
  }),
  robots: { index: false, follow: false },
};

const deliverables = [
  {
    icon: Workflow,
    title: "Your process mapped",
    description:
      "How the work actually runs today, written down — including the parts nobody has documented.",
  },
  {
    icon: FileText,
    title: "A written specification",
    description:
      "What the software needs to do, in enough detail that any competent developer could quote from it.",
  },
  {
    icon: Tag,
    title: "A fixed price to build it",
    description:
      "A firm number, not a range. Yours to keep whether or not we work together.",
  },
];

const steps = [
  {
    title: "The call",
    description: "A short call to check the fit and agree a date.",
  },
  {
    title: "The invoice",
    description: "£950 + VAT, payable before the visit.",
  },
  {
    title: "The visit",
    description:
      "On site with you and whoever runs the process day to day.",
  },
  {
    title: "The documents",
    description:
      "Your spec, fixed quote and recommendation, within five working days.",
  },
];

export default async function BookDiagnosticPage() {
  const navCategories = await getNavCategories();
  const phoneHref = `tel:${siteConfig.phone.replace(/-/g, "")}`;

  return (
    <>
      <DiagnosticAnalytics />
      <Header categories={navCategories} />
      <main className="min-h-screen">
        {/* Hero — copy on the left, the booking card as the page's one clear action */}
        <section className="relative overflow-hidden py-14 md:py-20">
          <DottedBackground />
          <Container className="relative max-w-[68rem]">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Step one
                </span>
                <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                  Book a diagnostic
                </h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  We come to you. You leave with your process mapped, a written
                  specification, and a fixed price to build it - yours to keep
                  whether or not we work together.
                </p>

                <ul className="mt-10 space-y-6 border-t border-dashed border-border pt-8">
                  {deliverables.map((item) => (
                    <li key={item.title} className="flex gap-4">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50"
                        aria-hidden="true"
                      >
                        <item.icon className="h-5 w-5 text-primary" />
                      </span>
                      <div>
                        <h2 className="font-semibold">{item.title}</h2>
                        <p className="mt-1 leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Booking card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl border border-primary/40 bg-background shadow-sm lg:sticky lg:top-20">
                  {/* Live pointer glow rather than the static ring used on
                      /pricing — this is the page's single conversion element,
                      so it earns the movement. */}
                  <GlowingEffect
                    variant="brand"
                    spread={38}
                    glow
                    disabled={false}
                    proximity={72}
                    inactiveZone={0.01}
                    borderWidth={2}
                  />
                  <div className="relative p-6 md:p-8">
                    <p className="text-sm font-medium text-muted-foreground">
                      Diagnostic, fixed price
                    </p>
                    <p className="mt-2 flex items-baseline gap-2">
                      <span className="text-4xl font-bold tracking-tight tabular-nums">
                        £950
                      </span>
                      <span className="text-lg font-medium text-muted-foreground">
                        + VAT
                      </span>
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Payable in advance. On site with you, wherever the work
                      happens.
                    </p>

                    <div
                      className="my-6 border-t border-dashed border-border"
                      aria-hidden="true"
                    />

                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      Booking is by phone, because a two-minute conversation
                      tells us both whether we are a good fit.
                    </p>
                    <DiagnosticCallButton
                      phone={siteConfig.phone}
                      position="booking-card"
                    />
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      Mon–Fri, 9am–5:30pm
                    </p>

                    <div
                      className="my-6 border-t border-dashed border-border"
                      aria-hidden="true"
                    />

                    <p className="text-center text-sm text-muted-foreground">
                      Can&apos;t call right now?{" "}
                      <a
                        href="#callback"
                        className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-primary"
                      >
                        Request a callback
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* What happens next */}
        <section className="border-y border-border bg-muted/30 py-16 md:py-20">
          <Container className="max-w-[68rem]">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">What happens next</h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Four steps from the first call to the documents in your hands.
              </p>
            </div>
            <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
              {steps.map((step, index) => (
                <li key={step.title}>
                  <div className="mb-5 flex items-center">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-background text-sm font-semibold text-primary tabular-nums"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="ml-3 hidden h-px flex-1 bg-[linear-gradient(to_right,var(--border),var(--border)_50%,transparent_0,transparent)] [background-size:6px_1px] md:block"
                      />
                    )}
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* Callback request */}
        <section
          id="callback"
          className="relative scroll-mt-20 py-16 md:py-20"
        >
          <GridLineHorizontal className="bottom-0 top-auto" offset="200px" />
          <Container className="relative max-w-[45rem]">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                Can&apos;t call right now?
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Leave your details and we&apos;ll ring you back at a time that
                suits.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm md:p-8">
              <CallbackForm />
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Or call{" "}
              <a
                href={phoneHref}
                className="underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {siteConfig.phone}
              </a>{" "}
              &middot; Mon–Fri, 9am–5:30pm
            </p>
          </Container>
        </section>
      </main>
      <Footer categories={navCategories} />
    </>
  );
}
