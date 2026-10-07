"use client";

import { useEffect, useState } from "react";
import type { SectionId } from "@/types";

/**
 * Scroll-spy for the nav indicator.
 *
 * Uses a band across the upper-middle of the viewport rather than element
 * visibility ratios: sections here differ wildly in height, and ratio-based
 * observers make short sections effectively unreachable.
 */
export function useActiveSection(ids: SectionId[]): SectionId {
  const [active, setActive] = useState<SectionId>(ids[0]);

  useEffect(() => {
    const getActive = () => {
      const line = window.innerHeight * 0.35;
      let current = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top } = el.getBoundingClientRect();
        if (top - line <= 0) current = id;
      }

      // Pin the last section once the page is scrolled to the very bottom,
      // otherwise a short final section never becomes active.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2;
      if (atBottom) current = ids[ids.length - 1];

      setActive(current);
    };

    getActive();
    window.addEventListener("scroll", getActive, { passive: true });
    window.addEventListener("resize", getActive);
    return () => {
      window.removeEventListener("scroll", getActive);
      window.removeEventListener("resize", getActive);
    };
  }, [ids]);

  return active;
}
