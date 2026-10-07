"use client";

import { ArrowUpRight } from "lucide-react";
import type { Experience } from "@/types";
import { Parallax } from "@/components/ui/parallax";

/**
 * One experience entry. Structure only — the scroll choreography is owned by
 * the parent section's GSAP context so all the timing lives in one place.
 */
export function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <article
      data-experience-item
      className="group relative border-t border-[var(--border)] pt-8 sm:pt-10"
    >
      {/* Hairline that wipes across on entry. */}
      <span
        aria-hidden="true"
        data-experience-rule
        className="absolute -top-px left-0 h-px w-full origin-left accent-gradient"
      />

      {/* Oversized ghost year, bleeding off the left edge. */}
      <Parallax
        distance={-34}
        className="pointer-events-none absolute -top-4 right-0 select-none lg:left-0 lg:right-auto"
      >
        <span
          aria-hidden="true"
          data-experience-year
          className="block text-[clamp(4rem,12vw,10rem)] font-medium leading-none tracking-[-0.05em] text-white/[0.035] transition-colors duration-700 group-hover:text-white/[0.06]"
        >
          {experience.year}
        </span>
      </Parallax>

      <div className="relative grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:col-start-6 xl:col-start-6">
          <p className="font-mono text-xs tracking-[0.1em] text-[var(--accent-from)]">
            {experience.period}
          </p>

          <h3 className="mt-4 text-[clamp(1.35rem,2.6vw,2rem)] font-medium leading-tight tracking-[-0.025em] text-foreground">
            {experience.role}
          </h3>

          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="text-foreground/80">{experience.company}</span>
            {experience.location ? (
              <>
                <span className="text-white/20">·</span>
                {experience.location}
              </>
            ) : null}
            {experience.repo ? (
              <a
                href={experience.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group/repo inline-flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <span className="text-white/20">·</span>
                Repo
                <ArrowUpRight className="size-3 transition-transform duration-300 group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5" />
              </a>
            ) : null}
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-6 xl:col-span-6">
          <p className="max-w-xl text-[0.975rem] leading-relaxed text-foreground/75">
            {experience.summary}
          </p>

          <ul className="mt-6 space-y-3">
            {experience.highlights.map((highlight, i) => (
              <li
                key={i}
                className="flex max-w-xl gap-3.5 text-[0.9rem] leading-relaxed text-muted-foreground"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] size-1 shrink-0 rounded-full bg-[var(--accent-from)]/70"
                />
                {highlight}
              </li>
            ))}
          </ul>

          <ul className="mt-7 flex flex-wrap gap-2">
            {experience.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-[var(--border)] bg-white/[0.02] px-3 py-1 font-mono text-[0.7rem] text-muted-foreground transition-colors duration-300 hover:border-[var(--border-strong)] hover:text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
