"use client";

import { ArrowUp } from "lucide-react";
import { personal } from "@/data";
import { useSmoothScroll } from "@/components/providers/smooth-scroll";

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t px-6 py-7 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
        <p className="font-mono text-xs text-muted-foreground">
          © {year} {personal.name}
        </p>

        <p className="order-3 font-mono text-xs text-muted-foreground/60 sm:order-none">
          Built with Next.js, Tailwind CSS, Motion &amp; GSAP
        </p>

        <button
          type="button"
          onClick={() => scrollTo("home")}
          className="group inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to top
          <ArrowUp className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
