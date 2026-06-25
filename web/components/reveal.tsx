"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Fade + rise on scroll into view, CSS-only (no animation library in the bundle).
 * Respects prefers-reduced-motion: the .reveal CSS keeps content fully visible and
 * disables the transition (DOCUMENTATION-STANDARD.md §5 / WCAG SC 2.3.3).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Render revealed from the first paint — use for above-the-fold/LCP content
   *  so it does not wait on hydration or an IntersectionObserver tick. */
  immediate?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = React.useState(immediate);

  React.useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    // Note: prefers-reduced-motion users need no JS reveal — the `.reveal`
    // rule in globals.css forces opacity:1 / transform:none / transition:none
    // under `@media (prefers-reduced-motion: reduce)` regardless of
    // data-revealed, so content is fully visible from first paint.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "-80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      data-revealed={revealed}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
