import { format, isToday, isTomorrow } from "date-fns";

export const formatTime = (date: Date) => format(date, "h:mm a");

export const formatDate = (date: Date) => {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d, yyyy");
};

export const getPlatformColor = (platform: string) => {
  // Only Google Meet is supported
  return "bg-green-100 text-green-800 border-green-200";
};

export const getPlatformIcon = (platform: string) => {
  // Only Google Meet is supported
  return "🟢";
};
