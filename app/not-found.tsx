"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-24 h-24 rounded-full bg-white/10 top-1/4 left-1/6 animate-float-slow"></div>
        <div className="absolute w-32 h-32 rounded-full bg-white/5 top-3/4 right-1/5 animate-float-medium"></div>
        <div className="absolute w-20 h-20 rounded-full bg-white/8 bottom-1/4 left-1/3 animate-float-fast"></div>
        <div className="absolute w-28 h-28 rounded-full bg-white/6 top-1/2 right-1/4 animate-float-slow"></div>
      </div>

      {/* Main Content */}
      <div className="text-center text-white z-10 relative">
        {/* Animated 404 Number */}
        <div className="flex justify-center items-center space-x-2 mb-8">
          {[4, 0, 4].map((digit, index) => (
            <span
              key={index}
              className={`text-8xl md:text-9xl font-bold bg-gradient-to-b from-white to-gray-200 bg-clip-text text-transparent ${
                mounted ? "animate-bounce" : "opacity-0"
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationIterationCount: "infinite",
              }}
            >
              {digit}
            </span>
          ))}
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
          Page Not Found
        </h1>

        <p
          className="text-xl md:text-2xl mb-2 text-white/90 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Oops! Looks like you&apos;re lost in space
        </p>

        <p
          className="text-lg text-white/80 mb-12 max-w-md mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <button
          onClick={handleGoHome}
          className="group relative bg-white/20 backdrop-blur-lg border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/30 hover:border-white/50 hover:scale-105 hover:shadow-2xl active:scale-95 animate-fade-in-up cursor-pointer"
          style={{ animationDelay: "0.6s" }}
        >
          <span className="flex items-center space-x-3">
            <span>Back to Home</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </span>

          {/* Button Shine Effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </button>

        {/* Astronaut/Space Illustration */}
        <div className="mt-16 relative">
          <div className="w-32 h-32 mx-auto relative animate-float-slow">
            {/* Planet */}
            <div className="absolute w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
              <div className="absolute w-4 h-4 bg-orange-300 rounded-full top-4 left-6"></div>
              <div className="absolute w-3 h-3 bg-orange-200 rounded-full bottom-6 right-4"></div>
            </div>

            {/* Satellite */}
            <div className="absolute w-6 h-12 bg-gray-300 rounded-lg top-4 right-8 animate-orbit">
              <div className="absolute w-8 h-2 bg-gray-400 -right-1 top-2 rounded-r"></div>
              <div className="absolute w-2 h-2 bg-gray-500 rounded-full top-1 -left-1"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pulsing Dot */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse-slow"></div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(45deg);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.5);
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }

        .animate-orbit {
          animation: orbit 8s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
