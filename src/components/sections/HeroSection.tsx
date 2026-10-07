"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { personal } from "@/data";
import { Portrait } from "@/components/ui/portrait";
import { Magnetic } from "@/components/ui/magnetic";
import { useSmoothScroll } from "@/components/providers/smooth-scroll";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Each display line rises out of its own mask, so the name sets like type. */
function MaskLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * Centred hero: the type stacks in the upper half and the persistent assembly
 * (SystemStage) sits centred beneath it, so the two share a vertical axis
 * rather than competing side by side.
 */
export function HeroSection() {
  const { scrollTo } = useSmoothScroll();

  return (
    <section
      id="home"
      className="relative flex min-h-svh items-start px-6 pt-28 pb-16 sm:px-8 sm:pt-32 lg:px-12"
    >
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <div>
          {/* Identity line: the portrait is a small mark here, not a subject —
              the assembly is the centrepiece. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            className="flex items-center justify-center gap-3.5"
          >
            <Portrait
              src="/portrait-primary.jpg"
              alt="Sarthak Kumar Seth"
              width={1200}
              height={1600}
              priority
              shape="circle"
              compact
              objectPosition="50% 26%"
              sizes="80px"
              className="w-14 shrink-0 sm:w-16"
            />
            <span className="text-on-scene font-mono text-[0.78rem] tracking-[0.2em] text-foreground/80 sm:text-sm">
              {personal.role.toUpperCase()}
            </span>
          </motion.div>

          {/* The name is split into two masked lines for the reveal, which
              would otherwise be read as one run-on word. The visual lines are
              hidden from assistive tech and the full name exposed once. */}
          <h1 className="text-on-scene mt-7 text-[clamp(2.75rem,7.4vw,6rem)] font-medium leading-[0.92] tracking-[-0.045em] text-foreground">
            <span className="sr-only">{personal.name}</span>
            <span aria-hidden="true">
              <MaskLine delay={0.3}>Sarthak</MaskLine>
              <MaskLine delay={0.42}>
                <span className="text-gradient">Kumar Seth</span>
              </MaskLine>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
          >
            <p className="text-on-scene mx-auto mt-7 max-w-xl text-[clamp(1.1rem,1.7vw,1.35rem)] leading-snug tracking-[-0.015em] text-foreground">
              {personal.tagline}
            </p>
            {/* Lifted off `muted` — this line lands over the planet's lit
                limb, where the muted tone loses contrast. */}
            <p className="text-on-scene mx-auto mt-4 max-w-lg text-[0.95rem] leading-relaxed text-foreground/85">
              {personal.intro}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Magnetic strength={0.28}>
                <a
                  href={personal.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#eef3f4] px-7 py-3.5 text-[0.95rem] font-medium text-[#050607] transition-colors duration-300 hover:bg-white"
                >
                  Resume
                  <ArrowUpRight className="size-4" />
                </a>
              </Magnetic>

              <Magnetic strength={0.28}>
                <button
                  type="button"
                  onClick={() => scrollTo("projects")}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[#050607]/40 px-7 py-3.5 text-[0.95rem] text-foreground backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.08]"
                >
                  View work
                </button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
