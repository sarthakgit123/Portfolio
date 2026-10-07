"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll parallax. `distance` is the total travel in pixels across the
 * element's journey through the viewport — negative moves it against the
 * scroll (reads as "further away"), positive moves it with the scroll.
 *
 * Springing the output keeps it from feeling mechanically pinned to the
 * scrollbar. Disabled entirely under reduced motion.
 */
export function Parallax({
  children,
  className,
  distance = -60,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  const y = useSpring(raw, { stiffness: 120, damping: 28, mass: 0.5 });

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={cn("will-change-transform", className)}>
      {children}
    </motion.div>
  );
}
