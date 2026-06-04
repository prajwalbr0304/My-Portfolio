import type { Variants } from "motion/react";

export const motionDurations = {
  instant: 0.09,
  fast: 0.16,
  normal: 0.26,
  slow: 0.42,
  cinematic: 0.78,
} as const;

export const motionEasing = {
  standard: [0.2, 0, 0, 1],
  enter: [0.16, 1, 0.3, 1],
  exit: [0.7, 0, 0.84, 0],
} as const;

export const motionTransitions = {
  fast: { duration: motionDurations.fast, ease: motionEasing.standard },
  normal: { duration: motionDurations.normal, ease: motionEasing.standard },
  enter: { duration: motionDurations.slow, ease: motionEasing.enter },
  cinematic: { duration: motionDurations.cinematic, ease: motionEasing.enter },
  spring: { type: "spring", stiffness: 180, damping: 24, mass: 0.8 },
} as const;

export const animationPresets = {
  fadeUp: {
    hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(10px)" },
    show: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  revealRight: {
    hidden: { opacity: 0, x: -18 },
    show: { opacity: 1, x: 0 },
  },
} satisfies Record<string, Variants>;

export const scrollAnimationPresets = {
  viewport: { once: true, margin: "-12% 0px -12% 0px" },
  fadeUp: {
    initial: "hidden",
    whileInView: "show",
    variants: animationPresets.fadeUp,
    transition: motionTransitions.enter,
  },
  scaleIn: {
    initial: "hidden",
    whileInView: "show",
    variants: animationPresets.scaleIn,
    transition: motionTransitions.cinematic,
  },
} as const;

export const pointerSpring = {
  stiffness: 80,
  damping: 22,
  mass: 0.9,
} as const;
