"use client";

import React from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { demoCourses } from "@/lib/data/courses";
import CourseDetails from "../_components/CourseDetails";

interface CourseDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const course = demoCourses.find((c) => c.id === id);

  if (!course) {
    router.push("/student/my-courses");
    return null;
  }

  return <CourseDetails course={course} />;
}

