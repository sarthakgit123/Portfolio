"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { TextReveal } from "@/components/ui/reveal";

/**
 * Eyebrow only — for sections that carry their own oversized statement and
 * would look formulaic with the full heading block.
 */
export function SectionLabel({
  index,
  eyebrow,
  className,
}: {
  index: string;
  eyebrow: string;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("flex items-center gap-3", className)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="h-px w-10 accent-gradient" />
      <span className="font-mono text-xs tracking-[0.2em] text-[var(--accent-from)]">
        {index}
      </span>
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </span>
    </motion.div>
  );
}

/**
 * Shared section header: a monospaced index/eyebrow above a large title.
 * The hairline rule grows in on scroll, which is what ties the sections
 * together visually without needing a card around everything.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="font-mono text-xs tracking-[0.2em] text-[var(--accent-from)]">
          {index}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </span>
      </motion.div>

      <TextReveal
        as="h2"
        text={title}
        delay={0.08}
        className="mt-5 max-w-3xl text-balance text-3xl font-medium leading-[1.1] tracking-[-0.02em] text-foreground sm:text-4xl md:text-[2.75rem]"
      />

      {description ? (
        <motion.p
          className={cn(
            "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground",
            align === "center" && "mx-auto",
          )}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {description}
        </motion.p>
      ) : null}

      <motion.div
        className="mt-10 h-px w-full origin-left bg-[var(--border)]"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
