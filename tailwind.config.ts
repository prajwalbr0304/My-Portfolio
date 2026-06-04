import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      screens: {
        xs: "30rem",
        "3xl": "112rem",
      },
      containers: {
        xs: "30rem",
        sm: "40rem",
        md: "48rem",
        lg: "64rem",
        xl: "80rem",
        "2xl": "90rem",
      },
    },
  },
};

export default config;
