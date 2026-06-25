import type { MetadataRoute } from "next";
import { AUDITS } from "@/lib/content";
import { REPORTS } from "@/lib/reports";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const reports = [
    { url: `${SITE_URL}/reports`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/de/reports`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    ...REPORTS.flatMap((r) => [
      {
        url: `${SITE_URL}/reports/${r.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/de/reports/${r.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
    ]),
  ];
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
    ...reports,
    ...audits,
  ];
}
