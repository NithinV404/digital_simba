import { BsHeart } from "react-icons/bs";

export default function AboutSection() {
  const cards = [
    {
      title: "Who We Are",
      text: "Digital Simba is an AI-powered social media management platform helping brands grow online. We simplify scheduling, content creation, and analytics in one intuitive dashboard.",
      heartClass: "top-0 left-0",
      padClass: "pt-8 pl-12",
    },
    {
      title: "What We Do",
      text: "From bulk scheduling to AI-generated content and performance insights, we provide end-to-end tools to manage, optimize, and scale your social media presence.",
      heartClass: "top-0 right-0",
      padClass: "pt-8 pr-12",
    },
    {
      title: "Our Values",
      text: "We value creativity, innovation, transparency, and customer-first thinking. Our goal is to make social media effortless and impactful for every brand.",
      heartClass: "bottom-0 left-0",
      padClass: "pb-8 pl-12",
    },
    {
      title: "Why Choose Us",
      text: "With powerful integrations, smart automation, and a user-friendly design, Digital Simba is the go-to solution for modern brands that want to stay ahead in the digital space.",
      heartClass: "bottom-0 right-0",
      padClass: "pb-8 pr-12",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-0">
        <div className="flex flex-col lg:flex-row gap-16 items-stretch">
          {/* Left Side */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center">
            <div className="mb-12">
              <div className="text-black font-semibold mb-2">About us</div>
              <h2 className="text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-gray-600">AI meets Social Media</p>
            </div>
            <div className="bg-[#24282c] rounded-2xl p-10 text-center mb-8 flex flex-col items-center justify-center">
              <div className="flex flex-col sm:flex-row items-center justify-evenly w-full">
                <div>
                  <div className="text-4xl font-extrabold text-gray-200">100,000+</div>
                  <div className="text-lg font-semibold text-gray-300 mt-1">Businesses</div>
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-gray-200">190+</div>
                  <div className="text-lg font-semibold text-gray-300 mt-1">Countries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-7/12 flex flex-col justify-center">
            <div className="relative rounded-3xl p-8 h-full">
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-8 w-full place-items-center">
                {/* Center SVG - z-0 (behind cards) */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                  <div className="bg-white rounded-4xl shadow-lg p-12 bg-gradient-to-r from-blue-400 to-purple-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 512 512"
                      className="text-white opacity-80"
                      fill="currentColor"
                    >
                      <g>
                        <path d="m476.855 307.148-29.937-29.933-42.426 42.426 29.938 29.933c23.39 23.395 23.39 61.465 0 84.856-23.39 23.39-61.461 23.39-84.856 0L192.36 277.215l-42.425 42.426 157.214 157.214c46.86 46.86 122.848 46.86 169.707 0s46.86-122.847 0-169.707zm0 0" />
                        <path d="M162.426 434.43c-23.395 23.39-61.465 23.39-84.856 0-23.39-23.39-23.39-61.461 0-84.856L234.785 192.36l-42.426-42.425L35.145 307.148c-46.86 46.86-46.86 122.848 0 169.707s122.847 46.86 169.707 0l29.933-29.937-42.426-42.426zM349.574 77.57c23.395-23.39 61.465-23.39 84.856 0 23.39 23.39 23.39 61.461 0 84.856L277.215 319.64l42.426 42.425 157.214-157.214c46.86-46.86 46.86-122.848 0-169.707s-122.847-46.86-169.707 0l-29.933 29.937 42.426 42.426zm0 0" />
                        <path d="m65.082 234.785 42.426-42.426-29.938-29.933c-23.39-23.395-23.39-61.465 0-84.856 23.39-23.39 61.461-23.39 84.856 0l163.426 163.426 42.425-42.426L204.852 35.145c-46.86-46.86-122.848-46.86-169.707 0s-46.86 122.847 0 169.707zm0 0" />
                      </g>
                    </svg>
                  </div>
                </div>
                {cards.map((card, idx) => (
                  <div
                    key={idx}
                    className={`relative bg-gray-100 flex flex-col items-start rounded-2xl p-8 shadow z-10 w-full ${card.padClass}`}
                  >
                    <div className={`absolute rounded-full bg-violet-500 shadow p-2 ${card.heartClass}`}>
                      <BsHeart className="text-white h-8 w-8 p-1" />
                    </div>
                    <h4 className="font-semibold text-2xl mb-2">{card.title}</h4>
                    <p className="text-gray-600 text-sm">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}