"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Opening greeting sequence: a full-bleed cover that cycles greetings and then
 * lifts to reveal the page.
 *
 * Ends on Hindi — the sequence travels outward and comes home, which is a
 * cleaner close than stopping on whichever language happened to be last.
 *
 * The exit is a CSS animation rather than a React transition. This cover sits
 * over the entire site, and an earlier version that unmounted through
 * AnimatePresence could leave an orphaned node behind — state said dismissed,
 * the DOM still covered the viewport, and the page was unusable. Handing the
 * exit to CSS means it plays off the compositor and completes whatever React
 * does; `visibility: hidden` at the end stops it intercepting input.
 *
 * React only decides whether the cover runs at all, and cycles the words.
 */
const GREETINGS = [
  "Hello",
  "Hola",
  "Bonjour",
  "Ciao",
  "こんにちは",
  "Olá",
  "नमस्ते",
];

/** Unhurried enough to actually read each greeting rather than glimpse it. */
const STEP_MS = 380;
const HOLD_MS = 620;
/** Cover animation: words play through the first 78%, then it slides away. */
const COVER_MS = Math.round((GREETINGS.length * STEP_MS + HOLD_MS) / 0.78);

const SESSION_KEY = "sks:intro-seen";

export function GreetingIntro() {
  // `undefined` until the client decides, so server and client markup agree.
  const [skip, setSkip] = useState<boolean | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const locked = useRef(false);

  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    // Reduced motion goes straight to the page — an unskippable cover is
    // exactly the kind of motion that setting is asking us to drop.
    setSkip(seen || prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (skip !== false) return;

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Blocked storage just means the intro replays next load.
    }

    const interval = window.setInterval(() => {
      setIndex((current) =>
        current >= GREETINGS.length - 1 ? current : current + 1,
      );
    }, STEP_MS);

    // Scroll stays locked only for the cover's lifetime, and is released on a
    // timer rather than on unmount so a stuck component cannot strand it.
    document.body.style.overflow = "hidden";
    locked.current = true;
    const unlock = window.setTimeout(() => {
      document.body.style.overflow = "";
      locked.current = false;
    }, COVER_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(unlock);
      if (locked.current) {
        document.body.style.overflow = "";
        locked.current = false;
      }
    };
  }, [skip]);

  // Already seen, or reduced motion: render nothing at all.
  if (skip === true) return null;

  return (
    <div
      // Decorative: the greeting is not content, and the page beneath is
      // already in the accessibility tree.
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-[#050607]"
      // Set inline rather than through a utility class: an arbitrary
      // `animation:` class has to survive Tailwind's scanner to exist at all,
      // and this element must not depend on that to get off the screen.
      style={
        skip === false
          ? {
              animation: `intro-cover ${COVER_MS}ms cubic-bezier(0.76,0,0.24,1) forwards`,
            }
          : undefined
      }
    >
      <span className="block overflow-hidden px-6">
        <span className="block text-[clamp(2.5rem,7vw,5.5rem)] font-medium tracking-[-0.04em] text-foreground">
          {GREETINGS[index]}
        </span>
      </span>
    </div>
  );
}
