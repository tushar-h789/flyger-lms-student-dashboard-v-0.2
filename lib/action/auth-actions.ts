"use server";

import { redirect } from "next/navigation";
import { getIdToken, clearTokens } from "@/lib/utils/token-manager";
import { exchangeCodeForTokens } from "@/lib/services/logto-api";
import type { LogtoUser, AuthSession } from "@/lib/types/auth";
import crypto from "crypto";
import { cookies, headers } from "next/headers";

// Helper function to convert base64 to base64url format
function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Helper function to decode JWT token
function decodeJwt(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "===".slice((base64.length + 3) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function generatePkce(): Promise<{ codeChallenge: string }> {
  const codeVerifier = base64UrlEncode(crypto.randomBytes(32));
  const codeChallenge = base64UrlEncode(
    crypto.createHash("sha256").update(codeVerifier).digest()
  );

  // Store verifier in HttpOnly cookie so it can be read in the callback route
  const cookieStore = await cookies();
  cookieStore.set("pkce_verifier", codeVerifier, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { codeChallenge };
}

export async function handleLoginCallback(
  code: string,
  codeVerifier: string,
  redirectUri: string,
  issuerOverride?: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  idToken?: string;
}> {
  const tokenResponse = await exchangeCodeForTokens(
    code,
    codeVerifier,
    redirectUri,
    issuerOverride
  );
  // console.log("token-response", tokenResponse);

  return {
    accessToken: tokenResponse.accessToken,
    refreshToken: tokenResponse.refreshToken,
    idToken: tokenResponse.idToken,
    expiresIn: tokenResponse.expiresIn,
  };
}

export async function getCurrentUser(): Promise<LogtoUser | null> {
  try {
    // Get user info from ID token (contains all user data)
    const idToken = await getIdToken();
    if (idToken) {
      const decoded = decodeJwt(idToken);
      if (decoded && decoded.sub) {
        // Map JWT claims to LogtoUser format
        return {
          id: decoded.sub,
          username: decoded.username || decoded.preferred_username,
          name: decoded.name,
          email: decoded.email,
          emailVerified: decoded.email_verified,
          phone: decoded.phone_number,
          phoneVerified: decoded.phone_number_verified,
          picture: decoded.picture || decoded.avatar,
          createdAt: decoded.created_at,
          updatedAt: decoded.updated_at,
        } as LogtoUser;
      }
    }

    // If no ID token, return null (don't call userinfo endpoint)
    return null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

export async function getSession(): Promise<AuthSession> {
  const user = await getCurrentUser();
  return {
    isAuthenticated: !!user,
    user: user || undefined,
  };
}

/**
 * Server action for logout
 * Following Logto documentation pattern:
 * - Redirects to /auth/logout route handler which properly clears
 *   local cookies and redirects to Logto's session end endpoint
 */
export async function handleLogout(): Promise<void> {
  try {
    // Redirect to the logout route handler
    // The route handler will:
    // 1. Clear all local session cookies
    // 2. Redirect to Logto's end session endpoint
    redirect("/auth/logout");
  } catch (error) {
    console.error("❌ Logout error:", error);
    // Ensure we always clear tokens on error
    try {
      await clearTokens();
    } catch (clearError) {
      console.error("❌ Failed to clear tokens during logout:", clearError);
    }
    redirect("/");
  }
}
