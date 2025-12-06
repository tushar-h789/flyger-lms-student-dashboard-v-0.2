import { OidcConfig, LogtoUser } from "@/lib/types/auth";
import crypto from "crypto";

/**
 * Parses API scopes from environment variable
 * Handles both formats:
 * - Space-separated string: "read:live_class"
 * - JSON array string: '[""read:live_class"]'
 * Returns space-separated string for OAuth2 scope parameter
 */
function parseApiScopes(envValue?: string): string {
  if (!envValue) return "";

  const trimmed = envValue.trim();
  if (!trimmed) return "";

  // Try to parse as JSON array first
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean).join(" ");
    }
  } catch {
    // Not JSON, treat as space-separated string
  }

  // Return as-is if it's already a space-separated string
  return trimmed;
}

export async function fetchOidcConfig(
  issuerOverride?: string
): Promise<OidcConfig> {
  const endpointEnv = process.env.NEXT_PUBLIC_LOGTO_ENDPOINT || "";
  const endpoint = (issuerOverride || endpointEnv).replace(/\/+$/, "");
  const wellKnown = endpoint.endsWith("/oidc")
    ? `${endpoint}/.well-known/openid-configuration`
    : `${endpoint}/oidc/.well-known/openid-configuration`;
  const response = await fetch(wellKnown, { cache: "force-cache" });
  // console.log(".well", response);

  if (!response.ok) {
    throw new Error("Failed to fetch OIDC configuration");
  }
  const data = await response.json();
  console.log("logto data", data);

  // Map snake_case from discovery to our camelCase OidcConfig
  return {
    authorizationEndpoint: data.authorization_endpoint,
    tokenEndpoint: data.token_endpoint,
    userinfoEndpoint: data.userinfo_endpoint,
    issuer: data.issuer,
    jwksUri: data.jwks_uri,
    scopesSupported: data.scopes_supported || [],
  };
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string,
  issuerOverride?: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
}> {
  const config = await fetchOidcConfig(issuerOverride);
  const appId = process.env.NEXT_PUBLIC_LOGTO_APP_ID;
  const appSecret = process.env.LOGTO_APP_SECRET;
  const apiResource = (process.env.NEXT_PUBLIC_API_RESOURCE || "").trim();
  // redirectUri provided by caller to ensure exact match with authorize request
  // console.log("info", config, appId, appSecret);

  const params = new URLSearchParams();
  params.set("grant_type", "authorization_code");
  if (appId) params.set("client_id", appId);
  if (appSecret) params.set("client_secret", appSecret);
  params.set("code", code);
  params.set("code_verifier", codeVerifier);
  params.set("redirect_uri", redirectUri);

  // Request JWT format access token with audience
  params.set("token_format", "jwt");

  // Build scope parameter - always include base scopes, add resource permissions if resource is configured
  let scope = "openid profile email offline_access";

  if (apiResource && apiResource.length > 0) {
    params.set("audience", apiResource);
    params.set("resource", apiResource);

    // Get resource-specific permissions from environment variable
    // These are the actual permissions configured in Logto for this API resource
    // Supports both formats:
    // - Space-separated: "create:live_class read:live_class"
    // - JSON array: '["create:live_class", "read:live_class"]'
    const resourcePermissionsRaw = process.env.NEXT_PUBLIC_API_SCOPES;
    const resourcePermissions = parseApiScopes(resourcePermissionsRaw);

    console.log("🔍 Token Exchange Debug:");
    console.log("  - API Resource:", apiResource);
    console.log(
      "  - Resource Permissions (raw from env):",
      resourcePermissionsRaw || "NOT SET"
    );
    console.log(
      "  - Resource Permissions (parsed):",
      resourcePermissions || "EMPTY"
    );
    console.log("  - Base scope:", scope);

    if (resourcePermissions) {
      scope = `${scope} ${resourcePermissions}`;
      console.log("  - Final scope with permissions:", scope);
    } else {
      console.warn(
        "  ⚠️ NEXT_PUBLIC_API_SCOPES not set or empty! Token will not have resource permissions."
      );
      console.warn(
        "  ⚠️ Set NEXT_PUBLIC_API_SCOPES to your resource permissions:"
      );
      console.warn(
        "     Format 1 (space-separated): create:live_class read:live_class"
      );
      console.warn(
        '     Format 2 (JSON array): ["create:live_class", "read:live_class"]'
      );
    }
  }

  params.set("scope", scope);
  console.log("📤 Token request params - scope:", params.get("scope"));

  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  // console.log("response", response);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Token exchange failed: ${errorText}`;

    // Try to parse error as JSON for better error messages
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error) {
        errorMessage = `Token exchange failed: ${errorJson.error}`;
        if (errorJson.error_description) {
          errorMessage += ` - ${errorJson.error_description}`;
        }
        console.error("❌ Token Exchange Error Details:", errorJson);
      }
    } catch {
      // Not JSON, use text as-is
    }

    console.error("❌ Token Exchange Failed:");
    console.error("  - Status:", response.status, response.statusText);
    console.error("  - Error:", errorMessage);
    console.error("  - Request scope:", params.get("scope"));
    console.error("  - Request resource:", params.get("resource"));

    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log("📥 Token Response:");
  console.log(
    "  - access_token:",
    data.access_token ? "✅ received" : "❌ missing"
  );
  console.log(
    "  - scope in response:",
    data.scope || "❌ EMPTY (this is the problem!)"
  );
  console.log("  - expires_in:", data.expires_in);

  // Decode and log the access token to see what scope it contains
  if (data.access_token) {
    try {
      const tokenParts = data.access_token.split(".");
      if (tokenParts.length === 3) {
        // Decode base64url (JWT uses base64url encoding)
        const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "===".slice((base64.length + 3) % 4);
        const payload = JSON.parse(
          Buffer.from(padded, "base64").toString("utf-8")
        );
        console.log(
          "  - Decoded token scope:",
          payload.scope || "❌ EMPTY in token"
        );
        console.log("  - Decoded token aud:", payload.aud);
      }
    } catch (e) {
      console.log(
        "  - Could not decode token:",
        e instanceof Error ? e.message : String(e)
      );
    }
  }

  // Map snake_case fields from Logto to our camelCase contract
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    idToken: data.id_token,
    expiresIn: data.expires_in,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}> {
  const config = await fetchOidcConfig();
  const appId = process.env.NEXT_PUBLIC_LOGTO_APP_ID;
  const appSecret = process.env.LOGTO_APP_SECRET;

  const apiResource = (process.env.NEXT_PUBLIC_API_RESOURCE || "").trim();

  const refreshParams = new URLSearchParams();
  refreshParams.set("grant_type", "refresh_token");
  if (appId) refreshParams.set("client_id", appId);
  if (appSecret) refreshParams.set("client_secret", appSecret);
  refreshParams.set("refresh_token", refreshToken);

  // Request JWT format access token
  refreshParams.set("token_format", "jwt");

  // Build scope parameter - always include base scopes, add resource permissions if resource is configured
  let scope = "openid profile email offline_access";

  if (apiResource && apiResource.length > 0) {
    refreshParams.set("audience", apiResource);
    refreshParams.set("resource", apiResource);

    // Get resource-specific permissions from environment variable
    // These are the actual permissions configured in Logto for this API resource
    const resourcePermissions =
      parseApiScopes(process.env.NEXT_PUBLIC_API_SCOPES) || "";

    if (resourcePermissions) {
      scope = `${scope} ${resourcePermissions}`;
    }
  }

  refreshParams.set("scope", scope);

  const response = await fetch(config.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: refreshParams.toString(),
  });
  // console.log("refresh response token", response);

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  };
}

export async function fetchUserInfo(accessToken: string): Promise<LogtoUser> {
  const config = await fetchOidcConfig();

  const response = await fetch(config.userinfoEndpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  // console.log("fetch user info in token", response);

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
}

export async function logoutUser(
  idToken?: string,
  redirectUri?: string
): Promise<{ logoutUrl: string }> {
  const config = await fetchOidcConfig();
  const appId = process.env.NEXT_PUBLIC_LOGTO_APP_ID;

  // Use provided redirectUri or default
  // CRITICAL: This MUST be our app's URL, NOT Logto's sign-in page
  // If this is not registered in Logto dashboard, Logto will redirect to sign-in
  const finalRedirectUri =
    redirectUri ||
    process.env.NEXT_PUBLIC_LOGTO_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL}/`;

  // Build logout URL with OIDC parameters for COMPLETE session invalidation
  const logoutParams = new URLSearchParams();

  // CRITICAL: id_token_hint helps Logto identify and invalidate the specific session
  if (idToken) {
    logoutParams.set("id_token_hint", idToken);

    // Extract user ID from ID token to use as logout_hint
    // This forces Logto to invalidate ALL sessions for this user
    try {
      const tokenParts = idToken.split(".");
      if (tokenParts.length === 3) {
        const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64 + "===".slice((base64.length + 3) % 4);
        const payload = JSON.parse(
          Buffer.from(padded, "base64").toString("utf-8")
        );
        if (payload.sub) {
          // logout_hint with user ID forces complete session revocation
          logoutParams.set("logout_hint", payload.sub);
        }
      }
    } catch (e) {
      console.warn("Could not extract user ID from token for logout_hint:", e);
    }
  }

  if (appId) {
    logoutParams.set("client_id", appId);
  }

  logoutParams.set("post_logout_redirect_uri", finalRedirectUri);

  // Add state parameter to ensure session is fully invalidated
  const logoutState = crypto.randomUUID();
  logoutParams.set("state", logoutState);

  // CRITICAL: Use Logto's session end endpoint
  // This endpoint will clear Logto's server-side cookies (_interaction, _session, etc.)
  const logoutUrl = `${
    config.issuer
  }/oidc/session/end?${logoutParams.toString()}`;

  console.log("🚪 Logout URL generated for COMPLETE session invalidation:");
  console.log("  - Has id_token_hint:", !!idToken);
  console.log(
    "  - Has logout_hint (user ID):",
    logoutParams.has("logout_hint")
  );
  console.log("  - Post-logout redirect URI:", finalRedirectUri);
  console.log(
    "  - ⚠️ IMPORTANT: This URI must be registered in Logto dashboard"
  );
  console.log("  - ⚠️ Logto will clear cookies BEFORE redirecting:");
  console.log("    * _session");
  console.log("    * _session.sig");
  console.log("    * _interaction");
  console.log("    * _interaction.sig");
  console.log("    * _logto");

  return { logoutUrl };
}
