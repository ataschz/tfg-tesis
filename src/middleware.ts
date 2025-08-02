import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const EXCLUDED_ROUTES = ["sign-in", "sign-up", "api/auth/", "/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isExcluded = EXCLUDED_ROUTES.some((route) =>
    pathname.startsWith(`/${route}`)
  );

  if (isExcluded) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
