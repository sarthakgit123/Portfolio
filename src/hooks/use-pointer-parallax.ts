"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Pointer-driven parallax, measured from the centre of the viewport.
 *
 * Listens on the window rather than on an element, because the layers that
 * want this effect sit behind the UI with `pointer-events: none` and would
 * never receive mouse events of their own.
 *
 * Returns spring-smoothed pixel offsets. Give background layers a small
 * negative `strength` and foreground layers a positive one to separate them.
 */
export function usePointerParallax(strength = 14): {
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const prefersReducedMotion = usePrefersReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 22, mass: 0.7 });
  const y = useSpring(rawY, { stiffness: 60, damping: 22, mass: 0.7 });

  useEffect(() => {
    if (prefersReducedMotion) {
      rawX.set(0);
      rawY.set(0);
      return;
    }

    // Touch devices have no hover pointer to track.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: MouseEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      rawX.set(nx * strength * 2);
      rawY.set(ny * strength * 2);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [prefersReducedMotion, strength, rawX, rawY]);

  return { x, y };
}
