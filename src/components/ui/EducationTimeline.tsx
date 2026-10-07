"use client";

import { motion } from "motion/react";
import { education } from "@/data";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Education as a vertical timeline.
 *
 * Built from the same parts as the rest of the system — a hairline rail,
 * hollow nodes, monospaced periods — so it reads as the experience timeline's
 * sibling rather than a separate widget. The rail stops at the last node
 * instead of running past it, which is what makes it read as a record with an
 * end rather than an open list.
 */
export function EducationTimeline() {
  return (
    <ol className="relative">
      {/* Rail. Inset top and bottom so it begins and ends on the outer nodes. */}
      <span
        aria-hidden="true"
        className="absolute left-[3.5px] top-2 bottom-2 w-px bg-[var(--border)]"
      />

      {education.map((entry, i) => (
        <motion.li
          key={`${entry.institution}-${entry.qualification}`}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.09, ease: EASE }}
          className="relative pl-7 pb-8 last:pb-0"
        >
          {/* Node — filled for the current course, hollow for completed ones. */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-[0.45rem] block size-2 rounded-full border border-[var(--accent)]"
            style={{
              backgroundColor: i === 0 ? "var(--accent)" : "var(--background)",
            }}
          />

          <p className="font-mono text-[0.7rem] tracking-[0.12em] text-[var(--accent)]">
            {entry.period}
          </p>

          <h4 className="mt-2 text-[0.95rem] leading-snug text-foreground">
            {entry.institution}
            <span className="text-muted-foreground">, {entry.location}</span>
          </h4>

          <p className="mt-1 text-[0.875rem] leading-relaxed text-muted-foreground">
            {entry.qualification}
          </p>

          {entry.score ? (
            <p className="mt-1.5 font-mono text-[0.72rem] tracking-[0.06em] text-foreground/60">
              {entry.score}
            </p>
          ) : null}
        </motion.li>
      ))}
    </ol>
  );
}
