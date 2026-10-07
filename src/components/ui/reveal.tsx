"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Standard section reveal: a short rise with a soft blur burn-off. Used for
 * blocks of content where per-word animation would be noise.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const wordContainer: Variants = {
  hidden: {},
  visible: (stagger: number = 0.045) => ({
    transition: { staggerChildren: stagger },
  }),
};

const wordChild: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE },
  },
};

/**
 * Word-by-word text reveal.
 *
 * Words are wrapped in an inline-block span inside an overflow-hidden line so
 * the rise reads as type settling rather than letters floating. The full string
 * stays in the accessibility tree via `aria-label`, and the animated spans are
 * hidden from it — screen readers get one clean sentence, not 12 fragments.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const MotionTag = motion[Tag];
  const words = text.split(" ");

  return (
    <MotionTag
      className={cn("inline-block", className)}
      aria-label={text}
      variants={wordContainer}
      custom={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span variants={wordChild} className="inline-block">
            {word}
          </motion.span>
          {i < words.length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </MotionTag>
  );
}
