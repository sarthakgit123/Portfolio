"use client";

import { cn } from "@/lib/utils";

/**
 * Magic UI style marquee. Children are rendered twice so the track can loop
 * seamlessly at -50%; the duplicate is hidden from assistive tech.
 *
 * Pauses on hover and freezes entirely under reduced motion.
 */
export function Marquee({
  children,
  className,
  duration = 40,
  reverse = false,
  pauseOnHover = true,
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={cn("group flex overflow-hidden", className)}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      {[0, 1].map((index) => (
        <div
          key={index}
          aria-hidden={index === 1 ? "true" : undefined}
          className={cn(
            "flex shrink-0 items-center gap-3 pr-3 motion-safe:animate-marquee",
            "motion-reduce:animate-none",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
