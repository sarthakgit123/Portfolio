"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { personal, socials, contact } from "@/data";
import { SectionLabel } from "@/components/ui/section-heading";
import { TextReveal } from "@/components/ui/reveal";
import { Magnetic } from "@/components/ui/magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked by permissions — the mailto link still works.
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden px-6 py-16 sm:px-8 sm:py-24 lg:px-12"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionLabel index="05" eyebrow="Contact" />

        <TextReveal
          as="h2"
          text="Have something worth building?"
          delay={0.1}
          className="mt-6 max-w-4xl text-[clamp(2rem,5.4vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.04em] text-foreground"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground"
        >
          {contact.lead}
        </motion.p>

        {/* Email as display type. */}
        <motion.a
          href={`mailto:${personal.email}`}
          className="group mt-8 inline-flex max-w-full items-center gap-3 sm:gap-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
        >
          <span className="relative break-all text-[clamp(1.15rem,3.4vw,2.35rem)] font-medium tracking-[-0.03em] text-foreground">
            {personal.email}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 accent-gradient transition-transform duration-500 group-hover:scale-x-100" />
          </span>
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] text-muted-foreground transition-all duration-300 group-hover:bg-white/[0.06] group-hover:text-foreground sm:size-12">
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </motion.a>

        <motion.div
          className="mt-7 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.75, delay: 0.25, ease: EASE }}
        >
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:bg-white/[0.06] hover:text-foreground"
          >
            {copied ? (
              <Check className="size-3.5 text-[var(--accent-from)]" />
            ) : (
              <Copy className="size-3.5" />
            )}
            <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
          </button>

          <a
            href={`tel:${personal.phone.replace(/\s/g, "")}`}
            className="rounded-full border border-[var(--border)] px-4 py-2 font-mono text-sm text-muted-foreground transition-colors duration-300 hover:border-[var(--border-strong)] hover:text-foreground"
          >
            {personal.phone}
          </a>
        </motion.div>

        {/* Social rail along a hairline. */}
        <motion.ul
          className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--border)] pt-7"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.75, delay: 0.3, ease: EASE }}
        >
          {socials.map(({ label, href, icon: Icon }) => (
            <li key={label}>
              <Magnetic strength={0.3}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {label}
                  <ArrowUpRight className="size-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </a>
              </Magnetic>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
