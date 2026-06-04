import { cn } from "@/lib/utils";

/** Hero India map logo — replace `public/images/india-map-logo.svg` to update artwork. */
const INDIA_MAP_LOGO_SRC = "/images/india-map-logo.svg";

/**
 * India map logo next to the hero name (square `em` box from parent).
 */
export function IndiaMapTricolorBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-block shrink-0 overflow-hidden", className)}
      role="img"
      aria-label="India"
    >
      {/* Local SVG: `next/Image` is unnecessary and can be awkward with very large path SVGs */}
      <img
        src={INDIA_MAP_LOGO_SRC}
        alt=""
        className="h-full w-full object-contain object-center"
        decoding="async"
        fetchPriority="low"
      />
    </span>
  );
}
