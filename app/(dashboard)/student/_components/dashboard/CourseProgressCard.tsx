"use client";

import React from "react";
import { Star } from "lucide-react";

type CourseProgressCardProps = {
  thumbnail?: React.ReactNode;
  author?: string;
  title?: string;
  rating?: number; // 0-5
  progress?: number; // 0-100
  onPrimaryAction?: () => void;
  primaryLabel?: string;
};

export default function CourseProgressCard({
  thumbnail,
  author = "Super Admin",
  title = "MERN - Full Stack Web Development",
  rating = 5,
  progress = 67,
  onPrimaryAction,
  primaryLabel = "Complete This Course",
}: CourseProgressCardProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-4">
        <div className="h-28 w-40 rounded-md bg-gray-100">{thumbnail}</div>
        <div className="flex-1">
          <div className="text-xs text-gray-500">{author}</div>
          <div className="flex items-center gap-1 text-amber-500 text-xs">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`h-3 w-3 ${idx < rating ? "fill-current" : ""}`}
              />
            ))}
          </div>
          <div className="mt-1 text-sm font-medium text-gray-800">{title}</div>
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-violet-600"
                style={{ width: `${safeProgress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <button
                className="rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white"
                onClick={onPrimaryAction}
              >
                {primaryLabel}
              </button>
              <div className="text-xs text-gray-500">{safeProgress}%</div>
            </div>
          </div>
        </div>
        <button className="ml-2 h-8 w-8 grid place-items-center rounded-full bg-gray-100 text-gray-600">
          ›
        </button>
      </div>
    </div>
  );
}
