"use client";

import Image, { type ImageProps } from "next/image";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

type Base = {
  alt: string;
  src: string;
  /** Separate asset when `resolvedTheme === "dark"` (reads `html[data-theme]` via ThemeProvider). */
  srcDark?: string;
  /**
   * When there is only `src`, use CSS invert in dark mode so black glyphs stay visible
   * on dark surfaces (skip for full-color marks).
   */
  invertInDark?: boolean;
  unoptimized?: boolean;
  onError?: ImageProps["onError"];
  /** Classes on the image(s) (object-fit, padding, size, etc.). */
  imgClassName?: string;
};

type FillProps = Base & {
  fill: true;
  sizes: string;
};

type FixedProps = Base & {
  fill?: false;
  width: number;
  height: number;
};

/**
 * Renders a logo that stays legible in both themes: optional `srcDark`, or `invertInDark`.
 * Uses `useTheme().resolvedTheme` (not Tailwind `dark:` on two stacked images) so light vs dark
 * assets and filters always match `data-theme` after hydration.
 */
export function ThemeAwareLogo(props: FillProps | FixedProps) {
  const { alt, src, srcDark, invertInDark, unoptimized, onError, imgClassName } = props;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const activeSrc = srcDark && isDark ? srcDark : src;
  const singleDarkFilter = !srcDark && invertInDark && isDark ? "brightness-0 invert" : "";

  if ("fill" in props && props.fill) {
    const { sizes } = props;
    return (
      <Image
        src={activeSrc}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={unoptimized}
        onError={onError}
        className={cn(imgClassName, singleDarkFilter)}
      />
    );
  }

  const { width, height } = props as FixedProps;
  return (
    <Image
      src={activeSrc}
      alt={alt}
      width={width}
      height={height}
      unoptimized={unoptimized}
      onError={onError}
      className={cn(imgClassName, singleDarkFilter)}
    />
  );
}
