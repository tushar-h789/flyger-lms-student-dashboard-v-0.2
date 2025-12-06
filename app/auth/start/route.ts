import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { generatePkce } from "@/lib/action/auth-actions";
import { fetchOidcConfig } from "@/lib/services/logto-api";

export async function GET(request: NextRequest) {
  const hdrs = await headers();
  const host =
    hdrs.get("x-forwarded-host") || hdrs.get("host") || "localhost:3000";
  const proto =
    hdrs.get("x-forwarded-proto") ||
    (host.startsWith("localhost") ? "http" : "https");
  const base = `${proto}://${host}`.replace(/\/+$/, "");

  const redirectUri = `${base}/callback`;
  const appId = process.env.NEXT_PUBLIC_LOGTO_APP_ID || "";

  const config = await fetchOidcConfig();
  const { codeChallenge } = await generatePkce();
  const apiResource = (process.env.NEXT_PUBLIC_API_RESOURCE || "").trim();

  const url = new URL(config.authorizationEndpoint);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");

  // Build scope parameter with base scopes and resource permissions if resource is configured
  let scope = "openid profile email offline_access";

  if (apiResource && apiResource.length > 0) {
    // Get resource-specific permissions from environment variable
    // These are the actual permissions configured in Logto for this API resource
    // Supports both formats:
    // - Space-separated: "read:live_class"
    // - JSON array: '[""read:live_class"]'
    const resourcePermissionsRaw = process.env.NEXT_PUBLIC_API_SCOPES;
    let resourcePermissions = "";

    // Parse the environment variable (handle both JSON array and space-separated string)
    if (resourcePermissionsRaw) {
      const trimmed = resourcePermissionsRaw.trim();
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          resourcePermissions = parsed.filter(Boolean).join(" ");
        } else {
          resourcePermissions = trimmed;
        }
      } catch {
        // Not JSON, treat as space-separated string
        resourcePermissions = trimmed;
      }
    }

    console.log("🔍 Authorization Request Debug:");
    console.log("  - API Resource:", apiResource);
    console.log(
      "  - Resource Permissions (raw from env):",
      resourcePermissionsRaw || "NOT SET"
    );
    console.log(
      "  - Resource Permissions (parsed):",
      resourcePermissions || "EMPTY"
    );

    if (resourcePermissions) {
      scope = `${scope} ${resourcePermissions}`;
      console.log("  - Final scope with permissions:", scope);
    } else {
      console.warn(
        "  ⚠️ NEXT_PUBLIC_API_SCOPES not set or empty! Authorization will not request resource permissions."
      );
    }
  }

  url.searchParams.set("scope", scope);
  console.log("📤 Authorization URL - scope:", url.searchParams.get("scope"));

  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", codeChallenge);
  
  // CRITICAL: Force FRESH authentication to bypass Logto's cookie-based session cache
  // prompt=login: Forces login UI (doesn't use SSO session)
  // max_age=0: Forces immediate re-authentication (bypasses any cached session)
  // Together, these ensure Logto creates a NEW session instead of reusing cached one
  url.searchParams.set("prompt", "login");
  url.searchParams.set("screen_hint", "login");
  url.searchParams.set("max_age", "0");
  
  // Add timestamp to prevent any URL-based caching
  url.searchParams.set("_ts", Date.now().toString());
  // Only add resource/audience if apiResource is a valid non-empty string
  // This prevents "invalid_target" error when resource is missing or unknown
  if (apiResource && apiResource.length > 0) {
    url.searchParams.set("resource", apiResource);
    url.searchParams.set("audience", apiResource);
  }

  return NextResponse.redirect(url);
}

export const dynamic = "force-dynamic";
