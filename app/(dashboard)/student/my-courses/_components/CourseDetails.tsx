"use client";

import React, { useMemo, useState } from "react";
import { Course, Review } from "@/lib/types/course";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import Image from "next/image";
import {
  OverviewTab,
  CurriculumTab,
  InstructorTab,
  ReviewsTab,
  QATab,
} from "./tabs";
import RightSidebar from "./RightSidebar";

interface CourseDetailsProps {
  course: Course;
}

// Mock current user - in real app, get from auth context
const CURRENT_USER = "You"; // This would come from auth context

export default function CourseDetails({ course }: CourseDetailsProps) {
  const {
    title,
    instructor,
    category,
    skillLevel,
    rating,
    reviewCount,
    duration,
    lectures,
    language,
    certificate,
    access,
    description,
    requirements,
    outcomes,
    tools,
    curriculum,
    instructorDetails,
    reviews: initialReviews,
    progress = 0,
  } = course;

  // State for reviews management
  // Filter out current user's review from initial reviews to ensure clean initial state
  const filteredInitialReviews = useMemo(() => {
    return initialReviews.filter((review) => review.userName !== CURRENT_USER);
  }, [initialReviews]);

  const [reviews, setReviews] = useState<Review[]>(filteredInitialReviews);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate completion statistics
  const completedLessons = useMemo(() => {
    return curriculum.filter((item) => item.type === "lesson" && item.completed)
      .length;
  }, [curriculum]);

  const totalLessons = useMemo(() => {
    return curriculum.filter((item) => item.type === "lesson").length;
  }, [curriculum]);

  // Find next lesson to continue
  const nextLesson = useMemo(() => {
    return curriculum.find((item) => item.type === "lesson" && !item.completed);
  }, [curriculum]);

  const isCompleted = progress === 100;

  // Check if current user already has a review
  const hasUserReview = useMemo(() => {
    return reviews.some((review) => review.userName === CURRENT_USER);
  }, [reviews]);

  // Handle add new review
  const handleAddReview = async (rating: number, comment: string) => {
    // Prevent multiple reviews from same user
    if (hasUserReview) return;

    setIsSubmitting(true);
    const review: Review = {
      id: `review-${Date.now()}`,
      userName: CURRENT_USER,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };

    // Simulate API call
    setTimeout(() => {
      setReviews([review, ...reviews]);
      setIsSubmitting(false);
    }, 300);
  };

  // Handle start editing
  const handleStartEdit = (review: Review) => {
    setEditingReviewId(review.id);
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  // Handle save edited review
  const handleSaveEdit = async (
    reviewId: string,
    rating: number,
    comment: string
  ) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                rating,
                comment,
                date: new Date().toISOString().split("T")[0],
              }
            : review
        )
      );
      setEditingReviewId(null);
      setIsSubmitting(false);
    }, 300);
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId: string) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setReviews(reviews.filter((review) => review.id !== reviewId));
      setIsSubmitting(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Dark Blue Background */}
      <div className="bg-[#0F1729] text-white">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-200 mb-2">
                <span>My Courses</span>
                <span>/</span>
                <span>Course Details</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 break-words">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <Badge className="bg-purple-600 text-white border-none text-xs">
                  {category}
                </Badge>
                <Badge className="bg-blue-600 text-white border-none text-xs">
                  {skillLevel}
                </Badge>
                <Badge className="bg-green-600 text-white border-none text-xs">
                  By - {instructor}
                </Badge>
                <Badge className="bg-gray-700 text-white border-none flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {rating} ({reviewCount}+)
                </Badge>
              </div>
              {/* Progress in Header */}
              <div className="mt-3 sm:mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-blue-200">
                    Your Progress
                  </span>
                  <span className="text-base sm:text-lg font-bold">
                    {progress}%
                  </span>
                </div>
                <div className="h-2 w-full bg-blue-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-blue-200">
                  <span>
                    {completedLessons} of {totalLessons} lessons completed
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-64 lg:w-72 xl:w-80 h-40 sm:h-48 lg:h-56 xl:h-64 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              <Image
                src={course.image}
                alt={course.title}
                width={500}
                height={500}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-6 xl:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-6 xl:gap-8">
          {/* Left Column - Course Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full mb-4 sm:mb-5 lg:mb-6 flex flex-wrap gap-2 bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="overview"
                  className="flex-1 min-w-[120px] sm:flex-initial sm:min-w-[130px] lg:min-w-[140px] bg-gray-100 hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-md font-medium"
                >
                  OVERVIEW
                </TabsTrigger>
                <TabsTrigger
                  value="curriculum"
                  className="flex-1 min-w-[120px] sm:flex-initial sm:min-w-[130px] lg:min-w-[140px] bg-gray-100 hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-md font-medium"
                >
                  CURRICULUM
                </TabsTrigger>
                <TabsTrigger
                  value="instructor"
                  className="flex-1 min-w-[120px] sm:flex-initial sm:min-w-[130px] lg:min-w-[140px] bg-gray-100 hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-md font-medium"
                >
                  INSTRUCTOR
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 min-w-[120px] sm:flex-initial sm:min-w-[130px] lg:min-w-[140px] bg-gray-100 hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 py-2 rounded-md font-medium"
                >
                  REVIEWS
                </TabsTrigger>
                {/* <TabsTrigger
                  value="qa"
                  className="flex-1 min-w-[120px] sm:flex-initial sm:min-w-[140px] bg-gray-100 hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300 cursor-pointer text-xs sm:text-sm px-3 py-2 rounded-md font-medium"
                >
                  QA
                </TabsTrigger> */}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <OverviewTab
                  requirements={requirements}
                  description={description}
                  outcomes={outcomes}
                  tools={tools}
                />
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum">
                <CurriculumTab
                  curriculum={curriculum}
                  nextLesson={nextLesson}
                  isCompleted={isCompleted}
                />
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent value="instructor">
                <InstructorTab instructorDetails={instructorDetails} />
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <ReviewsTab
                  reviews={reviews}
                  currentUserId={CURRENT_USER}
                  hasUserReview={hasUserReview}
                  editingReviewId={editingReviewId}
                  isSubmitting={isSubmitting}
                  onAddReview={handleAddReview}
                  onEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDelete={handleDeleteReview}
                />
              </TabsContent>

              {/* QA Tab */}
              {/* <TabsContent value="qa">
                <QATab />
              </TabsContent> */}
            </Tabs>
          </div>

          {/* Right Sidebar - Learning Stats & Info */}
          <RightSidebar
            isCompleted={isCompleted}
            nextLesson={nextLesson}
            progress={progress}
            completedLessons={completedLessons}
            totalLessons={totalLessons}
            duration={duration}
            lectures={lectures}
            category={category}
            language={language}
            skillLevel={skillLevel}
            certificate={certificate}
            access={access}
          />
        </div>
      </div>
    </div>
  );
}
