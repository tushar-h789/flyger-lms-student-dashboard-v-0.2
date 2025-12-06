import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getAccountsSignInUrl(baseOverride?: string): string {
  const configuredBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(
    /\/+$/,
    ""
  );
  const base = (baseOverride || configuredBase).replace(/\/+$/, "");
  const redirectUri = base ? `${base}/callback` : "/callback";
  const url = new URL("https://accounts.flygertech.cloud/sign-in");
  url.searchParams.set("redirect_uri", redirectUri);
  return url.toString();
}
