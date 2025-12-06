"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Clock,
  BookOpen,
  Tag,
  Globe,
  Gauge,
  Award,
  Infinity,
  Play,
  Linkedin,
  Link as LinkIcon,
  TrendingUp,
} from "lucide-react";
import { CurriculumItem } from "@/lib/types/course";

interface RightSidebarProps {
  // Course completion status
  isCompleted: boolean;
  nextLesson: CurriculumItem | undefined;
  progress: number;
  completedLessons: number;
  totalLessons: number;

  // Course details
  duration: string;
  lectures: number;
  category: string;
  language: string;
  skillLevel: string;
  certificate: string;
  access: string;
}

export default function RightSidebar({
  isCompleted,
  nextLesson,
  progress,
  completedLessons,
  totalLessons,
  duration,
  lectures,
  category,
  language,
  skillLevel,
  certificate,
  access,
}: RightSidebarProps) {
  return (
    <div className="lg:col-span-1 w-full">
      <div className="space-y-4 sm:space-y-5 lg:space-y-5 xl:space-y-6">
        {/* Continue Learning Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 lg:p-5 xl:p-6 lg:sticky lg:top-4">
          {isCompleted ? (
            <div className="text-center mb-4 sm:mb-5 lg:mb-5 xl:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-3 lg:mb-3 xl:mb-4">
                <Award className="h-6 w-6 sm:h-7 sm:w-7 lg:h-7 lg:w-7 xl:h-8 xl:w-8 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-lg xl:text-xl font-bold text-gray-900 mb-2">
                Congratulations! 🎉
              </h3>
              <p className="text-xs sm:text-sm lg:text-sm text-gray-600 mb-3 sm:mb-3 lg:mb-3 xl:mb-4">
                You've completed this course
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm lg:text-sm h-9 sm:h-10">
                <Award className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </div>
          ) : (
            <div className="mb-4 sm:mb-5 lg:mb-5 xl:mb-6">
              <h3 className="text-base sm:text-lg lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-3 lg:mb-3 xl:mb-4">
                Continue Learning
              </h3>
              {nextLesson ? (
                <div className="mb-3 sm:mb-3 lg:mb-3 xl:mb-4">
                  <p className="text-xs sm:text-sm lg:text-sm text-gray-600 mb-2">
                    Next Lesson:
                  </p>
                  <p className="text-sm sm:text-base lg:text-sm xl:text-base font-medium text-gray-900 mb-3 sm:mb-3 lg:mb-3 xl:mb-4 wrap-break-word leading-snug">
                    {nextLesson.title}
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm lg:text-sm h-9 sm:h-10">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Course
                  </Button>
                </div>
              ) : (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm lg:text-sm h-9 sm:h-10">
                  <Play className="h-4 w-4 mr-2" />
                  Start Course
                </Button>
              )}
            </div>
          )}

          {/* Progress Section */}
          <div className="mb-4 sm:mb-5 lg:mb-5 xl:mb-6 pb-4 sm:pb-4 lg:pb-5 xl:pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm lg:text-sm font-medium text-gray-900">
                Course Progress
              </span>
              <span className="text-base sm:text-lg lg:text-lg xl:text-xl font-bold text-blue-600">
                {progress}%
              </span>
            </div>
            <div className="h-2.5 sm:h-2.5 lg:h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-800 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs lg:text-xs text-gray-600">
              <span>{completedLessons} completed</span>
              <span>{totalLessons - completedLessons} remaining</span>
            </div>
          </div>

          {/* Learning Statistics */}
          <div className="space-y-2 sm:space-y-2.5 lg:space-y-2.5 xl:space-y-3 mb-4 sm:mb-5 lg:mb-5 xl:mb-6">
            <div className="flex items-center justify-between p-2.5 sm:p-2.5 lg:p-2.5 xl:p-3 bg-sky-50 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-sky-600 shrink-0" />
                <span className="text-xs sm:text-sm lg:text-sm text-gray-700">
                  Lessons
                </span>
              </div>
              <span className="text-xs sm:text-sm lg:text-sm xl:text-base font-semibold text-gray-900">
                {completedLessons}/{totalLessons}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 sm:p-2.5 lg:p-2.5 xl:p-3 bg-sky-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-sky-600 shrink-0" />
                <span className="text-xs sm:text-sm lg:text-sm text-gray-700">
                  Completion
                </span>
              </div>
              <span className="text-xs sm:text-sm lg:text-sm xl:text-base font-semibold text-gray-900">
                {progress}%
              </span>
            </div>
          </div>

          {/* Course Details */}
          <div className="space-y-2.5 sm:space-y-3 lg:space-y-3 xl:space-y-4">
            <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-2.5 xl:gap-3">
              <Clock className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-xs lg:text-xs xl:text-sm text-gray-600 mb-0.5">
                  Duration
                </p>
                <p className="text-sm sm:text-sm lg:text-sm xl:text-base font-medium text-gray-900 wrap-break-word">
                  {duration}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-2.5 xl:gap-3">
              <BookOpen className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-xs lg:text-xs xl:text-sm text-gray-600 mb-0.5">
                  Total Lessons
                </p>
                <p className="text-sm sm:text-sm lg:text-sm xl:text-base font-medium text-gray-900">
                  {lectures} lessons
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-2.5 xl:gap-3">
              <Tag className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-xs lg:text-xs xl:text-sm text-gray-600 mb-0.5">
                  Category
                </p>
                <p className="text-sm sm:text-sm lg:text-sm xl:text-base font-medium text-gray-900 wrap-break-word">
                  {category}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-2.5 xl:gap-3">
              <Globe className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-xs lg:text-xs xl:text-sm text-gray-600 mb-0.5">
                  Language
                </p>
                <p className="text-sm sm:text-sm lg:text-sm xl:text-base font-medium text-gray-900 wrap-break-word">
                  {language}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-2.5 xl:gap-3">
              <Gauge className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-xs lg:text-xs xl:text-sm text-gray-600 mb-0.5">
                  Skill Level
                </p>
                <p className="text-sm sm:text-sm lg:text-sm xl:text-base font-medium text-gray-900 wrap-break-word">
                  {skillLevel}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-2.5 xl:gap-3">
              <Award className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-xs lg:text-xs xl:text-sm text-gray-600 mb-0.5">
                  Certificate
                </p>
                <p className="text-sm sm:text-sm lg:text-sm xl:text-base font-medium text-gray-900 wrap-break-word">
                  {certificate}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-2.5 lg:gap-2.5 xl:gap-3">
              <Infinity className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-xs lg:text-xs xl:text-sm text-gray-600 mb-0.5">
                  Access
                </p>
                <p className="text-sm sm:text-sm lg:text-sm xl:text-base font-medium text-gray-900 wrap-break-word">
                  {access}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 lg:p-5 xl:p-6">
          <p className="text-xs sm:text-sm lg:text-sm font-medium text-gray-900 mb-2 sm:mb-2.5 lg:mb-2.5 xl:mb-3">
            Share Course
          </p>
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-2.5 xl:gap-3">
            <button className="w-9 h-9 sm:w-9 sm:h-9 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
              <span className="text-xs sm:text-xs lg:text-xs xl:text-sm font-bold">
                f
              </span>
            </button>
            <button className="w-9 h-9 sm:w-9 sm:h-9 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors">
              <Linkedin className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
            </button>
            <button className="w-9 h-9 sm:w-9 sm:h-9 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:bg-gray-700 transition-colors">
              <LinkIcon className="h-4 w-4 sm:h-4 sm:w-4 lg:h-4 lg:w-4 xl:h-5 xl:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
