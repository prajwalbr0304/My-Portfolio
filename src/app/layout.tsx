import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { themeInitScript } from "@/lib/theme-script";
import {
  PORTFOLIO_INTRO_SCROLL_LOCK_BOOTSTRAP,
  PORTFOLIO_RELOAD_TO_ROOT_BOOTSTRAP,
} from "@/lib/intro-scroll-bootstrap";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Prajwal B R | Full-stack & AI Developer",
    template: "%s | Prajwal B R",
  },
  description:
    "Portfolio of Prajwal B R — full-stack and AI developer building real products with Next.js, Python, blockchain, and LLM integrations.",
  metadataBase: new URL("https://portfolio.local"),
  openGraph: {
    title: "Prajwal B R | Full-stack & AI Developer",
    description:
      "Portfolio of Prajwal B R — full-stack and AI developer building real products with Next.js, Python, blockchain, and LLM integrations.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "dark light",
  themeColor: "#05070b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Prajwal B R",
    jobTitle: "Full-stack & AI Developer",
    url: "https://portfolio.local",
    email: "prajwalbr0304@gmail.com",
    sameAs: [
      "https://github.com/PRAJWAL-BR-0304",
      "https://linkedin.com/in/prajwal-br",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Python",
      "Django",
      "Solidity",
      "OpenAI API",
      "Supabase",
    ],
    description:
      "Full-stack developer with hands-on experience in AI integration, blockchain, and product engineering.",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Before first paint: match `portfolio-theme` so light mode reload does not flash dark (ThemeProvider runs later). */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body className="min-h-[100dvh] min-h-[100svh] min-w-0 overflow-x-clip bg-background font-sans text-foreground antialiased">
        {/* Intro lock after theme in &lt;head&gt; so `data-theme` is correct (see globals intro lock). */}
        <script dangerouslySetInnerHTML={{ __html: PORTFOLIO_RELOAD_TO_ROOT_BOOTSTRAP }} />
        <script dangerouslySetInnerHTML={{ __html: PORTFOLIO_INTRO_SCROLL_LOCK_BOOTSTRAP }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
