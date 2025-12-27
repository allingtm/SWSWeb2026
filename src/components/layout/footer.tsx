import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { CookiePreferencesButton } from "@/components/cookies";
import type { BlogCategory } from "@/types";

interface FooterProps {
  categories: BlogCategory[];
}

const navigation = {
  company: [
    { name: "About", href: "/about" },
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
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@solvewithsoftware",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@solvewithsoftware",
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
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/solve-with-software-logo.png"
                alt="Solve With Software"
                width={176}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-foreground">
                Solve With Software
              </span>
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
                >
                  <span className="text-sm">{item.name}</span>
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
