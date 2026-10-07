"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/data";
import { SectionLabel } from "@/components/ui/section-heading";
import { TextReveal } from "@/components/ui/reveal";
import { ExperienceItem } from "@/components/ui/ExperienceItem";

export function ExperienceSection() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-experience-item]").forEach((item) => {
          // fromTo (not from) states both ends explicitly. With `from`, a
          // refresh that lands mid-timeline can leave the element stranded at
          // opacity 0; fromTo always resolves to a known end state.
          gsap.fromTo(
            item,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.95,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 85%" },
            },
          );

          const rule = item.querySelector("[data-experience-rule]");
          if (rule) {
            gsap.fromTo(
              rule,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 1.3,
                ease: "power3.inOut",
                scrollTrigger: { trigger: item, start: "top 85%" },
              },
            );
          }
        });
      });

      return () => mm.revert();
    }, root);

    // Web fonts change text metrics after first paint; without this the
    // trigger positions are computed against the fallback font's layout.
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={root}
      className="relative scroll-mt-24 px-6 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel index="02" eyebrow="Experience" />

        <TextReveal
          as="h2"
          text="Where the work has actually shipped."
          delay={0.1}
          className="mt-6 max-w-3xl text-[clamp(1.75rem,4.2vw,3.1rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground"
        />

        <div className="mt-12 space-y-14 sm:mt-14 sm:space-y-18">
          {experiences.map((experience) => (
            <ExperienceItem key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  );
}
