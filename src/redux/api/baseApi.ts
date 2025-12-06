import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { LogtoUser } from "@/lib/types/auth";
import { fetchOidcConfig } from "@/lib/services/logto-api";

console.log("api url", process.env.NEXT_PUBLIC_API_URL_MAIN);

export async function fetchUserInfo(accessToken: string): Promise<LogtoUser> {
  const config = await fetchOidcConfig();

  const response = await fetch(config.userinfoEndpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  console.log("fetch user info in token", response);

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  return response.json();
}

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

function getTokenFromStateOrCookie(): string | null {
  const cookieToken = getCookie("logto_access_token");
  if (cookieToken) {
    return cookieToken;
  }

  // Log for debugging
  console.warn("No token found in cookies");
  return null;
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL_MAIN || "http://localhost:3000/api/v1",
    // credentials: "include",
    prepareHeaders: (headers) => {
      // Set Content-Type first
      headers.set("Content-Type", "application/json");

      // Get token from cookie (client-readable)
      const token = getTokenFromStateOrCookie();

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
        console.log("✅ Token added to Authorization header");
      } else {
        console.warn("⚠️ No token available for Authorization header");
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["LiveClass"],
});
