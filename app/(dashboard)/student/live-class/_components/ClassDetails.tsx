"use client";

import {
  Calendar,
  Clock,
  ExternalLink,
  Play,
  Users,
  Video,
} from "lucide-react";
import { LiveClass } from "./data";
import { formatDate, formatTime, getPlatformColor } from "./utils";
import { intervalToDuration } from "date-fns";

interface ClassDetailsProps {
  classItem: LiveClass;
  onJoin: (cls: LiveClass) => void;
}

export default function ClassDetails({ classItem, onJoin }: ClassDetailsProps) {
  const now = new Date();
  const msToStart = classItem.startTime.getTime() - now.getTime();
  const minutesToStart = Math.floor(msToStart / (60 * 1000));
  const canOpenLink = minutesToStart <= 10; // enable 10 minutes before start

  const startsInLabel = (() => {
    if (classItem.isLive || classItem.startTime <= now) return "Now";
    const d = intervalToDuration({ start: now, end: classItem.startTime });
    const parts: string[] = [];
    if (d.months) parts.push(`${d.months} mo`);
    if (d.days) parts.push(`${d.days} d`);
    if (d.hours) parts.push(`${d.hours} h`);
    // Always show minutes, even if zero, when nothing else exists
    if (d.minutes || parts.length === 0) parts.push(`${d.minutes || 0} m`);
    return parts.join(" ");
  })();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            {/* <div className="flex items-center mb-2">
              {classItem.isLive && (
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  Live Now
                </span>
              )}
            </div> */}
            <div className="flex items-center gap-10">
              <h2 className="text-3xl font-bold mb-2">{classItem.title}</h2>
              <div className="flex items-center mb-2">
                {classItem.isLive && (
                  // <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                  //   <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  //   Live Now
                  // </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
                    Live
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-blue-100 opacity-90">
                with {classItem.instructor}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getPlatformColor(
                  classItem.platform
                )}`}
              >
                {classItem.platform.charAt(0).toUpperCase() +
                  classItem.platform.slice(1)}
              </span>
            </div>
            <div className="mt-4">
              {!classItem.isLive && classItem.startTime > now && (
                <div className="mt-4 sm:mt-0 sm:ml-4 bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-sm opacity-90">Starts in</div>
                  <div className="text-xl font-bold">{startsInLabel}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-blue-600" />
              <div>
                <div className="font-medium">
                  {formatDate(classItem.startTime)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatTime(classItem.startTime)}
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-3 text-green-600" />
              <div>
                <div className="font-medium">{classItem.duration} minutes</div>
                <div className="text-sm text-gray-500">Duration</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* <div className="flex items-center text-gray-700">
              <Users className="w-5 h-5 mr-3 text-purple-600" />
              <div>
                <div className="font-medium">
                  {classItem.participants} students
                </div>
                <div className="text-sm text-gray-500">Registered</div>
              </div>
            </div> */}

            <div className="flex items-center text-gray-700">
              <Video className="w-5 h-5 mr-3 text-red-600" />
              <div>
                <div className="font-medium">
                  {classItem.platform.charAt(0).toUpperCase() +
                    classItem.platform.slice(1)}
                </div>
                <div className="text-sm text-gray-500">Platform</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            About this class
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {classItem.description}
          </p>
        </div>

        {(classItem.meetingId || classItem.passcode) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Meeting Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classItem.meetingId && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Meeting ID
                  </label>
                  <div className="font-mono text-gray-900 bg-white px-3 py-2 rounded border">
                    {classItem.meetingId}
                  </div>
                </div>
              )}
              {classItem.passcode && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Passcode
                  </label>
                  <div className="font-mono text-gray-900 bg-white px-3 py-2 rounded border">
                    {classItem.passcode}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onJoin(classItem)}
            disabled={!classItem.isLive && classItem.startTime > now}
            className={`flex-1 inline-flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white transition-all duration-200 ${
              classItem.isLive || classItem.startTime <= now
                ? "bg-linear-to-r from-sky-500 to-blue-800 hover:from-blue-800 hover:to-sky-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <Play className="w-5 h-5 mr-2" />
            {classItem.isLive
              ? "Join Live Class"
              : classItem.startTime <= now
              ? "Join Recording"
              : "Class Not Started"}
          </button>

          <button
            onClick={() =>
              window.open(
                classItem.meetingLink,
                "_blank",
                "noopener,noreferrer"
              )
            }
            disabled={!canOpenLink && !classItem.isLive}
            className={`inline-flex items-center justify-center px-6 py-4 border text-lg font-medium rounded-xl transition-all duration-200 shadow-sm ${
              canOpenLink || classItem.isLive
                ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md cursor-pointer"
                : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Open Link
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Quick Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Join 10 minutes early to test your audio and video</li>
            <li>• Use a quiet space with good internet connection</li>
            <li>• Have your questions ready for the Q&A session</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
