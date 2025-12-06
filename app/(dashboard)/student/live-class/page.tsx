// app/live-class/page.tsx
"use client";

import { useState, useEffect } from "react";
import { parse, toSeconds } from "iso8601-duration";
import UpcomingClassesList from "./_components/UpcomingClassesList";
import ClassDetails from "./_components/ClassDetails";
import EmptyState from "./_components/EmptyState";
import { LiveClass } from "./_components/data";
import { useGetLiveClassesQuery } from "@/src/redux/api";
import { LiveClassResponse } from "@/lib/types/live-class";

export default function LiveClassPage() {
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<LiveClass[]>([]);
  const [pastClasses, setPastClasses] = useState<LiveClass[]>([]);
  const {
    data: liveClasses,
    isLoading: isLiveClassesLoading,
    error,
  } = useGetLiveClassesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  // console.log("liveClasses", liveClasses);

  // Ticking clock to update UI (live state, countdowns, enabling buttons)
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 30000); // 30s tick
    return () => clearInterval(intervalId);
  }, []);

  // Convert ISO 8601 duration (e.g., PT3H15M0S) to minutes using iso8601-duration
  const convertIsoDurationToMinutes = (isoDuration?: string): number => {
    if (!isoDuration) return 60;
    try {
      const duration = parse(isoDuration);
      const seconds = toSeconds(duration);
      if (!Number.isFinite(seconds) || seconds <= 0) return 60;
      return Math.max(1, Math.round(seconds / 60));
    } catch {
      return 60;
    }
  };

  useEffect(() => {
    if (!liveClasses) return;

    const mapped: LiveClass[] = (liveClasses?.data || []).map(
      (apiItem: LiveClassResponse): LiveClass => {
        const startTime = new Date(apiItem.class_start_time);
        const durationMinutes = convertIsoDurationToMinutes(
          apiItem.class_duration
        );
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);
        const isLiveByTime = now >= startTime && now <= endTime;
        const isLive = apiItem.status === "ongoing" || isLiveByTime;
        return {
          id: apiItem?.id,
          title: apiItem?.course_name || "Untitled Class",
          instructor: apiItem?.instructor_name || "Instructor Name",
          description: apiItem?.class_details || "No description available.",
          startTime,
          duration: durationMinutes,
          meetingLink: apiItem?.class_link || "https://meet.google.com/",
          platform: "google-meet",
          participants: 0, // Not provided by API
          isLive,
        };
      }
    );

    // Keep classes visible in Upcoming from start time until they end (live window)
    const upcoming = mapped
      .filter((cls) => {
        const diff = cls?.startTime.getTime() - now.getTime();
        return diff >= 0 || cls.isLive; // future or currently live
      })
      .sort((a, b) => a?.startTime.getTime() - b?.startTime.getTime());

    // Past classes: already started and not currently live
    const past = mapped
      .filter((cls) => {
        const diff = cls.startTime.getTime() - now.getTime();
        return diff < 0 && !cls.isLive;
      })
      .sort((a, b) => b?.startTime.getTime() - a?.startTime.getTime());

    setUpcomingClasses(upcoming);
    setPastClasses(past);

    // Auto-select the first upcoming class, or first item if no upcoming
    if (!selectedClass) {
      if (upcoming.length > 0) {
        setSelectedClass(upcoming[0]);
      } else if (mapped.length > 0) {
        setSelectedClass(mapped[0]);
      } else {
        setSelectedClass(null);
      }
    }
  }, [liveClasses, now]);

  const handleJoinClass = (classItem: LiveClass) => {
    if (classItem?.isLive || classItem?.startTime <= new Date()) {
      window.open(classItem?.meetingLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen  py-8">
      {isLiveClassesLoading ? (
        <div>Loading...</div>
      ) : error && "data" in error ? (
        <div>Error: {error.data as string}</div>
      ) : (
        <div className=" mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="md:text-4xl text-2xl font-bold text-gray-900 mb-4">
              Live Classes
            </h1>
            <p className="md:text-xl  text-gray-600 ">
              Join interactive live sessions with expert instructors and fellow
              students
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="lg:col-span-1 space-y-6">
              <UpcomingClassesList
                classes={upcomingClasses}
                selectedClassId={selectedClass?.id || ""}
                onSelect={setSelectedClass}
              />
            </div>

            <div className="lg:col-span-2">
              {selectedClass ? (
                <ClassDetails
                  classItem={selectedClass}
                  onJoin={handleJoinClass}
                />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
