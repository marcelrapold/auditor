"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Emerald particle field layered over the Orchestrator artwork. Fine glowing
 * dots drift slowly upward, twinkle, and "bleed" their colour through a
 * green→teal band (sine-driven hue shift) via additive compositing. On a fine
 * pointer they drift with a subtle parallax tied to the hero. Honours
 * prefers-reduced-motion (renders one calm static frame, no rAF) and scales the
 * count down on small screens. Purely decorative: aria-hidden, pointer-events-none.
 */
const BASE_HUE = 158; // emerald — matches --primary on the dark theme
const HUE_SPREAD = 26; // how far the colour bleeds toward teal/green
const COUNT_DESKTOP = 56;
const COUNT_MOBILE = 22;

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  huePhase: number;
  hueSpeed: number;
  twPhase: number;
  twSpeed: number;
  baseA: number;
};

export function HeroParticles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !window.matchMedia("(pointer: fine)").matches;
    const section: HTMLElement = canvas.closest("section") ?? canvas;

    let w = 0;
    let h = 0;
    let raf = 0;
    let px = 0;
    let py = 0; // pointer parallax target [-1, 1]
    let cx = 0;
    let cy = 0; // smoothed current
    let particles: Particle[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const count = () => (w < 640 ? COUNT_MOBILE : COUNT_DESKTOP);

    const make = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.6, 2.3),
      vx: rand(-0.06, 0.06),
      vy: rand(-0.2, -0.04), // slow upward drift
      huePhase: Math.random() * Math.PI * 2,
      hueSpeed: rand(0.002, 0.006),
      twPhase: Math.random() * Math.PI * 2,
      twSpeed: rand(0.006, 0.016),
      baseA: rand(0.25, 0.7),
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length !== count()) {
        particles = Array.from({ length: count() }, make);
      }
    };

    const draw = () => {
      cx += (px - cx) * 0.06;
      cy += (py - cy) * 0.06;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter"; // additive glow where particles overlap
      for (const p of particles) {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -4) {
            p.y = h + 4;
            p.x = Math.random() * w;
          }
          if (p.x < -4) p.x = w + 4;
          else if (p.x > w + 4) p.x = -4;
          p.twPhase += p.twSpeed;
          p.huePhase += p.hueSpeed;
        }
        const twinkle = reduced ? 1 : 0.6 + 0.4 * Math.sin(p.twPhase);
        const a = p.baseA * twinkle;
        const hue = BASE_HUE + HUE_SPREAD * Math.sin(p.huePhase);
        // bigger particles ride the parallax further → a sense of depth
        const x = p.x + cx * (p.r * 6);
        const y = p.y + cy * (p.r * 6);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue}, 82%, 62%, ${a})`;
        ctx.shadowColor = `hsla(${hue}, 90%, 55%, ${a})`;
        ctx.shadowBlur = 8 + p.r * 4;
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    };

    resize();
    draw(); // always paint at least one frame (static when reduced-motion)

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (!reduced && !coarse) {
      section.addEventListener("pointermove", onMove, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      section.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none", className)} />;
}
