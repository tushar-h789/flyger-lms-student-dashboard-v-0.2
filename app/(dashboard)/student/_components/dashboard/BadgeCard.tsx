"use client";

import React from "react";
import { Star } from "lucide-react";

type BadgeCardProps = { title: string; subtitle: string };

export default function BadgeCard({ title, subtitle }: BadgeCardProps) {
  return (
    <div className="flex items-center justify-center text-center gap-4">
      <div>
        <div className="font-medium text-gray-800">{title}</div>
        <div className="h-24 w-24 rounded-full bg-yellow-400/25 grid place-items-center">
          <Star className="h-10 w-10 text-yellow-500" />
        </div>
        <div className="text-xs text-gray-500 leading-relaxed">{subtitle}</div>
      </div>
    </div>
  );
}
