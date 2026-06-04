/**
 * Home landing intro: suppress document scroll before React hydrates (avoids scrollbar flash).
 * `globals.css` targets `html[data-portfolio-intro-lock]`; React removes the attribute when the intro ends.
 *
 * Used only on **`/`** (landing). When the intro was already completed in this tab (`sessionStorage`),
 * we do **not** set the lock so returning to `/` without a reload can hand off to React without a wrong-theme flash.
 * A **full reload** clears the intro-dismissed flag so Refresh replays the intro (see `isDocumentReload`).
 *
 * **`/` + `/portfolio`:** body scripts run **after** `themeInitScript` in **`<head>`** so `data-theme` is correct
 * before intro lock and before `body` paints (fixes light-mode reload flashing dark).
 *
 * While locked on `/`, `globals.css` uses `data-theme`: **light** = flat white first frame; **dark** = aurora/mesh.
 */
export const INTRO_DISMISSED_SESSION_KEY = "portfolio_video_intro_dismissed";

/** Portfolio refresh → `/` + `/` scroll lock; one IIFE, `beforeInteractive` (see root `layout.tsx`). */
export const ROOT_BEFORE_INTERACTIVE_BOOTSTRAP = `(function(){try{if(typeof window==="undefined"||typeof sessionStorage==="undefined"||typeof performance==="undefined"||typeof document==="undefined")return;var w=window,d=document,nav=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0],isR=(nav&&nav.type==="reload")||(typeof performance.navigation!=="undefined"&&performance.navigation.type===1),k=${JSON.stringify(INTRO_DISMISSED_SESSION_KEY)},p=w.location.pathname||"";if(isR&&(p==="/portfolio"||p.indexOf("/portfolio/")===0||p==="/")){try{sessionStorage.removeItem(k);}catch(e){}}if(isR&&(p==="/portfolio"||p.indexOf("/portfolio/")===0)){w.location.replace("/");return;}if(p!=="/")return;if(w.matchMedia("(prefers-reduced-motion: reduce)").matches)return;try{if(sessionStorage.getItem(k)==="1"){d.documentElement.removeAttribute("data-portfolio-intro-lock");return;}}catch(e){}d.documentElement.setAttribute("data-portfolio-intro-lock","");}catch(e){}})();`;

/** @deprecated Use ROOT_BEFORE_INTERACTIVE_BOOTSTRAP; kept for grep / external refs */
export const PORTFOLIO_RELOAD_TO_ROOT_BOOTSTRAP = `(function(){try{if(typeof sessionStorage==="undefined"||typeof window==="undefined"||typeof performance==="undefined")return;var nav=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];var isReload=(nav&&nav.type==="reload")||(typeof performance.navigation!=="undefined"&&performance.navigation.type===1);if(!isReload)return;var k=${JSON.stringify(INTRO_DISMISSED_SESSION_KEY)};try{sessionStorage.removeItem(k);}catch(e){}var p=window.location.pathname||"";if(p==="/portfolio"||p.indexOf("/portfolio/")===0){window.location.replace("/");}}catch(e){}})();`;

/** @deprecated Use ROOT_BEFORE_INTERACTIVE_BOOTSTRAP */
export const PORTFOLIO_INTRO_SCROLL_LOCK_BOOTSTRAP = `(function(){try{if(typeof document==="undefined"||typeof window==="undefined")return;var path=window.location.pathname||"";if(path!=="/")return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;var k=${JSON.stringify(INTRO_DISMISSED_SESSION_KEY)};var nav=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];var isReload=(nav&&nav.type==="reload")||(typeof performance.navigation!=="undefined"&&performance.navigation.type===1);if(isReload){try{sessionStorage.removeItem(k);}catch(e){}}try{if(sessionStorage.getItem(k)==="1"){document.documentElement.removeAttribute("data-portfolio-intro-lock");return;}}catch(e){}document.documentElement.setAttribute("data-portfolio-intro-lock","");}catch(e){}})();`;

export function releasePortfolioIntroScrollLock(): void {
  if (typeof document === "undefined") return;
  document.documentElement.removeAttribute("data-portfolio-intro-lock");
}

/** Full page refresh (F5, reload). Used by `VideoLandingIntro` client logic; keep in sync with bootstrap `isR`. */
export function isDocumentReload(): boolean {
  if (typeof performance === "undefined") return false;
  const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (entry?.type === "reload") return true;
  try {
    const legacy = (performance as unknown as { navigation?: { type?: number } }).navigation;
    return legacy?.type === 1;
  } catch {
    return false;
  }
}
