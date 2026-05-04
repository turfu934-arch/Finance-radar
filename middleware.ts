import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/subscriptions", "/invoices", "/scans", "/settings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtected) {
    // Check for Supabase session cookie (name varies by project ref)
    const hasSession =
      req.cookies.has("sb-access-token") ||
      req.cookies.has("sb-auth-token") ||
      [...req.cookies.getAll()].some((c) => c.name.endsWith("-auth-token"));

    if (!hasSession) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
  }

  // Redirect authenticated users away from onboarding root
  if (pathname === "/onboarding") {
    const hasSession =
      req.cookies.has("sb-access-token") ||
      [...req.cookies.getAll()].some((c) => c.name.endsWith("-auth-token"));
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/subscriptions/:path*", "/invoices/:path*", "/scans/:path*", "/settings/:path*", "/onboarding"],
};
