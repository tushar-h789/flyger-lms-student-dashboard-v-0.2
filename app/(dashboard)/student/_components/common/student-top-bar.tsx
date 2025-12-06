"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bell, Heart, LogOut, Menu, Settings, User2 } from "lucide-react";
import Link from "next/link";
// import { useAuth } from "@/lib/hooks/use-auth";
import Image from "next/image";
// import { useAuth } from "@/lib/hooks/use-auth";
// import { logoutUser } from "@/lib/services/logto-api";

// const userData = {
//   name: "Md. Arif Hossain",
//   email: "arif.hossain@example.com",
//   picture: "/images/dashboard/avater.png",
// };
type TopBarProps = {
  onMenuClick?: () => void;
};

export default function StudentTopBar({ onMenuClick }: TopBarProps) {
  // AUTHENTICATION COMMENTED OUT - Using mock user data
  // const { user: userData, logout, isLoggingOut } = useAuth();
  // console.log("user", userData);
  
  const userData = {
    id: "mock-user-id",
    name: "Rafiq Islam",
    email: "rafiq121@gmail.com",
    picture: null,
  };
  const logout = async () => {
    console.log("Logout disabled - authentication is commented out");
  };
  const isLoggingOut = false;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* <div className="h-12 w-full " /> */}
      <header className="h-14 w-full bg-linear-to-r from-sky-500 to-blue-900 bg-white shadow-sm flex items-center px-4 justify-between">
        {/* Left section: hamburger on mobile + title */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="md:hidden h-8 w-8 grid place-items-center rounded-md border border-gray-200 bg-white/90 text-gray-700"
            aria-label="Open sidebar"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="md:hidden text-white font-semibold tracking-wide">
            Student
          </div>
        </div>

        {/* Search input: hidden on small screens to save space */}
        {/* <div className="relative w-[380px] max-w-[60vw] hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="h-9 w-full rounded-md border bg-gray-50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
            placeholder="Search for course, skills and Videos"
          />
        </div> */}
        <div className="flex items-center gap-2">
          <IconBtn>
            <Bell className="h-4 w-4" />
          </IconBtn>
          <IconBtn>
            <Heart className="h-4 w-4" />
          </IconBtn>
          {/* <div className="ml-1 h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center text-xs font-semibold">
            JS
          </div> */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full overflow-hidden border">
                {userData?.picture ? (
                  <Image
                    src={userData?.picture}
                    alt={userData?.name || "User"}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-indigo-100 text-indigo-700 flex items-center justify-center ">
                    {userData?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </button>

            {isMenuOpen ? (
              <div
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-md focus:outline-none"
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {userData?.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500 truncate">
                    {userData?.email}
                  </p>
                </div>
                <div className="h-px bg-gray-100" />
                <ul className="py-1">
                  <li>
                    <Link
                      href="/student/my-profile"
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <User2 className="h-4 w-4 text-gray-500" />
                      <span>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span>Settings</span>
                    </button>
                  </li>
                  <li className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                    {/* <button
                      type="button"
                      role="logout"
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogOut className="h-4 w-4 text-gray-500" />
                      <span>Logout</span>
                    </button> */}
                    {/* <SignOutButton /> */}
                    <li>
                      <button
                        type="button"
                        role="menuitem"
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={async () => {
                          setIsMenuOpen(false);
                          await logout();
                        }}
                        disabled={isLoggingOut}
                      >
                        <LogOut className="h-4 w-4 text-gray-500" />
                        <span>
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </span>
                      </button>
                    </li>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="h-8 w-8 grid place-items-center rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-600">
      {children}
    </button>
  );
}
