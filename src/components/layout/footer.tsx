"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { CookiePreferencesButton } from "@/components/cookies";
import type { BlogCategory } from "@/types";

interface FooterProps {
  categories: BlogCategory[];
}

type IconProps = React.SVGProps<SVGSVGElement>;

function LinkedInIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .59.05.87.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.09 20.6a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.13-.1z" />
    </svg>
  );
}

function YouTubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
    </svg>
  );
}

const navigation = {
  company: [
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookie-policy" },
  ],
  social: [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/solvewithsoftware",
      icon: LinkedInIcon,
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@solvewithsoftware",
      icon: TikTokIcon,
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@solvewithsoftware",
      icon: YouTubeIcon,
    },
  ],
};

export function Footer({ categories }: FooterProps) {
  return (
    <footer className="bg-muted/50 border-t border-border" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container className="pb-8 pt-16 sm:pt-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Link href="/" className="flex items-center">
              <Image
                src="/solve-with-software-logo.png"
                alt="Solve With Software"
                width={176}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Expert insights on software development, AI, automation, and digital
              transformation. Practical advice for businesses navigating technology decisions.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Categories
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/${category.slug}`}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Legal
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <CookiePreferencesButton />
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  Contact
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a
                      href="tel:01206848428"
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      01206-848428
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:hello@solvewithsoftware.com"
                      className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      hello@solvewithsoftware.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-border pt-8 sm:mt-20">
          <p className="text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} Solve With Software Ltd. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
