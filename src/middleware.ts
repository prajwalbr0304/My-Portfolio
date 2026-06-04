import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rolling rate-limit bucket for Edge runtimes
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const ip = (request as any).ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
  const path = request.nextUrl.pathname;
  /** Static files under `public/documents/` — must allow same-origin iframe embed on /cv. */
  const isDocumentPath = path.startsWith("/documents/");

  // 1. IP-Based Rate Limiting on API endpoints
  if (path.startsWith("/api/ai")) {
    const now = Date.now();
    const limit = 20; // Max 20 requests per minute
    const windowMs = 60 * 1000; // 1 minute window

    const clientData = rateLimitCache.get(ip);

    if (!clientData || now > clientData.resetTime) {
      // Initialize or reset window bucket
      rateLimitCache.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
      // Increment bucket
      clientData.count += 1;
      if (clientData.count > limit) {
        return new NextResponse(
          JSON.stringify({ error: "Too many prompt queries. Please wait 1 minute." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "60",
            },
          }
        );
      }
    }
  }

  // 2. Global Security Headers Integration
  const response = NextResponse.next();
  const headers = response.headers;

  const isDev = process.env.NODE_ENV !== "production";

  // Content Security Policy (allows Next.js inline styles and dev server websockets safely)
  // Do not use upgrade-insecure-requests in dev — it breaks http://localhost CSS/JS loads.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' wss: ws: https://generativelanguage.googleapis.com;
    media-src 'self' blob: https://external-cdn.morphic.com;
    frame-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDev ? "" : "upgrade-insecure-requests;"}
  `.replace(/\s{2,}/g, " ").trim();

  if (!isDocumentPath) {
    headers.set("Content-Security-Policy", cspHeader);
    headers.set("X-Frame-Options", "DENY");
  } else {
    headers.set("X-Frame-Options", "SAMEORIGIN");
    // Omit site-wide CSP on PDFs — `frame-ancestors 'none'` on the file response blocks /cv iframe previews.
  }
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
