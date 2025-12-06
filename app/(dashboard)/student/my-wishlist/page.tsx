export default function MyWishlist() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        
        {/* Animated Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-linear-to-r from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl transform hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          My <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-600 to-blue-700">Wishlist</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          Your personal learning collection is on the way. Save and organize all your favorite content in one beautiful space.
        </p>

        {/* Progress Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800">Development Progress</span>
            <span className="text-sky-600 font-bold text-lg">65%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div className="bg-linear-to-r from-sky-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '65%'}}></div>
          </div>
          <p className="text-sm text-gray-500">Building your ultimate wishlist experience</p>
        </div>


        {/* CTA Button */}
        <button className="bg-linear-to-r from-sky-500 to-blue-800 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-lg py-4 px-12 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 mb-8">
          Notify Me When Ready
        </button>

        {/* Countdown */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Expected to launch in</p>
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mb-2 border border-gray-100">
                <span className="font-bold text-2xl text-gray-800">25</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">Days</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mb-2 border border-gray-100">
                <span className="font-bold text-2xl text-gray-800">04</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">Hours</span>
            </div>
      
          </div>
        </div>
      </div>
    </div>
  );
}