import Image from "next/image";
import type { CertificationEntry } from "@/features/portfolio/data";
import { profile } from "@/features/portfolio/data";

const LOGO_UDEMY = "/logos/udemy-wordmark.svg";
const LOGO_IBM = "/logos/ibm.svg";
const LOGO_INFOSYS = "/logos/infosys.svg";

type Props = {
  cert: CertificationEntry;
};

/** Full-page credential artwork (light “paper” layouts; logos from Wikimedia / official SVG sources). */
export function CertificateVisual({ cert }: Props) {
  switch (cert.template) {
    case "udemy":
      return <UdemyLayout cert={cert} />;
    case "google-firebase":
      return <GoogleFirebaseLayout cert={cert} />;
    case "aws-bedrock":
      return <AwsBedrockLayout cert={cert} />;
    case "ibm-skillsbuild":
      return <IbmSkillsBuildLayout cert={cert} />;
    case "infosys-springboard":
      return <InfosysSpringboardLayout cert={cert} />;
    default:
      return <UdemyLayout cert={cert} />;
  }
}

function UdemyLayout({ cert }: Props) {
  const verifyId = cert.credentialId ?? cert.ref;
  const verifyUrl = `https://www.udemy.com/certificate/${verifyId}/`;

  return (
    <div
      className="certificate-print w-full max-w-[52rem] border-[14px] border-double border-neutral-400 bg-neutral-100 p-2 shadow-[0_12px_48px_rgba(0,0,0,0.18)] print:max-w-none print:border-neutral-500 print:shadow-none"
      role="document"
    >
      <div className="border border-neutral-300 bg-white">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-[#A435F0] px-8 pb-6 pt-8 sm:px-12 sm:pt-10">
          <Image
            src={LOGO_UDEMY}
            alt="Udemy"
            width={200}
            height={75}
            className="h-10 w-auto sm:h-12"
            priority
          />
          <div className="text-right">
            <p className="text-caption-size font-semibold uppercase tracking-widest text-neutral-500">Certificate no.</p>
            <p className="mt-1 font-mono text-base font-semibold text-neutral-900 sm:text-lg">{verifyId}</p>
          </div>
        </header>

        <div
          className="px-8 py-10 text-center sm:px-14 sm:py-12"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.045) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <p className="text-caption-size font-bold uppercase tracking-[0.35em] text-neutral-500 sm:text-base">
            Certificate of completion
          </p>
          <h1 className="mx-auto mt-6 max-w-[40rem] text-balance text-lg font-bold leading-snug text-neutral-950 sm:text-xl md:text-2xl">
            {cert.title}
          </h1>
          <p className="mt-10 text-sm text-neutral-600">This is to certify that</p>
          <p className="mt-3 font-serif text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            {profile.name}
          </p>
          <p className="mt-2 text-sm text-neutral-600">successfully completed {cert.courseHours ?? "the course"}</p>

          <div className="mx-auto mt-10 max-w-lg border-t border-neutral-200 pt-8 text-sm text-neutral-700">
            {cert.instructor ? (
              <p>
                <span className="text-neutral-500">Instructors </span>
                <span className="font-semibold text-neutral-900">{cert.instructor}</span>
              </p>
            ) : null}
            <p className="mt-3 font-mono text-sm text-neutral-800">
              <span className="text-neutral-500">Date of completion </span>
              {cert.issuedDisplay}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-md border-t border-neutral-200 pt-8">
            <div className="mx-auto h-px w-48 bg-neutral-300" aria-hidden />
            <p className="mt-6 text-caption-size text-neutral-500">Author signature</p>
            <p className="mt-1 text-sm font-semibold text-neutral-800">Udemy</p>
          </div>

          <p className="mt-10 break-all px-2 font-mono text-caption-size leading-relaxed text-neutral-500">
            {verifyUrl}
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleFirebaseLayout({ cert }: Props) {
  const googleMark = "/logos/google.svg";
  const fb = "/logos/firebase.svg";

  return (
    <div
      className="certificate-print w-full max-w-[52rem] border-[12px] border-double border-neutral-300 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.15)] print:max-w-none print:shadow-none"
      role="document"
    >
      <div className="flex border-b-4 border-[#4285F4]">
        <div className="flex flex-1 items-center justify-center gap-4 bg-[#f8f9fa] px-6 py-5 sm:gap-6 sm:px-10">
          <div className="relative h-12 w-12 shrink-0">
            <Image src={googleMark} alt="" fill className="object-contain" unoptimized />
          </div>
          <div className="h-10 w-px bg-neutral-300" aria-hidden />
          <div className="relative h-12 w-12 shrink-0">
            <Image src={fb} alt="" fill className="object-contain" unoptimized />
          </div>
        </div>
      </div>

      <div className="px-8 py-10 text-center sm:px-14 sm:py-12">
        <p className="text-caption-size font-bold uppercase tracking-[0.28em] text-[#5f6368]">Certificate of completion</p>
        <p className="mt-2 text-base text-[#5f6368]">Google Cloud · Firebase</p>
        <h1 className="mx-auto mt-8 max-w-[42rem] text-balance text-lg font-semibold leading-snug text-[#202124] sm:text-xl md:text-2xl">
          {cert.title}
        </h1>
        <p className="mt-10 text-sm text-[#5f6368]">Presented to</p>
        <p className="mt-2 text-3xl font-medium text-[#174ea6] sm:text-4xl">{profile.name}</p>
        <p className="mt-10 font-mono text-base text-[#5f6368]">Completion date · {cert.issuedDisplay}</p>
        <p className="mt-6 font-mono text-caption-size text-[#80868b]">Credential ID · {cert.ref}</p>
      </div>
    </div>
  );
}

function AwsBedrockLayout({ cert }: Props) {
  return (
    <div
      className="certificate-print w-full max-w-[52rem] overflow-hidden border border-[#232f3e] bg-[#fafafa] shadow-[0_12px_48px_rgba(0,0,0,0.2)] print:max-w-none print:shadow-none"
      role="document"
    >
      <div className="flex items-center justify-between bg-[#232f3e] px-8 py-5 text-white sm:px-12">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0">
            <Image
              src="/logos/aws-dark.svg"
              alt=""
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-[#ff9900]">aws</span>
            <span className="text-caption-size font-medium uppercase tracking-wider text-white/75">Training</span>
          </div>
        </div>
        <span className="rounded border border-[#ff9900]/60 bg-[#ff9900] px-2 py-1 text-caption-size font-bold uppercase tracking-wide text-black">
          Agents
        </span>
      </div>
      <div className="px-8 py-10 sm:px-12 sm:py-12">
        <p className="text-caption-size font-bold uppercase tracking-[0.22em] text-[#545b64]">Award of completion</p>
        <h1 className="mt-5 text-balance text-lg font-bold leading-snug text-[#16191f] sm:text-xl md:text-2xl">
          {cert.title}
        </h1>
        <p className="mt-8 text-sm text-[#545b64]">This acknowledges that</p>
        <p className="mt-2 text-3xl font-semibold text-[#16191f] sm:text-4xl">{profile.name}</p>
        <p className="mt-10 border-t border-dashed border-[#d5dbdb] pt-8 font-mono text-base text-[#545b64]">
          Completion date · {cert.issuedDisplay}
        </p>
        <p className="mt-4 font-mono text-caption-size text-[#687078]">Credential reference · {cert.ref}</p>
      </div>
    </div>
  );
}

function IbmSkillsBuildLayout({ cert }: Props) {
  return (
    <div
      className="certificate-print w-full max-w-[52rem] border-[12px] border-double border-[#0f62fe]/35 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.14)] print:max-w-none print:shadow-none"
      role="document"
    >
      <div className="h-1.5 bg-[#0f62fe]" />
      <div className="flex flex-wrap items-end justify-between gap-6 px-8 pb-2 pt-8 sm:px-12 sm:pt-10">
        <div className="flex flex-col gap-1">
          <Image src={LOGO_IBM} alt="IBM" width={220} height={82} className="h-12 w-auto sm:h-14" priority />
          <p className="text-caption-size font-bold uppercase tracking-[0.2em] text-[#0f62fe]">SkillsBuild</p>
        </div>
        <p className="font-mono text-caption-size text-neutral-500">{cert.ref}</p>
      </div>

      <div className="px-8 py-8 text-center sm:px-14 sm:py-10">
        <p className="text-caption-size font-bold uppercase tracking-[0.28em] text-neutral-500">Certificate of completion</p>
        <h1 className="mx-auto mt-6 max-w-[40rem] text-balance text-lg font-semibold leading-snug text-neutral-950 sm:text-xl md:text-2xl">
          {cert.title}
        </h1>
        {cert.programLine ? <p className="mt-3 text-sm text-neutral-600">{cert.programLine}</p> : null}
        <p className="mt-10 text-sm text-neutral-600">Awarded to</p>
        <p className="mt-2 text-3xl font-semibold text-[#0f62fe] sm:text-4xl">{profile.name}</p>
        <p className="mt-10 font-mono text-sm text-neutral-600">Date · {cert.issuedDisplay}</p>
      </div>
    </div>
  );
}

function InfosysSpringboardLayout({ cert }: Props) {
  return (
    <div
      className="certificate-print w-full max-w-[52rem] border border-[#cce0f0] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)] print:max-w-none print:shadow-none"
      role="document"
    >
      <div className="border-b border-[#e3eef8] bg-[#f7fbff] px-8 py-6 sm:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Image src={LOGO_INFOSYS} alt="Infosys" width={220} height={88} className="h-11 w-auto sm:h-12" priority />
          <p className="text-right text-caption-size font-semibold uppercase tracking-[0.18em] text-[#007cc3]">Springboard</p>
        </div>
      </div>

      <div className="px-8 py-10 text-center sm:px-14 sm:py-12">
        <p className="text-caption-size font-bold uppercase tracking-[0.26em] text-[#007cc3]">Certificate of learning</p>
        <h1 className="mx-auto mt-6 max-w-[40rem] text-balance text-lg font-semibold leading-snug text-[#003b5c] sm:text-xl md:text-2xl">
          {cert.title}
        </h1>
        {cert.programLine ? <p className="mt-3 text-sm text-neutral-600">{cert.programLine}</p> : null}
        <p className="mt-10 text-sm text-neutral-600">This is awarded to</p>
        <p className="mt-2 text-3xl font-semibold text-[#003b5c] sm:text-4xl">{profile.name}</p>
        <p className="mt-10 font-mono text-sm text-neutral-600">Date of issue · {cert.issuedDisplay}</p>
        <p className="mt-4 font-mono text-caption-size text-neutral-500">Record · {cert.ref}</p>
      </div>
    </div>
  );
}
