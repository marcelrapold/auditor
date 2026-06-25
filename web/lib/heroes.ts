import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_DIR = join(process.cwd(), "public");
const IMG = /\.(webp|avif|png|jpe?g)$/i;

/**
 * Map of audit key -> public hero-image path, by matching `<key>.<img>` in
 * `public/`. Read once at module load (build / server render). Imported only by
 * the server-rendered audit page, so the `fs` read never reaches a client
 * bundle. No match returns null and the audit page keeps its typographic grid
 * hero, so dropping a new `public/<key>.webp` lights up a hero with no code change.
 */
const heroByKey: ReadonlyMap<string, string> = (() => {
  const map = new Map<string, string>();
  if (existsSync(PUBLIC_DIR)) {
    for (const file of readdirSync(PUBLIC_DIR)) {
      const ext = IMG.exec(file);
      if (!ext) continue;
      const key = file.slice(0, -ext[0].length);
      if (!map.has(key)) map.set(key, `/${file}`);
    }
  }
  return map;
})();

/** The public path to an audit's hero image, or null if none has been added. */
export function heroSrc(name: string): string | null {
  return heroByKey.get(name) ?? null;
}
