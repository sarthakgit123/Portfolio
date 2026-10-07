"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Animated wireframe globe used as the page background.
 *
 * A latitude/longitude sphere drawn with its own perspective projection, plus
 * a few great-circle arcs that travel between surface points — the "dynamic
 * lines" read of the reference, rendered matte rather than holographic.
 *
 * Positioned low and centred so only the upper cap is in frame, which gives a
 * horizon rather than a floating ball. Line alpha falls off with depth so the
 * far hemisphere recedes; there is no fill, no glow and no gradient.
 *
 * It sits behind everything and is deliberately faint — it is atmosphere, not
 * a subject.
 */

const DEG = Math.PI / 180;

interface Arc {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
  t: number;
  speed: number;
}

/** Deterministic spread of arc endpoints — no Math.random at runtime. */
const ARCS: Arc[] = [
  { lat1: 34, lon1: -118, lat2: 51, lon2: 0, t: 0.0, speed: 0.16 },
  { lat1: 28, lon1: 77, lat2: 1, lon2: 103, t: 0.3, speed: 0.13 },
  { lat1: -23, lon1: -46, lat2: 40, lon2: -74, t: 0.55, speed: 0.19 },
  { lat1: 35, lon1: 139, lat2: -33, lon2: 151, t: 0.8, speed: 0.11 },
  { lat1: 55, lon1: 37, lat2: 30, lon2: 31, t: 0.15, speed: 0.15 },
];

function toXYZ(lat: number, lon: number) {
  const phi = (90 - lat) * DEG;
  const theta = lon * DEG;
  return {
    x: Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  };
}

export function GlobeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lightweight =
      window.matchMedia("(max-width: 639px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;

    const MERIDIANS = lightweight ? 10 : 18;
    const PARALLELS = lightweight ? 6 : 10;
    const SEGMENTS = lightweight ? 28 : 46;

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let radius = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = width / 2;
      // Sits low so only the upper cap is in frame — a horizon, not a ball.
      cy = height * 1.16;
      radius = Math.min(width, height) * 0.86;
    };
    resize();

    const TILT = -0.28;

    const project = (p: { x: number; y: number; z: number }, spin: number) => {
      const cs = Math.cos(spin);
      const sn = Math.sin(spin);
      const x = p.x * cs - p.z * sn;
      const z = p.x * sn + p.z * cs;
      const ct = Math.cos(TILT);
      const st = Math.sin(TILT);
      const y2 = p.y * ct - z * st;
      const z2 = p.y * st + z * ct;
      return { x: cx + x * radius, y: cy - y2 * radius, depth: z2 };
    };

    const stroke = (alpha: number) =>
      `rgba(216,216,226,${Math.max(0, alpha).toFixed(3)})`;

    const drawRing = (
      points: { x: number; y: number; z: number }[],
      spin: number,
      base: number,
    ) => {
      let prev = project(points[0], spin);
      for (let i = 1; i < points.length; i++) {
        const cur = project(points[i], spin);
        const depth = (prev.depth + cur.depth) / 2;
        // Far hemisphere recedes rather than disappearing.
        const a = base * (depth > 0 ? 1 : 0.28);
        if (a > 0.004) {
          ctx.strokeStyle = stroke(a);
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(cur.x, cur.y);
          ctx.stroke();
        }
        prev = cur;
      }
    };

    // Pre-compute the wireframe once.
    const meridians = Array.from({ length: MERIDIANS }, (_, m) => {
      const lon = (m / MERIDIANS) * 360;
      return Array.from({ length: SEGMENTS + 1 }, (_, s) =>
        toXYZ(-90 + (s / SEGMENTS) * 180, lon),
      );
    });

    const parallels = Array.from({ length: PARALLELS }, (_, p) => {
      const lat = -75 + (p / (PARALLELS - 1)) * 150;
      return Array.from({ length: SEGMENTS + 1 }, (_, s) =>
        toXYZ(lat, (s / SEGMENTS) * 360),
      );
    });

    const render = (spin: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      for (const ring of meridians) drawRing(ring, spin, 0.05);
      for (const ring of parallels) drawRing(ring, spin, 0.06);

      // Dynamic arcs: a point travelling a great-circle path between two
      // surface coordinates, lifted off the surface at the midpoint.
      for (const arc of ARCS) {
        const a = toXYZ(arc.lat1, arc.lon1);
        const b = toXYZ(arc.lat2, arc.lon2);
        const steps = 26;
        let prev: ReturnType<typeof project> | null = null;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const lift = 1 + Math.sin(t * Math.PI) * 0.16;
          const p = {
            x: (a.x + (b.x - a.x) * t) * lift,
            y: (a.y + (b.y - a.y) * t) * lift,
            z: (a.z + (b.z - a.z) * t) * lift,
          };
          const cur = project(p, spin);
          if (prev && cur.depth > -0.1 && t <= arc.t) {
            ctx.strokeStyle = stroke(0.13);
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(cur.x, cur.y);
            ctx.stroke();
          }
          prev = cur;
        }
      }
    };

    if (prefersReducedMotion) {
      render(0.4);
      const onResize = () => {
        resize();
        render(0.4);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let raf = 0;
    let spin = 0;
    let last = performance.now();
    let running = true;

    const loop = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (running) {
        spin += dt * 0.000035;
        for (const arc of ARCS) {
          arc.t += dt * 0.001 * arc.speed;
          if (arc.t > 1.4) arc.t = 0;
        }
        render(spin);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      running = !document.hidden;
      last = performance.now();
    };
    const onResize = () => resize();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
