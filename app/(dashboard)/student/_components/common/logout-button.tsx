"use client";

import { Button } from "@/components/ui/button";
// import { useAuth } from "@/lib/hooks/use-auth";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton() {
  // AUTHENTICATION COMMENTED OUT - Logout disabled
  // const { logout, isLoggingOut } = useAuth();
  const logout = () => {
    console.log("Logout disabled - authentication is commented out");
  };
  const isLoggingOut = false;

  return (
    <Button
      onClick={logout}
      variant="outline"
      disabled={isLoggingOut}
      className="flex items-center gap-2"
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
}
