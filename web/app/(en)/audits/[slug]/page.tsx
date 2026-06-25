import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuditDetailPage } from "@/components/audit-page";
import { auditDetail } from "@/lib/audit-details";
import { AUDITS, auditTitle } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return AUDITS.map((a) => ({ slug: a.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const audit = AUDITS.find((a) => a.name === slug);
  const detail = auditDetail(slug, "en");
  if (!audit || !detail) return {};
  const path = `/audits/${slug}`;
  const title = auditTitle(audit);
  return {
    title: `${title} — auditor`,
    description: detail.tagline,
    alternates: {
      canonical: path,
      languages: { en: path, de: `/de${path}`, "x-default": path },
    },
    openGraph: {
      type: "article",
      url: path,
      title,
      description: detail.tagline,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!AUDITS.some((a) => a.name === slug)) notFound();
  return <AuditDetailPage name={slug} lang="en" />;
}
