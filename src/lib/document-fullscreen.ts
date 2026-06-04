/** `document.documentElement` fullscreen with vendor fallbacks (Safari). */

type FsElement = Element & {
  webkitRequestFullscreen?: () => void;
  webkitRequestFullScreen?: () => void;
};

type FsDocument = Document & {
  webkitExitFullscreen?: () => void;
  webkitFullscreenElement?: Element | null;
};

export function isDocumentFullscreen(): boolean {
  if (typeof document === "undefined") return false;
  const d = document as FsDocument;
  return Boolean(document.fullscreenElement ?? d.webkitFullscreenElement);
}

export function isFullscreenApiAvailable(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.documentElement as FsElement;
  return Boolean(
    el.requestFullscreen ?? el.webkitRequestFullscreen ?? el.webkitRequestFullScreen,
  );
}

export async function enterDocumentFullscreen(): Promise<void> {
  const el = document.documentElement as FsElement;
  if (el.requestFullscreen) {
    await el.requestFullscreen();
    return;
  }
  if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
    return;
  }
  if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen();
    return;
  }
  throw new Error("Fullscreen API not available");
}

export async function exitDocumentFullscreen(): Promise<void> {
  const d = document as FsDocument;
  if (document.fullscreenElement && document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }
  if (d.webkitFullscreenElement && d.webkitExitFullscreen) {
    d.webkitExitFullscreen();
  }
}

export async function toggleDocumentFullscreen(): Promise<void> {
  if (isDocumentFullscreen()) await exitDocumentFullscreen();
  else await enterDocumentFullscreen();
}
