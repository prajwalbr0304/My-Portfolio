/**
 * Certificate routes use a neutral full-page canvas so the document reads like a standalone credential.
 */
export default function CertificatesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-background text-foreground antialiased print:bg-white print:text-neutral-950">
      {children}
    </div>
  );
}
