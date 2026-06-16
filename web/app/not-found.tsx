import { ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { REPO } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <ShieldCheck aria-hidden className="size-10 text-primary" />
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 max-w-md text-pretty text-muted-foreground">
        This page does not exist. Head back to the overview, or jump straight to the
        repository.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <a href="/" className={cn(buttonVariants())}>
          Back to home
        </a>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          View on GitHub
        </a>
      </div>
    </main>
  );
}
