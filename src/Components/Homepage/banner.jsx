import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";

export default function Banner() {
  return (
    <div className="relative flex flex-col m-6 rounded-4xl bg-gradient-to-r from-blue-200 to-purple-200 items-start justify-between gap-8 px-10 pt-10 pb-32 overflow-visible">
      <div className="flex flex-row items-center justify-between px-10 w-full">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-4xl font-bold text-left mt-8">
            AI Meet With Social Media
          </h1>
          <p className="text-left text-lg text-gray-600 max-w-md">
            Push a button, post on all socials. Social media - using AI. It's like having ChatGPT, Canva and Hootsuite at your fingertips.
          </p>
          <div className="flex justify-start mt-6">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center hover:bg-blue-700 transition-colors">
              Discover More
              <BsFillArrowUpRightCircleFill className="ml-2" />
            </button>
            <button className="ml-4 bg-gray-200 text-gray-800 px-6 py-3 rounded-full flex justify-center items-center hover:bg-gray-300 transition-colors">
              <FaPlay className="h-5 w-5 text-blue-600" />
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center -mx-20">
          <img
            src="/home-banner.jpg"
            alt="AI Banner"
            className="h-90 w-[80%] object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Logos bar, behind the SVG curve */}
      <div className="absolute left-8 -bottom-8 flex justify-center bg-white p-4 gap-4 rounded-2xl shadow-lg z-10">
        <img src="/coursera.jpg" alt="AI 1" className="h-16 w-24 object-contain rounded-lg shadow" />
        <img src="/pepsi.jpg" alt="AI 2" className="h-16 w-24 object-contain rounded-lg shadow" />
        <img src="/sitepoint.jpg" alt="AI 3" className="h-16 w-24 object-contain rounded-lg shadow" />
        <img src="/wpp.jpg" alt="AI 4" className="h-16 w-24 object-contain rounded-lg shadow" />
      </div>

      {/* SVG curve overlay
      <svg
        className="absolute left-0 bottom-0 w-full h-16 z-20 pointer-events-none"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="banner-gradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c7d2fe" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
        </defs>
        <path d="M0,20 Q50,0 100,20 L100,20 L0,20 Z" fill="url(#banner-gradient)" />
      </svg> */}
    </div>
  );
}