"use client";

import React from "react";
import { demoCourses } from "@/lib/data/courses";
import CourseCard from "./_components/CourseCard";

export default function MyCourses() {
  return (
    <div className="container mx-auto px-2 sm:px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Continue learning and track your progress
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {demoCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
