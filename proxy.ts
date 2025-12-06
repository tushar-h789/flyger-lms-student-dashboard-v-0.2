import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/student"]; // protect dashboard
const publicRoutes = ["/callback", "/auth/start"]; // allow callback and auth initiator

export async function proxy(request: NextRequest) {
  // AUTHENTICATION COMMENTED OUT - Allow all routes without authentication
  // const accessToken = request.cookies.get("logto_token_set")?.value;
  const { pathname } = request.nextUrl;
  // const configuredBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  // Normalize "/sign-in" and "/login" to local OIDC initiator
  // if (pathname.startsWith("/sign-in") || pathname.startsWith("/login")) {
  //   if (accessToken) {
  //     if (configuredBase) {
  //       return NextResponse.redirect(`${configuredBase}/student`);
  //     }
  //     return NextResponse.redirect(new URL("/student", request.url));
  //   }
  //   return NextResponse.redirect(new URL("/auth/start", request.url));
  // }

  // If user is logged in and visits root, send to dashboard
  // if (accessToken && (pathname === "/" || pathname === "")) {
  //   if (configuredBase) {
  //     return NextResponse.redirect(`${configuredBase}/student`);
  //   }
  //   return NextResponse.redirect(new URL("/student", request.url));
  // }

  // if (
  //   publicRoutes.some((route) => pathname.startsWith(route)) ||
  //   pathname.startsWith("/api")
  // ) {
  //   return NextResponse.next();
  // }
  // Allow public routes and API routes to pass through
  // if (
  //   publicRoutes.some((route) => pathname.startsWith(route)) ||
  //   pathname.startsWith("/api") ||
  //   pathname === "/" ||
  //   pathname.startsWith("/_next") ||
  //   pathname.startsWith("/favicon")
  // ) {
  //   return NextResponse.next();
  // }

  // const isProtected = protectedRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

  // if (!isProtected) {
  //   return NextResponse.next();
  // }

  // console.log("get access token", accessToken);

  // if (!accessToken) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
  // if (!accessToken) {
  //   return NextResponse.redirect(new URL("/auth/start", request.url));
  // }

  // Allow all routes to pass through without authentication
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
