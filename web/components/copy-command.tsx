"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function useCopy() {
  const [copied, setCopied] = useState(false);
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — fail silently.
    }
  }
  return { copied, copy };
}

/** Filled, lg call-to-action button that copies the activation command. */
export function CopyCommandButton({
  command,
  label,
  copiedLabel,
}: {
  command: string;
  label: string;
  copiedLabel: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(command)}
      aria-label={label}
      className={cn(buttonVariants({ size: "lg" }))}
    >
      {copied ? (
        <Check aria-hidden className="size-4" />
      ) : (
        <Copy aria-hidden className="size-4" />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}

/**
 * The activation command rendered as a copyable terminal line. The leading "$"
 * is decorative (aria-hidden) and never part of the copied payload.
 */
export function CommandBlock({
  command,
  verb,
  using,
  copyLabel,
  copiedLabel,
  hint,
}: {
  command: string;
  verb: string;
  using: string;
  copyLabel: string;
  copiedLabel: string;
  hint: string;
}) {
  const { copied, copy } = useCopy();
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-sm text-muted-foreground">
          <span aria-hidden className="text-primary">
            $
          </span>{" "}
          {verb} <span className="text-foreground">github.com/your/repo</span>{" "}
          {using} <span className="text-foreground">auditor.rapold.io</span>
        </p>
        <button
          type="button"
          onClick={() => copy(command)}
          aria-label={copyLabel}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {copied ? (
            <Check aria-hidden className="size-3.5" />
          ) : (
            <Copy aria-hidden className="size-3.5" />
          )}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground/80">{hint}</p>
    </div>
  );
}
