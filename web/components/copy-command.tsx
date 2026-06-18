"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function useCopy() {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — surface it instead of failing silently.
      setCopied(false);
      setFailed(true);
      window.setTimeout(() => setFailed(false), 4000);
    }
  }
  return { copied, failed, copy };
}

/** Polite, visually-hidden announcement so the copy result is not visual-only (WCAG SC 4.1.3). */
function CopyStatus({
  copied,
  failed,
  copiedAnnounce,
  failedAnnounce,
}: {
  copied: boolean;
  failed: boolean;
  copiedAnnounce: string;
  failedAnnounce: string;
}) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {copied ? copiedAnnounce : failed ? failedAnnounce : ""}
    </span>
  );
}

/** Filled, lg call-to-action button that copies the activation command. */
export function CopyCommandButton({
  command,
  label,
  copiedLabel,
  copiedAnnounce,
  failedAnnounce,
}: {
  command: string;
  label: string;
  copiedLabel: string;
  copiedAnnounce: string;
  failedAnnounce: string;
}) {
  const { copied, failed, copy } = useCopy();
  return (
    <>
      <button
        type="button"
        onClick={() => copy(command)}
        className={cn(buttonVariants({ size: "lg" }))}
      >
        {copied ? (
          <Check aria-hidden className="size-4" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
        {copied ? copiedLabel : label}
      </button>
      <CopyStatus
        copied={copied}
        failed={failed}
        copiedAnnounce={copiedAnnounce}
        failedAnnounce={failedAnnounce}
      />
    </>
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
  copiedAnnounce,
  failedAnnounce,
  hint,
}: {
  command: string;
  verb: string;
  using: string;
  copyLabel: string;
  copiedLabel: string;
  copiedAnnounce: string;
  failedAnnounce: string;
  hint: string;
}) {
  const { copied, failed, copy } = useCopy();
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
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-8"
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
      <CopyStatus
        copied={copied}
        failed={failed}
        copiedAnnounce={copiedAnnounce}
        failedAnnounce={failedAnnounce}
      />
    </div>
  );
}
