import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getIdToken, clearTokens } from "@/lib/utils/token-manager";
import { logoutUser } from "@/lib/services/logto-api";

/**
 * Logout route handler following Logto documentation pattern:
 *
 * IMPORTANT: In Next.js, we cannot directly clear third-party cookies
 * (like _session and _session.sig on accounts.flygertech.cloud) due to
 * browser security restrictions. Instead, we must:
 *
 * 1. Clear local session and remove all locally stored tokens/cookies
 * 2. Redirect to Logto's end session endpoint (/oidc/session/end)
 * 3. Logto will clear its own cookies (_session, _session.sig, _interaction, etc.)
 *    on its domain (accounts.flygertech.cloud) and redirect back
 *
 * This is different from Express where you can directly call res.clearCookie()
 * because Express cookies are on the same domain. Logto's cookies are on a
 * third-party domain, so only Logto can clear them.
 *
 * Reference: Logto documentation on sign-out flow
 */
export async function GET(request: NextRequest) {
  try {
    // Step 1: Get ID token BEFORE clearing (needed for Logto session invalidation)
    // The id_token_hint helps Logto identify which session to invalidate
    const idToken = await getIdToken();

    if (!idToken) {
      console.warn("⚠️ No ID token available for logout");
      // Still clear local cookies even without ID token
      await clearTokens();
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Step 2: Build redirect URI for post-logout redirect
    // CRITICAL: This MUST be our app's URL (NOT Logto's sign-in page)
    // After Logto clears its cookies, it will redirect back to this URI
    // This URI must be registered in Logto dashboard as an allowed post-logout redirect URI
    const hdrs = await headers();
    const host =
      hdrs.get("x-forwarded-host") || hdrs.get("host") || "localhost:3000";
    const proto =
      hdrs.get("x-forwarded-proto") ||
      (host.startsWith("localhost") ? "http" : "https");
    const base = `${proto}://${host}`.replace(/\/+$/, "");
    const redirectUri = `${base}/`;

    console.log("🔗 Post-logout redirect URI:", redirectUri);
    console.log("  - ⚠️ This URI must be registered in Logto dashboard");
    console.log(
      "  - ⚠️ If not registered, Logto will redirect to sign-in page"
    );

    // Step 3: Clear ALL local tokens and cookies FIRST
    // This ensures no stale data remains in our application
    // We clear our cookies: logto_token_set, logto_access_token, logto_refresh_token, etc.
    await clearTokens();

    console.log("🧹 Local session cookies cleared:");
    console.log("  - logto_token_set");
    console.log("  - logto_access_token");
    console.log("  - logto_refresh_token");
    console.log("  - logto_id_token");
    console.log("  - logto_expires_at");
    console.log("  - pkce_verifier");
    console.log("  - oauth_state");

    // Step 4: Redirect to Logto's end session endpoint
    // This is the CRITICAL step that clears Logto's cookies on accounts.flygertech.cloud:
    // - _session
    // - _session.sig
    // - _interaction
    // - _interaction.sig
    // - _logto
    try {
      const { logoutUrl } = await logoutUser(idToken, redirectUri);

      console.log("🚪 Redirecting to Logto session end endpoint:");
      console.log("  - URL:", logoutUrl);
      console.log(
        "  - This will clear Logto's cookies on accounts.flygertech.cloud:"
      );
      console.log("    * _session");
      console.log("    * _session.sig");
      console.log("    * _interaction");
      console.log("    * _interaction.sig");
      console.log("    * _logto");
      console.log(
        "  - After clearing, Logto will redirect back to:",
        redirectUri
      );

      // Redirect to Logto's session end endpoint
      // Logto will:
      // 1. Clear its cookies on accounts.flygertech.cloud domain
      // 2. Invalidate the server-side session
      // 3. Redirect back to post_logout_redirect_uri
      return NextResponse.redirect(logoutUrl);
    } catch (logoutError) {
      console.error("❌ Failed to generate Logto logout URL:", logoutError);
      // Even if logout URL generation fails, we've cleared local cookies
      // Redirect to root as fallback
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("❌ Logout route error:", error);

    // Ensure we always clear tokens on error
    try {
      await clearTokens();
    } catch (clearError) {
      console.error("❌ Failed to clear tokens during logout:", clearError);
    }

    // Redirect to root on error
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const dynamic = "force-dynamic";
