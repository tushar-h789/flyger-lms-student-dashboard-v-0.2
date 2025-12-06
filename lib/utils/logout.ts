"use client";

import { useAuth } from "@/lib/hooks/use-auth";

/**
 * Custom hook for logout functionality
 * Provides a simple way to logout from anywhere in the app
 * 
 * @returns Object containing logout function and loading state
 */
export function useLogout() {
  const { logout, isLoggingOut, error } = useAuth();
  
  return {
    logout,
    isLoggingOut,
    error
  };
}

/**
 * Simple logout function that can be called directly
 * This is useful for server actions or when you don't need the hook
 */
export async function performLogout() {
  const { handleLogout } = await import("@/lib/action/auth-actions");
  return handleLogout();
}
