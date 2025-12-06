"use client";

import React, { useState, useEffect, useRef } from "react";
// import { useAuth } from "@/lib/hooks/use-auth";
import StudentTopBar from "./_components/common/student-top-bar";
import StudentSidebar from "./_components/common/student-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  // AUTHENTICATION COMMENTED OUT - Using mock user data
  // const { user, isLoading } = useAuth();
  const user = {
    id: "mock-user-id",
    name: "Rafiq Islam",
    email: "rafiq121@gmail.com",
    picture: null,
  };
  const isLoading = false;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeScrollArea, setActiveScrollArea] = useState<
    "sidebar" | "content"
  >("content");
  const [isClient, setIsClient] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Ensure client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleMouseMove = (e: MouseEvent) => {
      const sidebar = document.querySelector("aside");

      if (!sidebar) return;

      const sidebarRect = sidebar.getBoundingClientRect();

      const mainContentRect = mainContentRef.current?.getBoundingClientRect();

      const isOverSidebar =
        e.clientX >= sidebarRect.left &&
        e.clientX <= sidebarRect.right &&
        e.clientY >= sidebarRect.top &&
        e.clientY <= sidebarRect.bottom;

      // Check if cursor is over main content
      const isOverContent =
        mainContentRect &&
        e.clientX >= mainContentRect.left &&
        e.clientX <= mainContentRect.right &&
        e.clientY >= mainContentRect.top &&
        e.clientY <= mainContentRect.bottom;

      if (isOverSidebar) {
        setActiveScrollArea("sidebar");
      } else if (isOverContent) {
        setActiveScrollArea("content");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isClient]);

  // AUTHENTICATION COMMENTED OUT - No loading or auth checks
  // Show loading state while checking authentication
  // if (isLoading || !isClient) {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-purple-50">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // If user is not authenticated, this should not happen due to middleware
  // but we'll keep this as a fallback
  // if (!user) {
  //   return null; // Middleware should have already redirected
  // }

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-gray-50 to-purple-50 overflow-hidden">
      {/* Top Bar - Fixed at top */}
      <div className="shrink-0 relative z-50">
        <StudentTopBar onMenuClick={openSidebar} />
      </div>

      {/* Main Content Area - Below Topbar */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        <StudentSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          scrollTarget={activeScrollArea === "sidebar"}
        />

        {/* Main Content */}
        <div
          ref={mainContentRef}
          className={`flex-1 ml-0 md:ml-64 transition-all duration-300 ${
            activeScrollArea === "content"
              ? "overflow-y-auto"
              : "overflow-y-hidden"
          }`}
          style={{
            scrollBehavior: "smooth",
          }}
        >
          <div className=" md:p-3 mt-14">
            <div className="mx-auto">{children}</div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        div::-webkit-scrollbar-thumb {
          background: #0ea5e9;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #0284c7;
        }
      `}</style>
    </div>
  );
}
