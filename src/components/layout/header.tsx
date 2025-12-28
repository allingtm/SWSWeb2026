"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlogCategory } from "@/types";

// Lazy-load SearchModal - only loaded when search is triggered
const SearchModal = dynamic(
  () => import("@/components/blog/search-modal").then((mod) => mod.SearchModal),
  { ssr: false }
);

// Lazy-load MobileMenu - defers framer-motion until menu is opened
const MobileMenu = dynamic(
  () => import("./mobile-menu").then((mod) => mod.MobileMenu),
  { ssr: false }
);

interface HeaderProps {
  categories: BlogCategory[];
}

export function Header({ categories }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
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

      {/* Lazy-loaded mobile menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
      />

      {/* Lazy-loaded search modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
