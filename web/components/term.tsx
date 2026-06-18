import type { ReactNode } from "react";

/**
 * A jargon term with a dotted underline whose definition appears in a small
 * styled tooltip on hover and on keyboard focus. The reveal is driven by a
 * scoped rule in globals.css (`.term-trigger:hover/:focus + .term-tip`) rather
 * than a Tailwind `group`, so an ancestor `group` (e.g. the audit cards) cannot
 * fire every tooltip in the card at once. CSS-only (no JS), themed via the
 * popover tokens for light and dark. The definition text stays in the DOM for
 * screen readers, and the tooltip is pointer-events-none so terms inside link
 * cards keep the card clickable.
 */
export function Term({ children, def }: { children: ReactNode; def: string }) {
  return (
    <span className="relative inline-block">
      <span
        tabIndex={0}
        className="term-trigger cursor-help rounded-sm underline decoration-dotted decoration-primary/60 underline-offset-4 outline-none [text-decoration-skip-ink:none] focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </span>
      <span
        role="tooltip"
        className="term-tip pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[min(20rem,80vw)] -translate-x-1/2 rounded-md border border-border bg-popover px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal text-popover-foreground shadow-md transition-opacity duration-150"
      >
        {def}
      </span>
    </span>
  );
}
