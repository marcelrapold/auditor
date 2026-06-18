"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  lightLabel,
  darkLabel,
  toggleLabel,
  className,
}: {
  lightLabel: string;
  darkLabel: string;
  toggleLabel: string;
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? (isDark ? lightLabel : darkLabel) : toggleLabel}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-md border border-border bg-background/60 text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-accent sm:size-9",
        className,
      )}
    >
      {/* CSS-driven icon: correct in SSR via the .dark class, no hydration flash. */}
      <Sun className="hidden size-4 dark:block" aria-hidden />
      <Moon className="block size-4 dark:hidden" aria-hidden />
    </button>
  );
}
