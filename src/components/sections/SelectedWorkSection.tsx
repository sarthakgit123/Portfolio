"use client";

import { projects } from "@/data";
import { SectionLabel } from "@/components/ui/section-heading";
import { TextReveal } from "@/components/ui/reveal";
import { ProjectItem } from "@/components/ui/ProjectItem";

export function SelectedWorkSection() {
  return (
    <section
      id="projects"
      className="relative scroll-mt-24 overflow-hidden px-6 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionLabel index="03" eyebrow="Selected Work" />

        <TextReveal
          as="h2"
          text="Pipelines, not notebooks."
          delay={0.1}
          className="mt-6 max-w-3xl text-[clamp(1.75rem,4.2vw,3.1rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground"
        />

        <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
          Five builds across applied ML, AI systems, backend and analytics.
          Each one lists the stages its data actually moves through.
        </p>

        <div className="mt-12 space-y-16 sm:mt-14 sm:space-y-24">
          {projects.map((project, i) => (
            <ProjectItem key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
