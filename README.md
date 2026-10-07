# Portfolio — Sarthak Kumar Seth

Personal portfolio site. Dark, type-led, with a WebGL earth rendered in-house as the hero's backdrop.

**Live:** _(add the Vercel URL once deployed)_

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router, static export) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 (`@theme inline`, no config file) |
| Motion | Motion (Framer) · GSAP + ScrollTrigger · Lenis |
| 3D | three.js — custom shaders for the atmosphere, nebula and starfield |

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build   # production build
npm run start   # serve the build
```

## Notes

- The earth is textured with NASA's Blue Marble imagery (public domain). The atmosphere, nebula backdrop and starfield are generated in shaders rather than loaded as assets.
- The globe is capability-gated — pointer precision, device memory, connection quality and a WebGL probe — and falls back to a lightweight wireframe globe on phones, slow links and `prefers-reduced-motion`.
- All content lives in `src/data/`. Nothing in the UI is hardcoded.

## Licence

Code is free to read and learn from. The written content, photographs and CV are not — please don't reuse them.
