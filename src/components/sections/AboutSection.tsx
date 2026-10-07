"use client";

import { motion } from "motion/react";
import { about, achievements, leadership } from "@/data";
import { SectionLabel } from "@/components/ui/section-heading";
import { TextReveal } from "@/components/ui/reveal";
import { Portrait } from "@/components/ui/portrait";
import { EducationTimeline } from "@/components/ui/EducationTimeline";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 overflow-hidden px-6 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionLabel index="01" eyebrow="About" />

        {/* Oversized statement — the section's whole argument in one line.
            Set larger than the other section heads now that it is a single
            short sentence: at four sentences the same size would have filled
            half the viewport. */}
        <TextReveal
          as="h2"
          text={about.lead}
          delay={0.1}
          className="mt-6 max-w-3xl text-[clamp(2rem,5.4vw,4.1rem)] font-medium leading-[1.04] tracking-[-0.04em] text-foreground"
        />

        {/* Principles. Three short statements under the lead, each with the
            work that backs it — the claim is in the type, the proof is in the
            line beneath, and the numeral keeps them reading as a set rather
            than as three loose remarks. */}
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:mt-14 lg:grid-cols-3">
          {about.principles.map(({ statement, evidence }, i) => (
            <motion.li
              key={statement}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="group bg-[var(--surface)] p-7 transition-colors duration-500 hover:bg-[var(--surface-raised)] sm:p-8"
            >
              <span className="font-mono text-[0.7rem] tabular-nums text-[var(--accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-5 text-[1.15rem] font-medium leading-snug tracking-[-0.02em] text-foreground">
                {statement}
              </p>
              <p className="mt-3.5 text-[0.875rem] leading-relaxed text-muted-foreground">
                {evidence}
              </p>
            </motion.li>
          ))}
        </ul>

        {/* Portrait and education share the row: the photograph holds the
            column the statement leaves empty, and the timeline occupies the
            space the prose used to. */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4 lg:row-start-1">
            <Portrait
              src="/portrait-secondary.jpg"
              alt="Sarthak Kumar Seth"
              width={720}
              height={1280}
              fade="bottom-right"
              sizes="(max-width: 640px) 68vw, (max-width: 1024px) 40vw, 24vw"
              className="w-[min(15rem,68vw)] sm:w-[min(18rem,44vw)] lg:w-full"
            />
          </div>

          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-center">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Education
            </h3>
            <div className="mt-7">
              <EducationTimeline />
            </div>
          </div>
        </div>

        {/* Recognition closes the section: selection and responsibility sit
            with the personal record rather than in a band of their own. */}
        <div className="mt-14 grid gap-10 border-t border-[var(--border)] pt-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Achievements
            </h3>
            <ul className="mt-7 space-y-7">
              {achievements.map(({ title, detail, icon: Icon }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.65, delay: i * 0.09, ease: EASE }}
                  className="group flex gap-5"
                >
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white/[0.03] text-[var(--accent)] transition-colors duration-500 group-hover:border-[var(--accent)]/40">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-[0.95rem] font-medium leading-snug tracking-[-0.01em] text-foreground">
                      {title}
                    </p>
                    <p className="mt-2 max-w-xl text-[0.875rem] leading-relaxed text-muted-foreground">
                      {detail}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Leadership
            </h3>
            <ul className="mt-7 space-y-6">
              {leadership.map((entry, i) => (
                <motion.li
                  // Organisation alone is no longer unique: both cells appear
                  // more than once now that the progression through their
                  // roles is listed rather than only the current title.
                  key={`${entry.organisation}-${entry.role}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-70px" }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.09, ease: EASE }}
                  className="border-l border-[var(--border)] pl-5 transition-colors duration-500 hover:border-[var(--accent)]/50"
                >
                  <p className="text-[0.925rem] leading-snug text-foreground">
                    {entry.role}
                  </p>
                  <p className="mt-1.5 text-[0.85rem] leading-relaxed text-muted-foreground">
                    {entry.organisation}
                  </p>
                  <p className="mt-2 font-mono text-[0.68rem] tracking-[0.06em] text-muted-foreground/70">
                    {entry.period}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
