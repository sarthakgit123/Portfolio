"use client";

import { motion } from "motion/react";
import { socials } from "@/data";

/**
 * Fixed vertical social rail. Only appears on wide viewports where the page
 * gutter is genuinely empty — below that the hero and contact sections already
 * carry these links, so showing it would just be clutter.
 */
export function SocialRail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-6 z-40 hidden flex-col items-center gap-5 xl:flex"
    >
      <ul className="flex flex-col items-center gap-4">
        {socials.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="block text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:text-foreground"
            >
              <Icon className="size-[1.05rem]" />
            </a>
          </li>
        ))}
      </ul>
      <span aria-hidden="true" className="h-24 w-px bg-white/15" />
    </motion.div>
  );
}
