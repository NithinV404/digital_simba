import { MdKeyboardArrowDown } from "react-icons/md";
import {
  FaYoutube,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [url, seturl] = useState("");
  const stockImages = {
    Youtube:
      "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    linkedin:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    twitter:
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
    Instagram:
      "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    facebook:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  };
  return (
    <>
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 ">
            <div className="flex items-center">
              <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
            </div>
            <nav className="flex ml-8 ">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-8">
                  <a
                    href="/"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="/contacts"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Contacts
                  </a>
                  <a
                    href="/blogs"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Blogs
                  </a>
                  <a
                    href="/plans"
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Plans
                  </a>
                  <div className="relative group">
                    <a
                      href="/integration"
                      className="text-gray-700 flex items-center hover:text-blue-600 font-medium transition-colors cursor-pointer"
                    >
                      Integration{" "}
                      <MdKeyboardArrowDown className="group-hover:rotate-180 transition-transform mt-1 w-5 h-5 font-medium duration-500" />
                    </a>
                    <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-4 flex flex-row w-full">
                        <div className="flex-1 flex flex-col space-y-2">
                          <div
                            onMouseEnter={() => seturl(stockImages.Youtube)}
                            className="hover:bg-gray-50 p-3 rounded-md transition-colors cursor-pointer w-full flex items-start"
                          >
                            <FaYoutube className="text-red-600 w-6 h-6 mr-2 mt-1" />
                            <div className="flex-1">
                              <a
                                href="/integration/Youtube"
                                className="text-red-600 font-semibold block mb-1"
                              >
                                YouTube
                              </a>
                              <p className="text-sm text-gray-600 w-full">
                                Video Content is king lets schedule Using
                                Digital Simba
                              </p>
                            </div>
                          </div>
                          <div
                            onMouseEnter={() => seturl(stockImages.linkedin)}
                            className="hover:bg-gray-50 p-3 rounded-md transition-colors cursor-pointer w-full flex items-start"
                          >
                            <FaLinkedin className="text-blue-700 w-6 h-6 mr-2 mt-1" />
                            <div className="flex-1">
                              <a
                                href="/integration/linkedin"
                                className="text-blue-700 font-semibold block mb-1"
                              >
                                LinkedIn
                              </a>
                              <p className="text-sm text-gray-600 w-full">
                                Excited to introduce our latest innovation!
                                Discover the future of LinkedIn
                              </p>
                            </div>
                          </div>
                          <div
                            onMouseEnter={() => seturl(stockImages.twitter)}
                            className="hover:bg-gray-50 p-3 rounded-md transition-colors cursor-pointer w-full flex items-start"
                          >
                            <FaTwitter className="text-blue-400 w-6 h-6 mr-2 mt-1" />
                            <div className="flex-1">
                              <a
                                href="/integration/twitter"
                                className="text-blue-400 font-semibold block mb-1"
                              >
                                Twitter
                              </a>
                              <p className="text-sm text-gray-600 w-full">
                                Excited to introduce our latest innovation!
                                Discover the future of X
                              </p>
                            </div>
                          </div>
                          <div
                            onMouseEnter={() => seturl(stockImages.Instagram)}
                            className="hover:bg-gray-50 p-3 rounded-md transition-colors cursor-pointer w-full flex items-start"
                          >
                            <FaInstagram className="text-pink-600 w-6 h-6 mr-2 mt-1" />
                            <div className="flex-1">
                              <a
                                href="/integration/Instagram"
                                className="text-pink-600 font-semibold block mb-1"
                              >
                                Instagram
                              </a>
                              <p className="text-sm text-gray-600 w-full">
                                Excited to introduce our latest innovation!
                                Discover the future of Instagram
                              </p>
                            </div>
                          </div>
                          <div
                            onMouseEnter={() => seturl(stockImages.facebook)}
                            className="hover:bg-gray-50 p-3 rounded-md transition-colors cursor-pointer w-full flex items-start"
                          >
                            <FaFacebook className="text-blue-600 w-6 h-6 mr-2 mt-1" />
                            <div className="flex-1">
                              <a
                                href="/integration/facebook"
                                className="text-blue-600 font-semibold block mb-1"
                              >
                                Facebook
                              </a>
                              <p className="text-sm text-gray-600 w-full">
                                Excited to introduce our latest innovation!
                                Discover the future of Facebook
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-[160px]">
                          {url && (
                            <img
                              src={url}
                              alt="Integration Logo"
                              className="h-[260px] w-full object-contain rounded-lg border border-gray-200 shadow"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 border-2 rounded-full hover:text-gray-800 transition-colors"></button>
              <button className="px-4 py-2 text-gray-600 border-2 rounded-full hover:text-gray-800 transition-colors">
                USD
              </button>
              <button className="bg-blue-600 rounded-full hover:bg-blue-700 text-white px-4 py-2 cursor-pointer font-medium transition-colors">
                Login
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
