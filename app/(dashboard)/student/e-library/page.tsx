import React from "react";

export default function ELibrary() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        {/* Animated Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-linear-to-r from-sky-500 to-blue-800 rounded-2xl flex items-center justify-center mx-auto shadow-xl transform hover:scale-110 transition-transform duration-300">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          Digital{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-blue-800">
            Library
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Coming Soon
        </p>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          We're building an extensive digital library with thousands of books,
          research papers, and learning resources for your educational journey.
        </p>

        {/* Progress Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">
              Development Progress
            </span>
            <span className="text-blue-600 font-bold text-lg">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-linear-to-r from-sky-500 to-blue-800 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: "75%" }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            12,500+ resources curated so far
          </p>
        </div>

        {/* CTA Button */}
        <button className="bg-linear-to-r from-sky-500 to-blue-800 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-lg py-4 px-12 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200">
          Notify Me When Ready
        </button>

        {/* Countdown */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm mb-4">Expected to launch in</p>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-2 border border-gray-100">
                <span className="font-bold text-3xl text-gray-800">20</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">Days</span>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-md flex items-center justify-center mb-2 border border-gray-100">
                <span className="font-bold text-3xl text-gray-800">12</span>
              </div>
              <span className="text-sm text-gray-500 font-medium">Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
