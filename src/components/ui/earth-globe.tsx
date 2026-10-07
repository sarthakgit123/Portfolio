"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Photoreal earth, rendered in-house with three.js.
 *
 * Replaces the Spline scene: same intent, no third-party runtime, no
 * attribution badge, and the lighting and palette are ours to tune. The
 * texture is NASA's Blue Marble (public domain).
 *
 * Framed as a horizon rather than a floating marble: the sphere's centre is
 * placed exactly on the bottom edge of the frustum, so precisely the top half
 * of the planet is in shot and the limb arcs across the lower middle of the
 * viewport. Both the scale and that offset are recomputed on resize from the
 * real frustum, so the framing holds at every aspect ratio instead of only at
 * the one it was eyeballed on.
 */

const TEXTURE = "/textures/earth.jpg";

/**
 * Telephoto framing. A 38° lens six units out put the camera close enough to
 * the sphere that the limb projected as a visibly squashed ellipse and the
 * texture smeared toward the edges — the planet read as a bulging ball rather
 * than a horizon. Long lens, far back is how orbital photography is actually
 * shot, and it is what makes the arc come out clean and even.
 *
 * Everything else in the scene is sized against these two numbers, so they
 * are not independently adjustable: changing them rescales the nebula noise,
 * the starfield and the atmosphere thickness along with the globe.
 */
const FOV = 12;
const CAMERA_Z = 20;
/** Geometry is built at this radius; `group.scale` does the real sizing. */
const RADIUS = 2.6;

/**
 * How tall the visible cap is, as a fraction of viewport height. The radius
 * is derived from this rather than set alongside it — see `frame()`.
 */
const CAP_FRACTION = 0.46;
/**
 * Sky to keep clear above the limb, in CSS pixels: enough for the nav, the
 * role line, both lines of the name and the tagline beneath it.
 */
const HEADLINE_CLEARANCE_PX = 460;
/**
 * How far past "limb exactly through the bottom corners" to push the radius.
 * Above 1 the arc flattens and leaves the frame up the left and right edges
 * instead of at the corners, which is what reads as a close horizon rather
 * than a ball resting on the bottom of the screen.
 */
const WIDTH_OVERSHOOT = 1.35;

export function EarthGlobe({ onReady }: { onReady?: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    // The globe is now large and its limb is a long, near-horizontal edge —
    // exactly the case where a low pixel ratio shows as a visible staircase.
    // Worth the second sample; still capped so a 3x phone screen cannot ask
    // for nine times the fragments.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    // Filmic response rather than a linear clamp: it keeps the lit limb from
    // blowing out to flat white and holds detail through the terminator, which
    // is most of what separates this from a flat-shaded ball.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
    camera.position.set(0, 0, CAMERA_Z);

    const group = new THREE.Group();
    // Axial tilt. Scale and vertical offset are set in `frame()` below.
    group.rotation.z = 0.28;
    scene.add(group);

    /** Direction the key light arrives from, in world space. */
    const LIGHT_DIR = new THREE.Vector3(-2.2, 1.6, 2.4).normalize();

    /**
     * Nebula backdrop: an inverted shell far outside the scene, shaded with
     * fractal noise so the black around the planet has depth and colour
     * instead of reading as empty canvas.
     *
     * Generated in the shader rather than loaded as a texture — it costs no
     * bytes, never tiles visibly, and the palette stays under our control.
     * Kept very dark so headline type over it still reads.
     */
    const nebula = new THREE.Mesh(
      new THREE.SphereGeometry(70, 48, 48),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uTeal: { value: new THREE.Color("#15515a") },
          uGreen: { value: new THREE.Color("#1d5636") },
        },
        vertexShader: `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uTeal;
          uniform vec3 uGreen;
          varying vec3 vDir;

          float hash(vec3 p) {
            return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
          }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
                  mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                  mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
              f.z);
          }

          float fbm(vec3 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 6; i++) {
              v += a * noise(p);
              p *= 2.03;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec3 d = normalize(vDir);
            float clouds = fbm(d * 7.3);
            // Bias toward the dark end so the densest parts read as cloud and
            // the rest stays near-black, with a faint floor so the sky is
            // never flat canvas.
            clouds = pow(smoothstep(0.26, 0.86, clouds), 1.15);
            vec3 col = mix(uTeal, uGreen, fbm(d * 3.8 + 11.0));
            gl_FragColor = vec4(col * clouds * 1.35 + col * 0.14, 1.0);
          }
        `,
      }),
    );
    nebula.renderOrder = -1;
    scene.add(nebula);

    const loader = new THREE.TextureLoader();
    const map = loader.load(TEXTURE, () => onReady?.());
    map.colorSpace = THREE.SRGBColorSpace;
    // The texture is now stretched across most of the viewport and sampled at
    // a hard grazing angle near the limb, which is the worst case there is.
    // Ask the driver for everything it has rather than a guessed constant.
    map.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const earth = new THREE.Mesh(
      // Doubled from 72: at this size the silhouette is a long arc across the
      // screen, and facet corners on the limb are visible at 72.
      new THREE.SphereGeometry(RADIUS, 192, 192),
      new THREE.MeshStandardMaterial({
        map,
        // Reusing the colour map as a bump map is free — no extra bytes — and
        // Blue Marble's landmasses are brighter than its oceans, so luminance
        // doubles as a crude elevation field. Enough to catch the key light
        // along the terminator and stop the surface reading flat.
        bumpMap: map,
        bumpScale: 0.015,
        roughness: 0.92,
        metalness: 0,
      }),
    );
    group.add(earth);

    /**
     * Atmospheric rim: an inverted shell whose opacity rises at grazing
     * angles.
     *
     * The fresnel term is multiplied by incident light, so the atmosphere only
     * glows where the sun actually reaches it. The previous version lit the
     * rim evenly all the way around, which is the most obvious tell that a
     * globe is a shader and not a photograph.
     */
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.010, 96, 96),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: new THREE.Color("#8fdcea") },
          uLightDir: { value: LIGHT_DIR.clone() },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          varying vec3 vPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vPos = mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform vec3 uLightDir;
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          varying vec3 vPos;
          void main() {
            float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(-vPos))), 3.2);
            // Day/night falloff with a soft wrap, so the terminator fades out
            // over a few degrees instead of ending on a hard line.
            float lit = smoothstep(-0.35, 0.45, dot(normalize(vWorldNormal), uLightDir));
            gl_FragColor = vec4(uColor, fres * (0.12 + lit * 0.78));
          }
        `,
      }),
    );
    group.add(atmosphere);

    /**
     * Outer halo: a wider, much fainter shell that bleeds the atmosphere into
     * the nebula. Keeping it separate from the rim above means the tight
     * bright edge and the broad glow tune independently, which is what stops
     * the limb looking like it has a sticker outline.
     */
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.045, 64, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: new THREE.Color("#5fb6cc") },
          uLightDir: { value: LIGHT_DIR.clone() },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          varying vec3 vPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vPos = mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform vec3 uLightDir;
          varying vec3 vNormal;
          varying vec3 vWorldNormal;
          varying vec3 vPos;
          void main() {
            float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(-vPos))), 2.0);
            float lit = smoothstep(-0.5, 0.6, dot(normalize(vWorldNormal), uLightDir));
            gl_FragColor = vec4(uColor, fres * lit * 0.2);
          }
        `,
      }),
    );
    group.add(halo);

    // Key light, matching LIGHT_DIR above.
    const key = new THREE.DirectionalLight(0xfff4e8, 3.1);
    key.position.copy(LIGHT_DIR).multiplyScalar(10);
    scene.add(key);

    // Cool rim from behind and below: separates the dark half of the planet
    // from the nebula, which would otherwise swallow it entirely.
    const rim = new THREE.DirectionalLight(0x7fd1de, 0.85);
    rim.position.set(3.0, -1.4, -2.6);
    scene.add(rim);

    scene.add(new THREE.AmbientLight(0x2e4049, 0.75));

    /**
     * Starfield, in two passes: a dense field of faint pinpricks and a sparse
     * scatter of brighter, larger ones. A single uniform size is the thing
     * that makes a procedural starfield read as noise rather than as a sky.
     */
    function makeStars(
      count: number,
      spin: number,
      size: number,
      opacity: number,
    ) {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        // Deterministic scatter — no Math.random, so it is stable across loads.
        const a = i * 2.399963 + spin;
        const r = 48 + ((i * 37) % 14);
        const y = 1 - (i / (count - 1)) * 2;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        pos[i * 3] = Math.cos(a) * rad * r;
        pos[i * 3 + 1] = y * r;
        pos[i * 3 + 2] = Math.sin(a) * rad * r;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xdff0f4,
        size,
        sizeAttenuation: true,
        transparent: true,
        opacity,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      return { points, geo, mat };
    }

    const dimStars = makeStars(9000, 0, 0.022, 0.42);
    const brightStars = makeStars(1200, 1.7, 0.052, 0.85);

    /**
     * Size and place the globe from the real frustum.
     *
     * `halfH` is the world-space half-height of the view at the globe's depth;
     * putting the group's centre at `-halfH` puts the equator exactly on the
     * bottom edge of the frame, which is what leaves precisely the top half
     * visible. The scale is then chosen so the cap standing above that edge is
     * `DOME_HEIGHT_FRACTION` of the viewport height.
     */
    const frame = () => {
      const halfH = Math.tan((FOV / 2) * (Math.PI / 180)) * CAMERA_Z;
      const halfW = halfH * camera.aspect;

      /**
       * How tall the visible cap is, in world units.
       *
       * `CAP_FRACTION` alone is not enough. The hero type occupies a roughly
       * fixed number of pixels, so on a short window it takes a far larger
       * share of the screen — at 670px tall a 46% cap put the limb straight
       * through the second line of the name. So the fraction governs on tall
       * viewports, and a minimum clearance in pixels governs on short ones,
       * whichever leaves the headline alone.
       *
       * The clearance is sized to the name and tagline, not the whole hero:
       * the scrim handles body copy sitting over the planet perfectly well,
       * and it is only the very large type that a hard limb line cuts.
       */
      const viewportPx = mount.clientHeight || 900;
      const clearancePx = Math.max(120, viewportPx - HEADLINE_CLEARANCE_PX);
      const capPx = Math.min(viewportPx * CAP_FRACTION, clearancePx);
      const cap = halfH * 2 * (capPx / viewportPx);

      /**
       * Radius whose chord at the frame's bottom edge spans the full viewport
       * width. Straight from the circle geometry: a cap of height `cap` on a
       * sphere of radius R has a base half-width of sqrt(2*R*cap - cap²), so
       * setting that equal to `halfW` and solving for R gives the expression
       * below. `WIDTH_OVERSHOOT` then enlarges it further, which flattens the
       * arc and pushes where it leaves the frame up the sides.
       *
       * This is what produces the zoomed-in horizon: the sphere ends up far
       * larger than the viewport, and only a shallow cap of it is ever in
       * shot.
       */
      const radius =
        ((halfW * halfW + cap * cap) / (2 * cap)) * WIDTH_OVERSHOOT;

      group.scale.setScalar(radius / RADIUS);
      // Drop the centre so exactly `cap` of the sphere stands above the
      // bottom edge. The centre sits far below frame, which is why only the
      // top of the planet is ever visible.
      group.position.y = -halfH - (radius - cap);
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      frame();
    };
    resize();

    let raf = 0;
    let running = true;
    let last = performance.now();

    const render = () => renderer.render(scene, camera);

    const loop = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (running) {
        if (!prefersReducedMotion) {
          earth.rotation.y += dt * 0.000018;
          dimStars.points.rotation.y += dt * 0.000004;
          brightStars.points.rotation.y += dt * 0.000004;
        }
        render();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      running = !document.hidden;
      last = performance.now();
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      // Release GPU resources — a leaked context survives navigation.
      earth.geometry.dispose();
      (earth.material as THREE.Material).dispose();
      nebula.geometry.dispose();
      (nebula.material as THREE.Material).dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.Material).dispose();
      halo.geometry.dispose();
      (halo.material as THREE.Material).dispose();
      dimStars.geo.dispose();
      dimStars.mat.dispose();
      brightStars.geo.dispose();
      brightStars.mat.dispose();
      map.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion, onReady]);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" />;
}
