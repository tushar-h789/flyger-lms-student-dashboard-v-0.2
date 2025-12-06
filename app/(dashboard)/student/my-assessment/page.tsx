export default function MyAssessment() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center">
        {/* Main Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-linear-to-r from-sky-500 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
              <svg
                className="w-4 h-4 text-yellow-800"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Assessment{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-blue-800">
            Center
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Coming Soon{" "}
        </p>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          We're building a comprehensive assessment platform to help you track
          your progress and measure your skills. Stay tuned for something
          amazing!
        </p>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">
              Developing assessment features
            </span>
            <span className="text-sm font-bold text-sky-500">70%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-linear-to-r from-sky-500 to-blue-800 h-2.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: "70%" }}
            ></div>
          </div>
        </div>

        {/* Notify Button */}
        <button className="bg-linear-to-r from-sky-500 to-blue-800 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 mb-8">
          Notify Me When Ready
        </button>

        {/* Countdown */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Expected to launch in</p>
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center mb-1">
                <span className="font-bold text-xl text-gray-800">21</span>
              </div>
              <span className="text-xs text-gray-500">Days</span>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center mb-1">
                <span className="font-bold text-xl text-gray-800">08</span>
              </div>
              <span className="text-xs text-gray-500">Hours</span>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center mb-1">
                <span className="font-bold text-xl text-gray-800">45</span>
              </div>
              <span className="text-xs text-gray-500">Minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
