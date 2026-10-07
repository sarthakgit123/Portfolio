"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Magnetic hover: the element drifts toward the pointer and springs back.
 *
 * Pull is capped by `strength` (a fraction of the element's own half-size) so
 * the effect scales with the button rather than flinging small ones around.
 * Pointer-coarse devices and reduced-motion users get a plain wrapper — there
 * is no cursor to attract to on touch.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    x.set(offsetX * strength);
    y.set(offsetY * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  if (prefersReducedMotion) {
    return <div className={cn("inline-flex", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex [@media(pointer:coarse)]:!transform-none", className)}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
