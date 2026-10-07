"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A photograph treated as part of the page rather than as a profile card.
 *
 * Three things do the work:
 *  - a gradient mask that dissolves the lower edge into the background, so the
 *    image never reads as a rectangle sitting on top of the layout;
 *  - a desaturating filter that eases off on hover, keeping the photo inside
 *    the monochrome system while still rewarding attention;
 *  - a soft neutral glow behind the frame for separation from pure black.
 *
 * next/image handles responsive sizing and lazy loading; only the hero
 * portrait sets `priority`, because it is above the fold.
 */
export function Portrait({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  imageClassName,
  sizes = "(max-width: 1024px) 60vw, 30vw",
  fade = "bottom",
  shape = "panel",
  objectPosition = "50% 30%",
  compact = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  /** Which edge dissolves into the page. Ignored when `shape` is "circle". */
  fade?: "bottom" | "bottom-left" | "bottom-right";
  /** "circle" uses a soft radial mask so the edge reads as organic, not cut. */
  shape?: "panel" | "circle";
  objectPosition?: string;
  /**
   * For the small circular mark in the hero. The dissolving mask and the dark
   * scrim below are sized for a portrait a few hundred pixels across; at 56px
   * they overlap almost the whole image and it reads as a grey smudge. Compact
   * keeps a crisp edge, drops the scrim, and leans on the ring instead.
   */
  compact?: boolean;
}) {
  const isCircle = shape === "circle";
  // Circle: a radial falloff rather than a hard crop, so the edge dissolves
  // instead of reading as a cut-out badge.
  // Panel: a touch of fade at the top as well, so the frame never reads as a
  // card sitting on the page. The subject's head sits well below the 10% mark.
  const maskImage = isCircle
    ? compact
      ? undefined
      : "radial-gradient(circle at 50% 46%, black 54%, rgba(0,0,0,0.75) 72%, transparent 94%)"
    : fade === "bottom"
      ? "linear-gradient(to bottom, transparent 0%, black 11%, black 58%, transparent 97%)"
      : fade === "bottom-left"
        ? "linear-gradient(to bottom, transparent 0%, black 11%, black 60%, transparent 97%), linear-gradient(to left, black 72%, transparent 100%)"
        : "linear-gradient(to bottom, transparent 0%, black 11%, black 60%, transparent 97%), linear-gradient(to right, black 72%, transparent 100%)";

  // Two gradients must both keep a pixel for it to show, hence intersect.
  const maskComposite = isCircle || fade === "bottom" ? undefined : "intersect";

  return (
    <motion.div
      className={cn("group/portrait relative", className)}
      initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isCircle ? "aspect-square rounded-full" : "rounded-[1.75rem]",
        )}
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          maskComposite,
          WebkitMaskComposite: maskComposite === "intersect" ? "source-in" : undefined,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          style={isCircle ? { objectPosition } : undefined}
          className={cn(
            "h-full w-full object-cover",
            // Graded to sit inside the monochrome system; hover restores a
            // little life without breaking the palette.
            compact
              ? "[filter:grayscale(0.85)_contrast(1.1)_brightness(1.02)]"
              : "[filter:grayscale(1)_contrast(1.06)_brightness(0.86)]",
            "transition-[filter,transform] duration-[900ms] ease-out",
            compact
              ? "group-hover/portrait:[filter:grayscale(0.4)_contrast(1.06)_brightness(1.08)]"
              : "group-hover/portrait:[filter:grayscale(0.72)_contrast(1.04)_brightness(0.96)]",
            "group-hover/portrait:scale-[1.03]",
            imageClassName,
          )}
        />

        {/* Dark scrim: keeps any adjacent text legible over the image, and
            sinks the lower edge of the circle into the background. No text
            sits over the compact mark, so it does not need one — and at that
            size the gradient covers nearly the whole face. */}
        {compact ? null : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: isCircle
                ? "linear-gradient(to top, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0.18) 42%, transparent 72%)"
                : "linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.25) 38%, rgba(5,5,5,0.08) 70%, rgba(5,5,5,0.3) 100%)",
            }}
          />
        )}

        {/* Hairline, inset so it reads as a light edge rather than a border.
            Kept very faint on large images — the mask, not the edge, defines
            the shape. The compact mark has no mask, so the ring is what gives
            it a defined edge against the planet behind it. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 ring-inset",
            compact
              ? "ring-2 ring-white/25"
              : "ring-1 ring-white/[0.06]",
            isCircle ? "rounded-full" : "rounded-[1.75rem]",
          )}
        />
      </div>
    </motion.div>
  );
}
