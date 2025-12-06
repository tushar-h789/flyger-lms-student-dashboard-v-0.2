import React from "react";
import {
  DollarSign,
  Receipt,
  Award,
  PlayCircle,
  ShoppingBag,
  GraduationCap,
} from "lucide-react";
import CardStat from "./_components/dashboard/CardStat";
// import { getSession } from "@/lib/action/auth-actions";
// import { redirect } from "next/navigation";

export default async function StudentDashboardHome() {
  // AUTHENTICATION COMMENTED OUT - Using mock user data
  // const session = await getSession();
  // console.log("session", session);

  // if (!session.isAuthenticated || !session.user) {
  //   redirect("/sign-in");
  // }
  
  const mockUserName = "Rafiq Islam";
  
  return (
    <main className="px-6 pb-8">
      <h1 className="text-2xl font-semibold text-gray-800">
        Good Afternoon, {mockUserName}
      </h1>
      <p className="text-sm text-gray-500 mt-1">6th October 2025 , Monday</p>

      {/* Top stats grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
        <CardStat
          title="Balance"
          value="$500.00"
          icon={<DollarSign className="h-5 w-5" />}
          iconBg="bg-blue-500"
        />
        <CardStat
          title="Total Spent"
          value="$100.00"
          icon={<Receipt className="h-5 w-5" />}
          iconBg="bg-rose-500"
        />
        <CardStat
          title="Certificates"
          value="0"
          icon={<Award className="h-5 w-5" />}
          iconBg="bg-emerald-500"
        />
        <CardStat
          title="Course In Progress"
          value="9"
          icon={<PlayCircle className="h-5 w-5" />}
          iconBg="bg-violet-500"
        />
        <CardStat
          title="Course Purchased"
          value="9"
          icon={<ShoppingBag className="h-5 w-5" />}
          iconBg="bg-amber-500"
        />
        <CardStat
          title="Completed Courses"
          value="0"
          icon={<GraduationCap className="h-5 w-5" />}
          iconBg="bg-sky-500"
        />
      </section>

      {/* Middle section */}
      {/* <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Upcoming Badge</h2>
          </div>
          <div className="mt-4">
            <BadgeCarousel />
          </div>
        </div>
        <CourseProgressCard />
      </section> */}
    </main>
  );
}
