import type { Metadata } from "next";
import { Landing } from "@/components/landing";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", de: "/de" },
  },
};

export default function Home() {
  return <Landing lang="en" />;
}
