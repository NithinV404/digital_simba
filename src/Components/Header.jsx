import { MdKeyboardArrowDown } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import {
  FaYoutube,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [hoverImg, setHoverImg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const integrations = [
    {
      name: "YouTube",
      icon: <FaYoutube className=" text-red-600 w-6 h-6 mx-2 mt-2" />,
      link: "/integration/Youtube",
      desc: "Video Content is king lets schedule Using Digital Simba",
      img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="text-blue-700 w-6 h-6 mx-2 mt-2" />,
      link: "/integration/linkedin",
      desc: "Excited to introduce our latest innovation! Discover the future of LinkedIn",
      img: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    },
    {
      name: "Twitter",
      icon: <FaTwitter className="text-blue-400 w-6 h-6 mx-2 mt-2" />,
      link: "/integration/twitter",
      desc: "Excited to introduce our latest innovation! Discover the future of X",
      img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-pink-600 w-6 h-6 mx-2 mt-2" />,
      link: "/integration/Instagram",
      desc: "Excited to introduce our latest innovation! Discover the future of Instagram",
      img: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="text-blue-600 w-6 h-6 mx-2 mt-2" />,
      link: "/integration/facebook",
      desc: "Excited to introduce our latest innovation! Discover the future of Facebook",
      img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    },
  ];

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          </div>
          <nav className="hidden md:flex ml-8 flex-1 justify-center">
            <div className="flex items-center space-x-8">
              {["Home", "Contacts", "Blogs", "Plans"].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="relative group">
                <button className="text-gray-700 flex items-center hover:text-blue-600 font-medium transition-colors">
                  Integration
                  <MdKeyboardArrowDown className="ml-1 w-5 h-5 transition-transform group-hover:rotate-180 duration-300" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-4 flex">
                    <div className="flex-1 flex flex-col space-y-2">
                      {integrations.map((item, idx) => (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoverImg(item.img)}
                          className="hover:bg-purple-200 p-3 rounded-md transition-colors cursor-pointer flex items-start"
                        >
                          {item.icon}
                          <div className="flex-1">
                            <a
                              href={item.link}
                              className="font-semibold block mb-1"
                            >
                              {item.name}
                            </a>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className=" w-[200px] p-4 flex items-center justify-center">
                      {hoverImg && (
                        <img
                          src={hoverImg}
                          alt="Integration Logo"
                          className="h-[260px] object-contain rounded-lg border border-gray-200 shadow"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-600 border-2 rounded-full hover:text-gray-800 transition-colors">
              USD
            </button>
            <button className="hidden md:block bg-gray-800 rounded-full hover:bg-gray-900 text-white px-4 py-2 font-medium transition-colors">
              Login
            </button>
            <button
              className="md:hidden bg-gray-700 p-3 rounded-full"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              <FaBars className="w-6 h-6 text-white z-10" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-16 right-0 w-full bg-white shadow-lg z-50 border-t border-gray-200">
          <nav className="flex flex-col p-4 space-y-4">
            {["Home", "Contacts", "Blogs", "Plans"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                {item}
              </a>
            ))}
            <div>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium w-full"
              >
                Integration
                <MdKeyboardArrowDown
                  className={`ml-2 transition-transform ${
                    mobileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {mobileDropdownOpen && (
                <div className="mt-2 w-full flex flex-col space-y-4 bg-gray-50 rounded-md p-2 shadow">
                  {integrations.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <div className="pt-1">{item.icon}</div>
                      <div>
                        <a
                          href={item.link}
                          className="font-semibold hover:underline block"
                        >
                          {item.name}
                        </a>
                        <p className="text-xs text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2 mt-6">
              <a
                href="/get-started"
                className="bg-blue-500 text-white rounded-full px-4 py-2 font-medium text-center hover:bg-blue-700"
              >
                Get Started
              </a>
              <a
                href="/login"
                className="bg-purple-500 text-white rounded-full px-4 py-2 font-medium text-center hover:bg-blue-100"
              >
                Login
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
