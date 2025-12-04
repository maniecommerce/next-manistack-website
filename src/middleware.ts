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

  const isAuthPage =
    url.pathname === "/sign-in" ||
    url.pathname === "/sign-up" ||
    url.pathname === "/" ||
    url.pathname.startsWith("/verify");

  const isDashboardPage = url.pathname.startsWith("/dashboard");

  // ---- RULE #1 ----
  // If user is already logged in and tries to access auth pages → send to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ---- RULE #2 ----
  // If user is not logged in and tries to access dashboard → redirect to login with callbackUrl
  if (!token && isDashboardPage) {
    url.searchParams.set("callbackUrl", url.pathname); 
    return NextResponse.redirect(
      new URL(`/sign-in?${url.searchParams}`, request.url)
    );
  }

  return NextResponse.next();
}
