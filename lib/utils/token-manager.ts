import { cookies } from "next/headers";

const TOKEN_COOKIE_NAME = "logto_token_set";
const REFRESH_TOKEN_COOKIE_NAME = "logto_refresh_token";
const EXPIRES_AT_COOKIE_NAME = "logto_expires_at";
const PKCE_VERIFIER_COOKIE_NAME = "pkce_verifier";
const ID_TOKEN_COOKIE_NAME = "logto_id_token";

// console.log("token set in coocke", TOKEN_COOKIE_NAME);

interface CookieOptions {
  secure: boolean;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none";
  path: string;
  maxAge?: number; // seconds
}

const getSecureCookieOptions = (maxAgeSeconds?: number): CookieOptions => ({
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  ...(maxAgeSeconds ? { maxAge: maxAgeSeconds } : {}),
});

export async function storeTokens(
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number,
  idToken?: string
): Promise<void> {
  const cookieStore = await cookies();
  // console.log("cookie store", cookieStore);

  const expiresAt = expiresIn
    ? Math.floor(Date.now() / 1000) + expiresIn
    : undefined;

  cookieStore.set(
    TOKEN_COOKIE_NAME,
    accessToken,
    getSecureCookieOptions(expiresIn ? expiresIn : undefined)
  );

  if (idToken) {
    cookieStore.set(
      ID_TOKEN_COOKIE_NAME,
      idToken,
      getSecureCookieOptions(expiresIn ? expiresIn : undefined)
    );
  }

  if (refreshToken) {
    cookieStore.set(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      getSecureCookieOptions(30 * 24 * 60 * 60) // 30 days in seconds
    );
  }

  if (expiresAt) {
    cookieStore.set(
      EXPIRES_AT_COOKIE_NAME,
      expiresAt.toString(),
      getSecureCookieOptions(expiresIn ? expiresIn : undefined)
    );
  }
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value ?? null;
}

export async function getIdToken(): Promise<string | null> {
  const cookieStore = await cookies();
  // console.log("cookie store", cookieStore);
  return cookieStore.get(ID_TOKEN_COOKIE_NAME)?.value ?? null;
}

export async function getTokenExpiresAt(): Promise<number | null> {
  const cookieStore = await cookies();
  const expiresAt = cookieStore.get(EXPIRES_AT_COOKIE_NAME)?.value;
  return expiresAt ? parseInt(expiresAt, 10) : null;
}

export async function isTokenExpired(): Promise<boolean> {
  const expiresAt = await getTokenExpiresAt();
  if (!expiresAt) return true;
  return Math.floor(Date.now() / 1000) > expiresAt - 60;
}

export async function clearTokens(): Promise<void> {
  const cookieStore = await cookies();
  
  // CRITICAL: Delete ALL authentication-related cookies
  // Next.js cookies().delete() only takes the cookie name
  // But we need to set them to expire by setting with empty value and past date
  const expiredDate = new Date(0); // January 1, 1970
  
  // Delete all authentication-related cookies by setting them to expire
  cookieStore.set(TOKEN_COOKIE_NAME, "", { 
    path: "/", 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiredDate 
  });
  
  cookieStore.set("logto_access_token", "", { 
    path: "/", 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
    expires: expiredDate 
  });
  
  cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, "", { 
    path: "/", 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiredDate 
  });
  
  cookieStore.set(EXPIRES_AT_COOKIE_NAME, "", { 
    path: "/", 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiredDate 
  });
  
  cookieStore.set(PKCE_VERIFIER_COOKIE_NAME, "", { 
    path: "/", 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiredDate 
  });
  
  cookieStore.set(ID_TOKEN_COOKIE_NAME, "", { 
    path: "/", 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiredDate 
  });
  
  // Also delete OAuth state cookie if exists
  cookieStore.set("oauth_state", "", { 
    path: "/", 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiredDate 
  });
  
  // Delete any other potential cookies
  cookieStore.set("logto_session", "", { 
    path: "/", 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiredDate 
  });
  
  cookieStore.set("logto_user", "", { 
    path: "/", 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    expires: expiredDate 
  });
  
  console.log("🧹 All authentication cookies cleared and expired");
}
