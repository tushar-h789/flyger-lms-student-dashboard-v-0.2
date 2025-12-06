// Live Class API Types

export interface CreateLiveClassRequest {
  course_name: string;
  instructor_name: string;
  instructor_id: string;
  class_start_time: string; // ISO 8601 format
  class_duration: string; // ISO 8601 duration format (PT10M, PT1H30M, etc.)
  class_details: string;
  class_link: string;
  class_link_info: string;
}

export interface LiveClassResponse {
  id: string;
  course_name: string;
  instructor_name: string;
  instructor_id: string;
  class_start_time: string;
  class_duration: string;
  class_details: string;
  class_link: string;
  class_link_info: string;
  created_at: string;
  updated_at: string;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
}

export interface LiveClassListResponse {
  data: LiveClassResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

// Form data types for UI components
export interface LiveClassFormData {
  courseName: string;
  instructorName: string;
  instructorId: string;
  classStartTime: string; // Date and time combined
  durationHours: number; // Duration in hours
  durationMinutes: number; // Duration in minutes
  classDetails: string;
  classLink: string;
  classLinkInfo: string;
}

// Utility type for converting form data to API request
export interface FormToApiConverter {
  convertFormToApi(formData: LiveClassFormData): CreateLiveClassRequest;
  convertApiToForm(apiData: LiveClassResponse): LiveClassFormData;
}
