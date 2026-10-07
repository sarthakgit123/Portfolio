"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { navItems, personal } from "@/data";
import { useActiveSection } from "@/hooks/use-active-section";
import { useSmoothScroll } from "@/components/providers/smooth-scroll";
import { cn } from "@/lib/utils";
import type { SectionId } from "@/types";

const SECTION_IDS = navItems.map((item) => item.id);

export function Header() {
  const active = useActiveSection(SECTION_IDS);
  const { scrollTo } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // The bar only takes on its glass treatment once the hero is behind it —
  // at the very top it should feel like part of the hero, not a chrome strip.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page while the mobile menu is open, and close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const go = (id: SectionId) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5">
        <motion.nav
          aria-label="Primary"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "flex w-full max-w-3xl items-center justify-between gap-4 rounded-full px-2 py-2 transition-all duration-500 sm:px-3",
            scrolled
              ? "glass shadow-[0_8px_32px_-12px_rgba(0,0,0,0.9)]"
              : "border border-transparent bg-transparent",
          )}
        >
          <button
            type="button"
            onClick={() => go("home")}
            className="ml-2 shrink-0 font-mono text-sm tracking-tight text-foreground transition-opacity hover:opacity-70 sm:ml-3"
          >
            <span className="text-[var(--accent-from)]">/</span>sks
          </button>

          {/* Desktop links with a sliding active pill. */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-white/10"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    ) : null}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={personal.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-4 py-1.5 text-sm text-foreground transition-colors duration-300 hover:bg-white/[0.06] sm:inline-flex"
            >
              Resume
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--border-strong)] text-foreground transition-colors hover:bg-white/[0.06] md:hidden"
            >
              {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile menu — full sheet, large type, keeps the hierarchy of the site. */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col justify-center px-8 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl" />
            <ul className="relative space-y-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.05 + i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <button
                    type="button"
                    onClick={() => go(item.id)}
                    className="flex w-full items-baseline gap-4 py-3 text-left"
                  >
                    <span className="font-mono text-xs text-[var(--accent-from)]">
                      0{i + 1}
                    </span>
                    <span
                      className={cn(
                        "text-3xl font-medium tracking-[-0.02em] transition-colors",
                        active === item.id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>

            <motion.a
              href={personal.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Resume
              <ArrowUpRight className="size-4" />
            </motion.a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
