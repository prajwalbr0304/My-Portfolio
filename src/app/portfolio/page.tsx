import type { Metadata } from "next";
import { PortfolioExperience } from "@/features/portfolio/components/portfolio-experience";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Projects, experience, publications, and contact — Prajwal B R.",
};

export default function PortfolioPage() {
  return <PortfolioExperience />;
}
