import type { MetadataRoute } from "next";
import { AUDITS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const audits = AUDITS.flatMap((a) => [
    {
      url: `${SITE_URL}/audits/${a.name}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/de/audits/${a.name}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/de`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...audits,
  ];
}
