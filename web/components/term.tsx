import type { ReactNode } from "react";

/**
 * A jargon term with a subtle dotted underline and a definition on hover/SR.
 * Uses native <abbr title> so it is valid even inside a link (no nested
 * interactive content), needs no positioning/JS, and cannot overflow or clip.
 */
export function Term({ children, def }: { children: ReactNode; def: string }) {
  return (
    <abbr
      title={def}
      className="cursor-help underline decoration-dotted decoration-primary/60 underline-offset-4 [text-decoration-skip-ink:none]"
    >
      {children}
    </abbr>
  );
}
