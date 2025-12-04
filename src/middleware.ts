import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/",
    "/verify/:path*",
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const url = request.nextUrl;

  // Public routes that don't require login
  const publicAuthPages = ["/sign-in", "/sign-up"];
  const isPublicAuthPage =
    publicAuthPages.includes(url.pathname) ||
    url.pathname.startsWith("/verify");

  const isDashboard = url.pathname.startsWith("/dashboard");
  const isHome = url.pathname === "/";

  // ---- RULE #1 ----
  // Already logged in → redirect to dashboard if trying to visit home or login page
  if (token && (isPublicAuthPage || isHome)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ---- RULE #2 ----
  // Not logged in → block dashboard or home & force login
  if (!token && (isDashboard || isHome)) {
    url.searchParams.set("callbackUrl", url.pathname);
    return NextResponse.redirect(
      new URL(`/sign-in?${url.searchParams}`, request.url)
    );
  }

  return NextResponse.next();
}
