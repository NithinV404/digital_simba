import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";


export default function Banner() {
  return (
    <>
      <div className="hidden md:flex relative flex-col m-6 rounded-4xl bg-gradient-to-r from-blue-200 to-purple-200 items-start justify-between gap-8 px-10 pt-10 pb-32">
        <div className="flex flex-row items-center justify-between px-10 space-x-62">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-4xl font-bold text-left mt-8">
              AI Meet With Social Media{" "}
            </h1>
            <p className="text-left  text-lg text-gray-600 max-w-md">
              Push a button, post on all socials. Social media - using AI. It's
              like having ChatGPT, Canva and Hootsuite at your fingertips.
            </p>
            <div className="flex justify-start mt-6">
              <button className="bg-gray-800 text-white px-6 py-3 rounded-full cursor-pointer flex items-center hover:bg-gray-900 transition-colors">
                Discover More
                <BsFillArrowUpRightCircleFill className="ml-2" />
              </button>
              <button className="ml-4 bg-white border-2 border-gray-300 text-gray-800 px-6 py-3 rounded-full flex justify-center items-center cursor-pointer  hover:bg-blue-300 transition-colors">
                <FaPlay className="h-5 w-5 text-gray-800" />
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center mt-0 w-auto">
            <img
              src="/home-banner.jpg"
              alt="AI Banner"
              className="h-90 w-[80%] object-cover rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="absolute left-0 bottom-0 top-[80%] w-fit flex justify-center bg-white p-4 gap-4 rounded-4xl z-10">
          <div className="relative z-40 flex gap-4">
            <img
              src="/coursera.png"
              alt="AI 1"
              className="h-16 w-46 object-contain border-2 border-blue-200 rounded-lg shadow"
            />
            <img
              src="/pepsi.png"
              alt="AI 2"
              className="h-16 w-46 object-contain border-2 border-blue-200 rounded-lg shadow"
            />
            <img
              src="/sitepoint.png"
              alt="AI 3"
              className="h-16 w-46 object-contain border-2 border-blue-200 rounded-lg shadow"
            />
            <img
              src="/wpp.png"
              alt="AI 4"
              className="h-16 w-46 object-contain border-2 border-blue-200 rounded-lg shadow"
            />
          </div>
          <div className="absolute -top-7 -left-5 w-15 h-16 bg-white z-30"></div>
          <div className="absolute bottom-full -left-0 w-20 h-15 bg-blue-200 rounded-full z-30"></div>

          <div className="absolute -bottom-0 -right-7 w-15 h-8 bg-white  z-30"></div>
          <div className="absolute bottom-0 left-full w-20 h-15 bg-[#D4D8FF] rounded-full z-30"></div>
        </div>
      </div>

      <div className="md:hidden flex flex-col m-4 rounded-3xl bg-gradient-to-b from-blue-100 to-purple-100 px-6 pt-8 pb-8">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-3xl font-bold text-left mt-4">
            AI Meet With Social Media{" "}
          </h1>
          <p className="text-left text-base text-gray-600 max-w-md">
            Push a button, post on all socials. Social media - using AI. It's
            like having ChatGPT, Canva and Hootsuite at your fingertips.
          </p>
          <div className="flex justify-start mt-4">
            <button className="bg-gray-800 text-white px-5 py-2 rounded-full cursor-pointer flex items-center hover:bg-gray-900 transition-colors">
              Discover More
              <BsFillArrowUpRightCircleFill className="ml-2" />
            </button>
            <button className="ml-3 bg-white border-2 border-gray-300 text-gray-800 px-5 py-2 rounded-full flex justify-center items-center cursor-pointer hover:bg-blue-300 transition-colors">
              <FaPlay className="h-5 w-5 text-gray-800" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-center items-center mt-6 w-full bg-white rounded-xl shadow">
          <img
            src="/home-banner.jpg"
            alt="AI Banner"
            className="h-60 w-full object-cover rounded-xl"
          />
        </div>
      </div>
      
      <div className="mt-4 md:hidden flex overflow-x-auto gap-4 p-4">
        <img
          src="/coursera.png"
          alt="AI 1"
          className="h-16 w-36 object-contain border-2 border-blue-200 rounded-lg shadow flex-shrink-0"
        />
        <img
          src="/pepsi.png"
          alt="AI 2"
          className="h-16 w-36 object-contain border-2 border-blue-200 rounded-lg shadow flex-shrink-0"
        />
        <img
          src="/sitepoint.png"
          alt="AI 3"
          className="h-16 w-36 object-contain border-2 border-blue-200 rounded-lg shadow flex-shrink-0"
        />
        <img
          src="/wpp.png"
          alt="AI 4"
          className="h-16 w-36 object-contain border-2 border-blue-200 rounded-lg shadow flex-shrink-0"
        />
      </div>
    </>
  );
}

