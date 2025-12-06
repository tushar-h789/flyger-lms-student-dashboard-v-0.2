import { handleLoginCallback } from "@/lib/action/auth-actions";
import { storeTokens } from "@/lib/utils/token-manager";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    console.log("=== CALLBACK ROUTE HIT ===");
    console.log("Full Request URL:", request.url);

    const { searchParams } = new URL(request.url);
    console.log("searchParams object:", searchParams.toString());

    const code = searchParams.get("code");
    const iss = searchParams.get("iss") || undefined;
    const error = searchParams.get("error");
    console.log("Received code:", code);
    console.log("Received error:", error);

    if (error) {
      console.warn("❌ OAuth error detected:", error);
      return NextResponse.redirect(new URL("/auth/start", request.url));
    }

    if (!code) {
      console.warn("⚠️ No authorization code found in callback URL!");
      return NextResponse.redirect(new URL("/auth/start", request.url));
    }

    const codeVerifier = request.cookies.get("pkce_verifier")?.value;
    console.log("PKCE code_verifier cookie:", codeVerifier);

    if (!codeVerifier) {
      console.warn("⚠️ Missing PKCE verifier cookie!");
      return NextResponse.redirect(new URL("/auth/start", request.url));
    }

    // Build base from current request headers to match /auth/start redirect_uri
    const hdrs = await headers();
    const host =
      hdrs.get("x-forwarded-host") || hdrs.get("host") || "localhost:3000";
    const proto =
      hdrs.get("x-forwarded-proto") ||
      (host.startsWith("localhost") ? "http" : "https");
    const baseUrl = `${proto}://${host}`.replace(/\/+$/, "");
    console.log(
      "Detected base URL:",
      baseUrl,
      "(configured:",
      baseUrl ? "yes" : "no",
      ")"
    );

    const redirectUri = `${baseUrl}/callback`;
    console.log("Generated redirect URI:", redirectUri);

    console.log("🚀 Calling handleLoginCallback...");
    const tokens = await handleLoginCallback(
      code,
      codeVerifier,
      redirectUri,
      iss
    );
    console.log("✅ handleLoginCallback completed successfully.", tokens);

    // Store tokens via centralized helper (sets proper cookies)
    await storeTokens(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.expiresIn,
      tokens.idToken
    );

    // Redirect to dashboard
    // return NextResponse.redirect(`${baseUrl}/student`);
    // Also set client-readable cookie for JS usage
    const response = NextResponse.redirect(`${baseUrl}/student`);
    response.cookies.set("logto_access_token", tokens.accessToken, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // Make it client-readable!
      maxAge: tokens.expiresIn,
    });
    return response;
  } catch (error) {
    console.error("🔥 Callback error:", error);
    return NextResponse.redirect(new URL("/auth/start", request.url));
  }
}
