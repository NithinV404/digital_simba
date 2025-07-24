import { FaFacebookF } from "react-icons/fa";

export default function FeatureCard() {
  return (
    <div className="flex flex-col items-center text-center px-4 py-10 bg-white">
      <p className="text-sm font-medium text-orange-500 mb-2">Templates</p>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
        AI powered social media{" "}
        <span className="text-purple-600">template</span>
      </h1>

      <div className="relative mt-10 bg-gray-100 rounded-4xl p-8 max-w-xl w-100 shadow-md min-h-[220px] flex flex-col justify-center border-b-2 border-b-transparent hover:border-b-4 hover:border-b-purple-600 transition-all duration-300">
        <div className="absolute top-0 right-0 flex items-center justify-center">
          <div className="bg-white rounded-full p-2 shadow-md flex items-center justify-center">
            <div className="bg-purple-600 rounded-full p-4 shadow-lg flex items-center justify-center">
              <FaFacebookF className="text-white w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <div className="inline-block px-3 py-1 text-sm text-purple-600 bg-white rounded-full mb-3 -mt-4">
            Facebook
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Viral Tweet Idea
          </h2>
          <p className="text-gray-600 mt-1 text-base">
            Get creative ideas for tweets that can go viral.
          </p>
        </div>
      </div>
    </div>
  );
}
