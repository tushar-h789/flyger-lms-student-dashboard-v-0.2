"use client";

import { Calendar, Clock4, Users, User } from "lucide-react";
import { LiveClass } from "./data";
import { formatDate, formatTime, getPlatformIcon } from "./utils";

interface UpcomingClassesListProps {
  classes: LiveClass[];
  selectedClassId?: string | null;
  onSelect: (cls: LiveClass) => void;
}

export default function UpcomingClassesList({
  classes,
  selectedClassId,
  onSelect,
}: UpcomingClassesListProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5">
      <h2 className="md:text-lg text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Clock4 className="w-6 h-6 mr-2 text-blue-600" />
        Upcoming Classes
      </h2>

      <div className="space-y-4">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedClassId === classItem.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => onSelect(classItem)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className=" text-base font-semibold text-gray-900 line-clamp-2">
                  {classItem.title}
                </h3>
              </div>
              <div>
                <span className="text-xs font-medium px-1 py-1 rounded-full border border-sky-500  ml-2 shrink-0">
                  {getPlatformIcon(classItem.platform)}
                </span>
            
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-1">
              <User className="w-4 h-4 mr-1" />
              {classItem.instructor}
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(classItem.startTime)} •{" "}
              {formatTime(classItem.startTime)}
            </div>

            <div className="flex items-center justify-end">
              {/* <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                {classItem.participants} students
              </div> */}
              {classItem.isLive && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                  Live
                </span>
              )}
            </div>
          </div>
        ))}

        {classes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock4 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No upcoming classes scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
