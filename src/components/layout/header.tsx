"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import type { BlogCategory } from "@/types";

interface HeaderProps {
  categories: BlogCategory[];
}

export function Header({ categories }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/solve-with-software-logo.png"
                alt="Solve With Software"
                width={220}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Right side - All screens */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Link>
            </Button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Slide-out menu - Outside header to avoid containment issues */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[100] w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/solve-with-software-logo.png"
                    alt="Solve With Software"
                    width={176}
                    height={32}
                    className="h-8 w-auto"
                  />                 
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-border">
                  {/* Categories */}
                  <div className="space-y-1 py-6">
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </p>
                    <Link
                      href="/"
                      className={cn(
                        "block rounded-lg px-3 py-2 text-base font-medium",
                        pathname === "/"
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Explore
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.slug}`}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-base font-medium",
                          pathname === `/${category.slug}`
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  {/* Actions */}
                  <div className="py-6 space-y-2">
                    <Button asChild className="w-full">
                      <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                        Contact Us
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
