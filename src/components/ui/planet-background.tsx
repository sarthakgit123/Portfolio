"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { GlobeField } from "@/components/ui/globe-field";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * three.js is a few hundred KB and the texture another ~230KB, so the WebGL
 * globe is dynamically imported and never server-rendered. The import sits
 * inside a branch that only runs once the capability checks pass — a visitor
 * who fails any of them downloads none of it and gets the wireframe instead.
 */
const EarthGlobe = dynamic(
  () => import("@/components/ui/earth-globe").then((m) => m.EarthGlobe),
  { ssr: false, loading: () => null },
);

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Conservative on purpose: WebGL plus a 2K texture is a poor trade on a phone,
 * a metered connection or a low-memory machine, and the fallback is a complete
 * visual rather than a placeholder.
 */
function useCanRenderWebGL(): boolean {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: NetworkInformation;
      deviceMemory?: number;
    };

    // `pointer: fine` is what actually separates a phone from a desktop.
    // Width does not: a desktop window dragged to half the screen has the
    // same GPU, and an earlier 1024px floor silently dropped those visitors
    // to the wireframe. The remaining width check is only a sanity floor for
    // viewports too small for the globe to read at all.
    // No width check at all. Width is a bad proxy for capability — a desktop
    // window dragged to half the screen has the same GPU — and because this
    // runs once on mount, any width it captured would go stale the moment the
    // window was resized.
    //
    // `any-pointer` rather than `pointer`: a touchscreen laptop reports the
    // touch digitiser as its primary pointer, so `pointer: fine` is false
    // there even with a mouse attached. `any-pointer: fine` asks the question
    // that matters — is there a precise input device at all — and is still
    // false on phones and tablets.
    const finePointer = window.matchMedia("(any-pointer: fine)").matches;
    const connection = nav.connection;
    // Only genuinely slow classes block. `effectiveType` is a rolling RTT
    // estimate, and Chrome reports "3g" on plenty of healthy desktop links.
    const slowNetwork =
      connection?.saveData === true ||
      ["slow-2g", "2g"].includes(connection?.effectiveType ?? "");
    const lowMemory =
      typeof nav.deviceMemory === "number" && nav.deviceMemory < 4;

    // Confirm WebGL actually exists before committing to the download.
    let webgl = false;
    try {
      const probe = document.createElement("canvas");
      webgl = Boolean(
        probe.getContext("webgl2") || probe.getContext("webgl"),
      );
    } catch {
      webgl = false;
    }

    setCapable(finePointer && !slowNetwork && !lowMemory && webgl);
  }, []);

  return capable && !prefersReducedMotion;
}

/**
 * Page background. Renders the textured earth where it is worth the bytes,
 * and the in-house wireframe globe everywhere else.
 */
export function PlanetBackground() {
  const useWebGL = useCanRenderWebGL();
  const [loaded, setLoaded] = useState(false);

  /**
   * The globe is fixed, so without this it sits behind every section for the
   * whole page — and once the project panels gained a real gutter between
   * them, a bright slice of lit limb showed through the gap mid-page and read
   * as an artefact. It is the hero's stage, so it fades out as the hero
   * leaves: down to a trace that still keeps the lower sections from being
   * flat black, but nowhere near enough to compete with body copy.
   */
  const { scrollY } = useScroll();
  const sceneOpacity = useTransform(scrollY, [0, 900], [1, 0.1], {
    clamp: true,
  });

  if (!useWebGL) return <GlobeField />;

  return (
    <motion.div className="absolute inset-0" style={{ opacity: sceneOpacity }}>
      {/* The wireframe holds the frame until the texture has decoded, so the
          page is never visually empty while the globe loads. */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          loaded ? "opacity-0" : "opacity-100",
        )}
      >
        <GlobeField />
      </div>

      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-[1400ms]",
          loaded ? "opacity-100" : "opacity-0",
        )}
      >
        <EarthGlobe onReady={() => setLoaded(true)} />
      </div>

      {/* Readability. A flat dim to seat the globe in the palette, plus a
          top-weighted fade so headline type always has contrast while the
          planet's lower mass stays bright and clean. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#050607]/[0.18]"
      />
      {/* Eased back from an earlier 0.9 top stop, which crushed the nebula to
          flat black exactly where most of the sky sits. The headline is large
          and near-white, so it still holds at this level.

          The middle stops are weighted a little heavier than the fall-off
          alone would give: the dome's crown now reaches to roughly 46% of the
          viewport height, so the band the hero copy occupies has bright lit
          surface directly behind it rather than sky. Below 72% the scrim gets
          out of the way and lets the planet be the planet. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,6,7,0.70) 0%, rgba(5,6,7,0.64) 34%, rgba(5,6,7,0.52) 52%, rgba(5,6,7,0.30) 72%, rgba(5,6,7,0.10) 88%, rgba(5,6,7,0) 100%)",
        }}
      />
      {/* Vignette. Pulls the corners down so the eye lands on the centre of
          the composition, and incidentally buys contrast back for the nav and
          the social rail, which both sit hard against the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 95% at 50% 42%, rgba(5,6,7,0) 42%, rgba(5,6,7,0.34) 78%, rgba(5,6,7,0.62) 100%)",
        }}
      />
    </motion.div>
  );
}
