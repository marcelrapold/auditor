"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The Audit Orchestrator — a four-layer artwork stack with a subtle pointer
 * parallax. Each render shares the same geometry (1672×941), so the layers line
 * up. The dark hardware (Core) carries the scene; the emerald Signal overlay
 * supports it (screen blend, slightly held back so it doesn't flatten the metal
 * into a glow); the structural Rig reads as faint physical infrastructure.
 *
 * Tune everything from one place: layer order (back→front), parallax depth in
 * px, blend mode, and opacity. Parallax is desktop fine-pointer only, disabled
 * for touch + prefers-reduced-motion, tracked within the hero section (not the
 * window), and glides back to rest when the pointer leaves. The mask is supplied
 * by the caller via `className` so desktop and mobile can fade differently.
 */
type Layer = {
  src: string;
  depth: number; // parallax travel in px at the edge of the tracked area
  blend: "normal" | "screen" | "lighten";
  opacity: number;
  priority?: boolean;
};

const LAYERS: Layer[] = [
  { src: "/hero/base-atmosphere.webp", depth: 2, blend: "normal", opacity: 1, priority: true },
  { src: "/hero/structural-rig.webp", depth: 5, blend: "screen", opacity: 0.42 },
  { src: "/hero/orchestrator-core.webp", depth: 9, blend: "screen", opacity: 1 },
  { src: "/hero/signal-overlay.webp", depth: 13, blend: "screen", opacity: 0.85 },
];

const LERP = 0.08; // smoothing toward the pointer target — lower = calmer

export function HeroArtworkStack({
  className,
  parallax = true,
}: {
  className?: string;
  parallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parallax) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Track the pointer within the hero section, not the whole window: the
    // effect only reacts while the cursor is over the hero and rests otherwise.
    const track: HTMLElement = el.closest("section") ?? el;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf = 0,
      running = false;

    const tick = () => {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      for (const layer of layers) {
        const d = Number(layer.dataset.depth);
        layer.style.transform = `translate3d(${(-cx * d).toFixed(2)}px, ${(-cy * d).toFixed(2)}px, 0)`;
      }
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const clamp = (n: number) => (n < -1 ? -1 : n > 1 ? 1 : n);
    const onMove = (e: PointerEvent) => {
      const r = track.getBoundingClientRect();
      tx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
      ty = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
      start();
    };
    // Glide back to rest on leave — no snap.
    const onLeave = () => {
      tx = 0;
      ty = 0;
      start();
    };

    track.addEventListener("pointermove", onMove, { passive: true });
    track.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [parallax]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        // `isolate` keeps the screen-blends compositing within the stack, not against the page
        "pointer-events-none relative isolate overflow-hidden",
        className,
      )}
    >
      {LAYERS.map((l) => (
        <div
          key={l.src}
          data-depth={l.depth}
          className="absolute inset-0 will-change-transform"
          style={{ mixBlendMode: l.blend, opacity: l.opacity }}
        >
          {/* slight overscan so the parallax translate never reveals an edge */}
          <Image
            src={l.src}
            alt=""
            fill
            priority={l.priority}
            sizes="(max-width: 1024px) 92vw, 60vw"
            className="scale-[1.08] object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}
