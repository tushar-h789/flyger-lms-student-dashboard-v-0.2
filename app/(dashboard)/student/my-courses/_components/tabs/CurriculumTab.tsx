"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PlayCircle, Play, Award } from "lucide-react";
import { CurriculumItem } from "@/lib/types/course";

interface CurriculumTabProps {
  curriculum: CurriculumItem[];
  nextLesson: CurriculumItem | undefined;
  isCompleted: boolean;
}

export default function CurriculumTab({
  curriculum,
  nextLesson,
  isCompleted,
}: CurriculumTabProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {isCompleted
                ? "Course Completed! 🎉"
                : nextLesson
                ? "Continue Learning"
                : "Start Learning"}
            </h3>
            {nextLesson && (
              <p className="text-xs sm:text-sm text-gray-600 break-words">
                Next: {nextLesson.title}
              </p>
            )}
          </div>
          <div className="w-full sm:w-auto shrink-0">
            {nextLesson && (
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm">
                <Play className="h-4 w-4 mr-2" />
                Continue
              </Button>
            )}
            {isCompleted && (
              <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm">
                <Award className="h-4 w-4 mr-2" />
                View Certificate
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {curriculum.map((item, index) => (
          <div
            key={item.id}
            className={`p-3 sm:p-4 rounded-lg border transition-all ${
              item.type === "section"
                ? "bg-blue-50 border-blue-200"
                : item.completed
                ? "bg-green-50 border-green-200 hover:border-green-300 cursor-pointer"
                : index === 0 ||
                  curriculum[index - 1]?.completed ||
                  curriculum[index - 1]?.type === "section"
                ? "bg-white border-gray-200 hover:border-blue-300 cursor-pointer hover:shadow-sm"
                : "bg-gray-50 border-gray-200 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {item.type === "lesson" && (
                  <div className="shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    ) : index === 0 ||
                      curriculum[index - 1]?.completed ||
                      curriculum[index - 1]?.type === "section" ? (
                      <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    ) : (
                      <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                )}
                <span
                  className={`text-sm sm:text-base font-medium break-words ${
                    item.type === "section"
                      ? "text-blue-900"
                      : item.completed
                      ? "text-green-900"
                      : "text-gray-900"
                  }`}
                >
                  {item.title}
                </span>
              </div>
              {item.duration && (
                <span className="text-xs sm:text-sm text-gray-600 ml-2 sm:ml-4 shrink-0">
                  {item.duration}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
