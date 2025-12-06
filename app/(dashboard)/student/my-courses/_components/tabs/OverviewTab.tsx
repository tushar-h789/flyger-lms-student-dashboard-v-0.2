"use client";

import React from "react";

interface OverviewTabProps {
  requirements: string[];
  description: string;
  outcomes: string[];
  tools: string[];
}

export default function OverviewTab({
  requirements,
  description,
  outcomes,
  tools,
}: OverviewTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Course Requirements */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Course Requirements
        </h3>
        <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
          {requirements.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>

      {/* Course Description */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Course Description
        </h3>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Course Outcomes */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Course Outcomes
        </h3>
        <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
          {outcomes.map((outcome, idx) => (
            <li key={idx}>{outcome}</li>
          ))}
        </ul>
      </div>

      {/* Tools You'll Learn */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
          Tools You'll Learn
        </h3>
        <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
          {tools.map((tool, idx) => (
            <li key={idx}>{tool}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

