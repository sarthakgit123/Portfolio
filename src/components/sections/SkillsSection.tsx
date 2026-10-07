"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { skillGroups } from "@/data";
import { SectionLabel } from "@/components/ui/section-heading";
import { TextReveal } from "@/components/ui/reveal";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** The technologies carrying the most weight across the work above. */
const CORE = [
  "Python",
  "FastAPI",
  "Django",
  "PostgreSQL",
  "FAISS",
  "RAG",
  "Sentence-BERT",
  "Gemini API",
  "Docker",
  "TensorFlow",
  "Scikit-learn",
  "n8n",
];

export function SkillsSection() {
  const [active, setActive] = useState(0);
  const group = skillGroups[active];

  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden px-6 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionLabel index="04" eyebrow="Skills" />

        <TextReveal
          as="h2"
          text="The toolkit, grouped by what it's for."
          delay={0.1}
          className="mt-6 max-w-3xl text-[clamp(1.75rem,4.2vw,3.1rem)] font-medium leading-[1.08] tracking-[-0.035em] text-foreground"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* Category selector — oversized, no boxes. */}
          <div role="tablist" aria-label="Skill categories" className="flex flex-col">
            {skillGroups.map((item, i) => {
              const Icon = item.icon;
              const isActive = i === active;
              return (
                <button
                  key={item.id}
                  role="tab"
                  id={`skills-tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls={`skills-panel-${item.id}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "group relative flex items-center gap-4 border-b border-[var(--border)] py-4 text-left transition-colors duration-300",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
                  )}
                >
                  {/* Active indicator slides between rows. */}
                  {isActive ? (
                    <motion.span
                      layoutId="skill-active"
                      className="absolute -bottom-px left-0 h-px w-full accent-gradient"
                      transition={{ type: "spring", stiffness: 340, damping: 32 }}
                    />
                  ) : null}

                  <span
                    className={cn(
                      "font-mono text-[0.7rem] tabular-nums transition-colors duration-300",
                      isActive ? "text-[var(--accent-from)]" : "text-muted-foreground/50",
                    )}
                  >
                    0{i + 1}
                  </span>

                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors duration-300",
                      isActive ? "text-[var(--accent-from)]" : "text-muted-foreground/60",
                    )}
                  />

                  <span className="text-[clamp(1rem,1.8vw,1.35rem)] font-medium tracking-[-0.02em]">
                    {item.title}
                  </span>

                  <span className="ml-auto font-mono text-[0.7rem] text-muted-foreground/50">
                    {item.skills.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active panel */}
          <div className="relative min-h-[16rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={group.id}
                role="tabpanel"
                id={`skills-panel-${group.id}`}
                aria-labelledby={`skills-tab-${group.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <ul className="flex flex-wrap gap-2.5">
                  {group.skills.map((skill, i) => (
                    <motion.li
                      key={skill}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.022,
                        ease: EASE,
                      }}
                      className="rounded-full border border-[var(--border)] bg-white/[0.025] px-4 py-2 text-[0.85rem] text-muted-foreground transition-colors duration-300 hover:border-[var(--accent-from)]/40 hover:bg-white/[0.05] hover:text-foreground"
                    >
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Quiet ticker of the core stack. */}
        <div className="mask-fade-x mt-12">
          <Marquee duration={46} className="gap-3">
            {CORE.map((tech) => (
              <span
                key={tech}
                className="shrink-0 rounded-full border border-[var(--border)] bg-white/[0.02] px-4 py-1.5 font-mono text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
