import { cn } from "@/lib/utils";
import { PlanetBackground } from "@/components/ui/planet-background";

/**
 * Ambient field: a fine technical grid over matte near-black.
 *
 * Deliberately has no washes, glows or gradients — the depth in this design
 * comes from flat tone steps and the 3D stage, not from coloured light. The
 * grid is masked out before it reaches the content so it reads as drafting
 * paper rather than as a pattern.
 *
 * Rendered once at the root and fixed, so it costs one composited layer for
 * the whole page.
 */
export function AmbientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-20 overflow-hidden grain",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.022) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 110% 70% at 50% 0%, black 25%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 110% 70% at 50% 0%, black 25%, transparent 78%)",
        }}
      />

      {/* Animated globe, sitting above the grid and behind all content.
          Falls back to an in-house wireframe on phones and slow connections. */}
      <PlanetBackground />
    </div>
  );
}
