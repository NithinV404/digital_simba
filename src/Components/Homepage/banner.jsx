
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { FaPlay } from "react-icons/fa";

export default function Banner() {
  return (
    <>
    <div className="relative flex flex-col m-6 rounded-4xl bg-gradient-to-r from-blue-200 to-purple-200 items-start justify-between gap-8 px-10 pt-10 pb-32">
      <div className="flex flex-row items-center justify-between px-10 space-x-62">
        <div className="flex flex-col items-start gap-4">
        <h1 className="text-4xl font-bold text-left mt-8">AI Meet With Social Media </h1>
        <p className="text-left  text-lg text-gray-600 max-w-md">
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
         <div className="flex justify-center items-center">
        <img src="/home-banner.jpg" alt="AI Banner" className="h-90 w-[80%] object-cover rounded-lg shadow-md" />
      </div>
      
      </div>
     
      <div className="absolute left-0 bottom-0 top-[80%] w-fit flex justify-center bg-white p-4 gap-4 rounded-4xl z-10">
        <img src="/coursera.jpg" alt="AI 1" className="h-16 w-46 object-contain rounded-lg shadow" />
        <img src="/pepsi.jpg" alt="AI 2" className="h-16 w-46 object-contain rounded-lg shadow" />
        <img src="/sitepoint.jpg" alt="AI 3" className="h-16 w-46 object-contain rounded-lg shadow" />
        <img src="/wpp.jpg" alt="AI 4" className="h-16 w-46 object-contain rounded-lg shadow" />
      </div>
    </div>
    </>
  )
}
