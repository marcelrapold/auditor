import type { ReactNode } from "react";

/**
 * A jargon term with a dotted underline whose definition appears in a small
 * styled tooltip on hover and on keyboard focus. CSS-only (no JS), themed via
 * the popover tokens so it works in light and dark. The definition text stays
 * in the DOM (not aria-hidden) so screen readers and no-hover contexts still
 * get it. Safe inside a link: contains no nested interactive elements and the
 * tooltip is pointer-events-none, so the surrounding link stays clickable.
 */
export function Term({ children, def }: { children: ReactNode; def: string }) {
  return (
    <span className="group relative inline-block">
      <span
        tabIndex={0}
        className="cursor-help rounded-sm underline decoration-dotted decoration-primary/60 underline-offset-4 outline-none [text-decoration-skip-ink:none] focus-visible:ring-2 focus-visible:ring-ring"
      >
        {children}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[min(20rem,80vw)] -translate-x-1/2 rounded-md border border-border bg-popover px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {def}
      </span>
    </span>
  );
}
