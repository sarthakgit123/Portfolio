"use client";

import { motion } from "motion/react";
import { Github, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { ProjectVisual } from "@/components/ui/project-visual";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial project showcase — deliberately not a card grid.
 *
 * Two changes drive this layout over the previous one. The panels no longer
 * overlap: the copy column used negative margins to sit on top of the visual,
 * which read as depth on a wide desktop and as a collision everywhere else,
 * and it forced the copy onto a translucent backdrop that had to stay dark to
 * hide the artwork underneath. A real gutter lets both panels sit on opaque
 * surfaces, which is most of the contrast win here.
 *
 * And each entry leads with its pipeline rather than its screenshot. The work
 * is systems work; naming the stages data actually moves through says more in
 * one line than a feature list does in five.
 */
export function ProjectItem({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const featured = project.featured === true;
  // Alternate sides below the lead, which is always full width.
  const flip = !featured && index % 2 === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: EASE }}
      className="group relative"
    >
      {/* Meta rail: index, discipline, year — one hairline across the top, so
          every entry starts from the same datum regardless of which side its
          artwork lands on. */}
      <div className="mb-6 flex items-baseline gap-4 border-t border-[var(--border-strong)] pt-4">
        <span className="font-mono text-[0.7rem] tabular-nums text-[var(--accent)]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          {project.kind}
        </span>
        {featured ? (
          <span className="rounded-full border border-[var(--accent)]/45 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--accent)]">
            Lead project
          </span>
        ) : null}
        <span className="ml-auto font-mono text-[0.7rem] tabular-nums text-muted-foreground">
          {project.year}
        </span>
      </div>

      <div
        className={cn(
          "grid gap-7 lg:gap-10",
          featured ? "lg:grid-cols-12" : "lg:grid-cols-2",
        )}
      >
        {/* Copy */}
        <div
          className={cn(
            featured && "lg:col-span-5 lg:row-start-1",
            !featured && "lg:row-start-1",
            flip && !featured && "lg:col-start-2",
          )}
        >
          <div className="flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-7 transition-colors duration-500 group-hover:border-[var(--border-strong)] sm:p-8">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent)]">
              {project.tagline}
            </p>

            <h3
              className={cn(
                "mt-3.5 font-medium leading-[1.04] tracking-[-0.035em] text-foreground",
                featured
                  ? "text-[clamp(1.9rem,3.6vw,2.9rem)]"
                  : "text-[clamp(1.5rem,2.6vw,2rem)]",
              )}
            >
              {project.name}
            </h3>

            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            {/* Metrics */}
            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block text-[1.6rem] font-medium leading-none tracking-[-0.03em] text-gradient">
                      {metric.value}
                    </span>
                    <span className="mt-2 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {metric.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            {/* The progression marker — one quiet line, no heading block. */}
            <p className="mt-6 border-t border-[var(--border)] pt-5 text-[0.88rem] leading-relaxed text-foreground/85">
              {project.learning}
            </p>

            {/* Stack */}
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface-hi)] px-2.5 py-1 font-mono text-[0.68rem] text-muted-foreground transition-colors duration-300 hover:border-[var(--border-strong)] hover:text-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {/* Actions. `mt-auto` pins these to the bottom so both panels in a
                row end on the same line even when the copy differs in length. */}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
              {project.repo ? (
                <Magnetic strength={0.25}>
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm text-foreground transition-colors duration-300 hover:bg-white/[0.08]"
                  >
                    <Github className="size-4" />
                    GitHub
                  </a>
                </Magnetic>
              ) : null}

              {project.demo ? (
                <Magnetic strength={0.25}>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/demo inline-flex items-center gap-2 rounded-full bg-[#eef3f4] px-5 py-2.5 text-sm font-medium text-[#050607] transition-colors duration-300 hover:bg-white"
                  >
                    Live Demo
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/demo:translate-x-0.5 group-hover/demo:-translate-y-0.5" />
                  </a>
                </Magnetic>
              ) : null}
            </div>
          </div>
        </div>

        {/* Visual + pipeline */}
        <div
          className={cn(
            featured && "lg:col-span-7 lg:row-start-1 lg:col-start-6",
            !featured && "lg:row-start-1",
            flip && !featured && "lg:col-start-1 lg:row-start-1",
          )}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_30px_80px_-30px_rgba(0,0,0,1)] transition-colors duration-500 group-hover:border-[var(--border-strong)]">
            <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-3">
              <span className="size-2 rounded-full bg-white/20" />
              <span className="size-2 rounded-full bg-white/20" />
              <span className="size-2 rounded-full bg-white/20" />
              <span className="ml-2 font-mono text-[0.65rem] text-muted-foreground">
                {project.id}
              </span>
            </div>

            <ProjectVisual
              variant={project.id}
              className="aspect-16/10 w-full flex-1 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />

            {/* Pipeline. Wraps on narrow panels, and the separator is a real
                element rather than a pseudo-element so it wraps with the
                stages instead of stranding an arrow at a line end. */}
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-[var(--border)] px-4 py-3.5">
              {project.flow.map((stage, i) => (
                <li key={stage} className="flex items-center gap-2">
                  {i > 0 ? (
                    <span
                      aria-hidden="true"
                      className="font-mono text-[0.6rem] text-[var(--accent)]/70"
                    >
                      &rarr;
                    </span>
                  ) : null}
                  <span className="font-mono text-[0.66rem] tracking-[0.04em] text-muted-foreground">
                    {stage}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
