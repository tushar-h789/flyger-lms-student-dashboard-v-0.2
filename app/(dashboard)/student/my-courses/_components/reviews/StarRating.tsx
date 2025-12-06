"use client";

import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  showText?: boolean;
}

export default function StarRating({
  rating,
  onRatingChange,
  size = "md",
  interactive = false,
  showText = false,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const starSize = sizeClasses[size];

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleClick(idx)}
            disabled={!interactive}
            className={`focus:outline-none ${
              interactive
                ? "transition-transform hover:scale-110 cursor-pointer"
                : "cursor-default"
            }`}
          >
            <Star
              className={`${starSize} ${
                idx < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
      {showText && (
        <span className="ml-2 text-sm text-gray-600">{rating} out of 5</span>
      )}
    </div>
  );
}
