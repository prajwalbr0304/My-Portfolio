import type { Metadata } from "next";
import { CvHub } from "@/features/portfolio/components/cv-hub";

export const metadata: Metadata = {
  title: "CV",
  description: "Fancy and ATS-friendly curriculum vitae (PDF).",
};

export default function CvPage() {
  return <CvHub />;
}
