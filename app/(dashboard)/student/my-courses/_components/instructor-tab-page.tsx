"use client";

import React from "react";
import { Star } from "lucide-react";
import { InstructorDetails } from "@/lib/types/course";

interface InstructorTabProps {
  instructorDetails: InstructorDetails;
}

export default function InstructorTab({
  instructorDetails,
}: InstructorTabProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0">
            {instructorDetails.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
              {instructorDetails.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              {instructorDetails.title}
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
              {instructorDetails.bio}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                <span>{instructorDetails.rating}</span>
              </div>
              <div>{instructorDetails.students}+ Students</div>
              <div>{instructorDetails.courses} Courses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
