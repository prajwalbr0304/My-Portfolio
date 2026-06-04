import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CertificateVisual } from "@/features/portfolio/components/certificates/certificate-visual";
import { getCertificationByRef, certifications } from "@/features/portfolio/data";

type PageProps = {
  params: Promise<{ ref: string }>;
};

export function generateStaticParams() {
  return certifications.map((c) => ({ ref: c.ref }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ref } = await params;
  const cert = getCertificationByRef(ref);
  if (!cert) return { title: "Certificate" };
  return { title: cert.title };
}

export default async function CertificateCredentialPage({ params }: PageProps) {
  const { ref } = await params;
  const cert = getCertificationByRef(ref);
  if (!cert) notFound();

  return (
    <div className="flex min-h-dvh w-full items-start justify-center px-3 py-6 sm:px-6 sm:py-10 print:items-start print:px-0 print:py-0">
      <CertificateVisual cert={cert} />
    </div>
  );
}
