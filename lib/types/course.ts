import { StaticImageData } from "next/image";

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  duration: string;
  lectures: number;
  enrolled: number;
  language: string;
  certificate: string;
  access: string;
  image: StaticImageData;
  isBestseller?: boolean;
  progress?: number; // 0-100 for enrolled courses
  description: string;
  requirements: string[];
  outcomes: string[];
  tools: string[];
  curriculum: CurriculumItem[];
  instructorDetails: InstructorDetails;
  reviews: Review[];
}

export interface CurriculumItem {
  id: string;
  title: string;
  type: "lesson" | "section";
  duration?: string;
  completed?: boolean;
}

export interface InstructorDetails {
  name: string;
  title: string;
  bio: string;
  image?: string;
  rating: number;
  students: number;
  courses: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
