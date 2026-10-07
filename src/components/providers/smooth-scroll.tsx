"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface SmoothScrollValue {
  /** Scroll to an element id. Falls back to native scrolling when Lenis is off. */
  scrollTo: (id: string) => void;
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Lenis smooth scrolling, driven by GSAP's ticker and wired into ScrollTrigger.
 *
 * Two things matter here:
 *  - ScrollTrigger must recompute on every Lenis frame, or pinned and scrubbed
 *    timelines drift away from the visual scroll position.
 *  - Lenis runs off GSAP's ticker instead of its own rAF loop, so the page has
 *    a single animation clock.
 *
 * When the user prefers reduced motion we skip Lenis entirely and hand scroll
 * back to the browser — smooth scrolling is precisely the kind of motion that
 * setting asks us to drop.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      lenisRef.current = null;
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch devices beats an emulated one.
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (lenisRef.current) {
      // Offset clears the fixed nav without leaving the heading jammed at the top.
      lenisRef.current.scrollTo(el, { offset: -80, duration: 1.2 });
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "auto" });
    }
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {/* Motion animates via rAF/WAAPI, which the reduced-motion CSS override
          cannot reach. reducedMotion="user" makes Motion drop transform and
          layout animations for those users while keeping opacity fades. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SmoothScrollContext.Provider>
  );
}
