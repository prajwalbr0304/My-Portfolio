/**
 * Main portfolio UI (sections use hash anchors on this path).
 * Cinematic intro (name + video) is **`/`** only; after it finishes, navigation continues here.
 */
export const PORTFOLIO_PATH = "/portfolio";

export function portfolioHash(fragment: string): string {
  const id = fragment.startsWith("#") ? fragment.slice(1) : fragment;
  return `${PORTFOLIO_PATH}#${id}`;
}
