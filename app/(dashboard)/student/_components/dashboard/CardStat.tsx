"use client";

import React from "react";

type CardStatProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  className?: string;
};

export default function CardStat({ title, value, icon, iconBg = "bg-blue-500", className }: CardStatProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-5 ${className ?? ""}`}>
      <div
        className={`h-11 w-11 rounded-full ${iconBg} text-white grid place-items-center shadow-sm`}
      >
        {icon}
      </div>
      <div className="mt-4 text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
    </div>
  );
}


