"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Gauge,
  BookOpen,
  ListChecks,
  Video,
  Library,
  Heart,
  type LucideIcon,
  User2,
  User,
  Ticket,
} from "lucide-react";
// import { useAuth } from "@/lib/hooks/use-auth";

// Explicit types
type MenuIcon = LucideIcon;

type MenuLink = { href: string; label: string; icon: MenuIcon };

const menuItems: MenuLink[] = [
  { href: "/student", label: "Dashboard", icon: Gauge },
  {
    href: "/student/my-courses",
    label: "My Courses",
    icon: BookOpen,
  },
  {
    href: "/student/my-assessment",
    label: "My Assignments",
    icon: ListChecks,
  },
  { href: "/student/live-class", label: "Live Classes", icon: Video },
  { href: "/student/gds-simulator", label: "GDS Simulator", icon: Ticket },
  { href: "/student/e-library", label: "E-Library", icon: Library },
  { href: "/student/my-wishlist", label: "My WishList", icon: Heart },
  { href: "/student/my-profile", label: "My Profile", icon: User },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  scrollTarget: boolean;
};

export default function StudentSidebar({
  isOpen,
  onClose,
  scrollTarget,
}: SidebarProps) {
  // AUTHENTICATION COMMENTED OUT - Using mock user data
  // const { user: userData } = useAuth();
  // console.log("userData", userData);

  const userData = {
    id: "mock-user-id",
    name: "Rafiq Islam",
    email: "rafiq121@gmail.com",
    picture: null,
  };
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  // const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
  // console.log("claims", claims);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleWheel = (e: WheelEvent) => {
      if (scrollTarget) {
        e.stopPropagation();
      } else {
        e.preventDefault();
      }
    };

    sidebar.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      sidebar.removeEventListener("wheel", handleWheel);
    };
  }, [scrollTarget]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed top-14 bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="student-sidebar"
        className={`fixed top-14 bottom-0 left-0 w-64 border-r border-gray-200 bg-white shadow-lg md:shadow-none z-40 flex flex-col transition-transform duration-300 ${
          scrollTarget ? "overflow-y-auto" : "overflow-y-hidden"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        aria-label="Student navigation"
      >
        {/* Fixed Profile Section */}
        <div className="px-4 py-6 shrink-0">
          <div className="flex flex-col justify-center text-center items-center gap-3">
            {/* <div className="h-20 w-20 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center font-semibold text-xl">
              {userData?.name?.charAt(0)}
            </div> */}
            <div className="h-20 w-20 rounded-full overflow-hidden border">
              {userData?.picture ? (
                <Image
                  src={userData?.picture}
                  alt={userData?.name || "Student"}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-xl">
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div>
              <div className="text-gray-700 font-medium">{userData?.name}</div>
              <div className="text-sm text-gray-400">{userData?.email}</div>
            </div>
          </div>

          <div className="mt-6 h-px bg-gray-200" />
        </div>

        {/* Scrollable Navigation Section */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-6">
          <nav className="mt-4 space-y-1" role="navigation">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-3 transition-colors ${
                    active
                      ? "bg-linear-to-r from-sky-600/20 to-blue-600/20 text-indigo-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={onClose} // close on mobile
                >
                  <item.icon size={18} className="text-indigo-600" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
