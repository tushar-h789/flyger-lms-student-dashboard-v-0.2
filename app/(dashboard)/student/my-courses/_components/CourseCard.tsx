"use client";

import Link from "next/link";
import { Course } from "@/lib/types/course";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const {
    id,
    title,
    instructor,
    rating,
    price,
    duration,
    enrolled,
    image,
    isBestseller,
    progress,
  } = course;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden hover:scale-105 transition-all duration-300">
      {/* Image Container */}
      <div className="relative w-full h-48 bg-linear-to-br from-blue-50 to-indigo-100">
        {isBestseller && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Bestseller
            </span>
          </div>
        )}

        {/* Placeholder for course image */}
        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-100 to-indigo-200">
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="object-cover"
          />
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-gray-800/70 text-white text-xs font-medium px-2 py-1 rounded">
            {duration}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {/* Instructor */}
        <p className="text-sm text-gray-600 mb-1 uppercase">{instructor}</p>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-12">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`h-4 w-4 ${
                  idx < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">
            {/* {rating} ({reviewCount}+) */}
            {rating}
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          {price === 0 ? (
            <span className="text-lg font-bold text-green-600">Free</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                BDT {price.toLocaleString()}
              </span>
              {/* {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  BDT {originalPrice.toLocaleString()}
                </span>
              )} */}
            </div>
          )}
        </div>

        {/* Students Count */}
        <p className="text-sm text-gray-600 mb-3">{enrolled}+ students</p>

        {/* Progress Bar - Only show if progress exists */}
        {progress !== undefined && (
          <div className="mb-3">
            <div className="h-2 w-full rounded-full bg-gray-200 mb-1">
              <div
                className="h-2 rounded-full bg-linear-to-r from-sky-500 to-blue-800 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs font-medium text-gray-900">
                {progress}% Complete
              </span>
            </div>
          </div>
        )}

        {/* View Course Button */}
        <Link href={`/student/my-courses/${id}`} className="block">
          <Button variant="customButton" className="w-full">
            View Course
          </Button>
        </Link>
      </div>
    </div>
  );
}
