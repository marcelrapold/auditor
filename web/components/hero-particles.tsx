"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Emerald particle field layered over the Orchestrator artwork. Glowing dots
 * drift upward, twinkle, and "bleed" their colour through a green→teal band
 * (sine-driven hue shift) with additive compositing. On a fine pointer they
 * drift with a subtle parallax tied to the hero. Honours prefers-reduced-motion
 * (one calm static frame, no rAF), scales the count down on small screens, and
 * is purely decorative (aria-hidden, pointer-events-none).
 */
const BASE_HUE = 158; // emerald — matches --primary on the dark theme
const HUE_SPREAD = 28; // how far the colour bleeds toward teal/green
const COUNT_DESKTOP = 90;
const COUNT_MOBILE = 40;

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
      r: rand(1, 3.4),
      vx: rand(-0.12, 0.12),
      vy: rand(-0.35, -0.12), // upward drift
      huePhase: Math.random() * Math.PI * 2,
      hueSpeed: rand(0.003, 0.008),
      twPhase: Math.random() * Math.PI * 2,
      twSpeed: rand(0.008, 0.02),
      baseA: rand(0.4, 0.95),
    });

    const renderOnce = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter"; // additive glow where particles overlap
      for (const p of particles) {
        const twinkle = reduced ? 1 : 0.6 + 0.4 * Math.sin(p.twPhase);
        const a = p.baseA * twinkle;
        const hue = BASE_HUE + HUE_SPREAD * Math.sin(p.huePhase);
        const x = p.x + cx * (p.r * 8); // bigger particles ride parallax further
        const y = p.y + cy * (p.r * 8);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue}, 85%, 64%, ${a})`;
        ctx.shadowColor = `hsla(${hue}, 95%, 58%, ${a})`;
        ctx.shadowBlur = 10 + p.r * 5;
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
    };

    // Self-healing sizing: measure the canvas each frame and resync the backing
    // store (+ particles) whenever it changes. Immune to mount/layout races and
    // breakpoint changes — no ResizeObserver timing to get wrong.
    const sync = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const needW = Math.floor(r.width * dpr);
      const needH = Math.floor(r.height * dpr);
      if (canvas.width !== needW || canvas.height !== needH || !particles.length) {
        w = r.width;
        h = r.height;
        canvas.width = needW;
        canvas.height = needH;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles = Array.from({ length: count() }, make);
      }
      return true;
    };

    const tick = () => {
      if (sync()) {
        cx += (px - cx) * 0.06;
        cy += (py - cy) * 0.06;
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -6) {
            p.y = h + 6;
            p.x = Math.random() * w;
          }
          if (p.x < -6) p.x = w + 6;
          else if (p.x > w + 6) p.x = -6;
          p.twPhase += p.twSpeed;
          p.huePhase += p.hueSpeed;
        }
        renderOnce();
      }
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      // Static field: paint once when the size is ready, then stop.
      const paintWhenReady = () => {
        if (sync()) renderOnce();
        else raf = requestAnimationFrame(paintWhenReady);
      };
      paintWhenReady();
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    };
    if (!reduced && !coarse) {
      section.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none", className)} />;
}
