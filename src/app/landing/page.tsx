import { permanentRedirect } from "next/navigation";

/** Legacy URL — intro now lives on `/` only. */
export default function LegacyLandingRedirect() {
  permanentRedirect("/");
}
