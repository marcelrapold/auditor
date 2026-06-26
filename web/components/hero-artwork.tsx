"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The Audit Orchestrator — a four-layer artwork stack with a subtle pointer
 * parallax. Each render shares the same geometry (1672×941), so the layers
 * line up; only the bright parts of the upper layers show (screen blend), which
 * composites the dark hardware + emerald signal paths over the base atmosphere.
 *
 * Tune everything from one place: layer order (back→front), parallax depth in
 * px, blend mode, and opacity. Parallax is desktop-pointer only and disabled for
 * touch + prefers-reduced-motion.
 */
type Layer = {
  src: string;
  depth: number; // parallax travel in px at the screen edge
  blend: "normal" | "screen" | "lighten";
  opacity: number;
  priority?: boolean;
};

const LAYERS: Layer[] = [
  { src: "/hero/base-atmosphere.webp", depth: 3, blend: "normal", opacity: 1, priority: true },
  { src: "/hero/structural-rig.webp", depth: 8, blend: "screen", opacity: 0.55 },
  { src: "/hero/orchestrator-core.webp", depth: 13, blend: "screen", opacity: 0.9 },
  { src: "/hero/signal-overlay.webp", depth: 22, blend: "screen", opacity: 1 },
];

const LERP = 0.08; // smoothing toward the pointer target — lower = calmer

export function HeroArtworkStack({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      ty = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        // `isolate` keeps the screen-blends compositing within the stack, not against the page
        "pointer-events-none relative isolate overflow-hidden",
        "[mask-image:radial-gradient(ellipse_82%_78%_at_center,black_55%,transparent_100%)]",
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
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="scale-[1.08] object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}
