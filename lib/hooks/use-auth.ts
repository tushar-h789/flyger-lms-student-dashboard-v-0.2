"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogtoUser } from "@/lib/types/auth";
import { getSession, handleLogout } from "../action/auth-actions";

export function useAuth() {
  const [user, setUser] = useState<LogtoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        setIsLoading(true);
        setError(null);
        const session = await getSession();
        setUser(session.user || null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Auth error"));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, []);

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      setError(null);

      // Clear local state FIRST
      setUser(null);

      // Call the server action for logout
      // This redirects to Logto session end endpoint which clears Logto cookies
      await handleLogout();

      // Server action redirects to Logto, which then redirects back
      // No additional redirect needed
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Logout failed");
      setError(error);
      console.error("Logout error:", error);

      // Even if logout fails, clear local state and redirect
      setUser(null);
      window.location.href = "/auth/start";
    } finally {
      setIsLoggingOut(false);
    }
  };

  const clearError = () => setError(null);

  return {
    user,
    isLoading,
    isLoggingOut,
    error,
    logout,
    clearError,
  };
}
