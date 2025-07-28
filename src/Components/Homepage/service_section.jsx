import { useState, useRef, useEffect } from "react";
import { BiLaptop } from "react-icons/bi";
import { GoArrowUpRight } from "react-icons/go";

// Horizontal scroll hook
const useHorizontalScroll = () => {
  const elRef = useRef();
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDownHandler = (e) => {
      isDown = true;
      el.classList.add("active");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const mouseLeaveHandler = () => {
      isDown = false;
      el.classList.remove("active");
    };

    const mouseUpHandler = () => {
      isDown = false;
      el.classList.remove("active");
    };

    const mouseMoveHandler = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1; //scroll-fast
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", mouseDownHandler);
    el.addEventListener("mouseleave", mouseLeaveHandler);
    el.addEventListener("mouseup", mouseUpHandler);
    el.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      el.removeEventListener("mousedown", mouseDownHandler);
      el.removeEventListener("mouseleave", mouseLeaveHandler);
      el.removeEventListener("mouseup", mouseUpHandler);
      el.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  return elRef;
};

const serviceItemsOne = [
  {
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68301fe4d317b1747984356.png",
    title: "Social Media Monitor",
    description: "Social Media Monitor",
    link: "#",
  },
  {
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68301f733d30a1747984243.png",
    title: "Analytical Reports",
    description: "Analytical Reports",
    link: "#",
  },
  {
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68301f82e72d41747984258.png",
    title: "Template Management",
    description: "Template Management",
    link: "#",
  },
  {
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68301f956245e1747984277.png",
    title: "Feed Analytic",
    description: "Feed Analytic",
    link: "#",
  },
  {
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68301fc73b73c1747984327.png",
    title: "AI Content Create",
    description: "AI Content Create",
    link: "#",
  },
  {
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68301faaf3a8d1747984298.png",
    title: "Manage profile",
    description: "Manage profile",
    link: "#",
  },
];

const serviceItemsTwo = [
  {
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68301fb9551cf1747984313.png",
    title: "Manage Post",
    description: "Manage Post",
    link: "#",
  },
  {
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68301fe4d317b1747984356.png",
    title: "Social Media Monitor",
    description: "Social Media Monitor",
    link: "#",
  },
];

const tabItems = [
  {
    label: "Manage Accounts",
    title: "Manage All Social Accounts in One Place",
    description:
      "Easily manage and monitor all your social media accounts in one place.",
    image:
      "https://digitalsimba.io/assets/images/global/frontend/6825850351d281747289347.png",
  },
  {
    label: "AI Content",
    title: "Generate Content with Powerful AI",
    description:
      "Take advantage of the in-app integrations with platforms like Canva, Unsplash, and GIPHY. Boost your creative abilities.",
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68258528675741747289384.png",
  },
  {
    label: "Create post",
    title: "Design Visually Appealing Content",
    description:
      "Take advantage of the in-app integrations with platforms like Canva, Unsplash, and GIPHY.",
    image:
      "https://digitalsimba.io/assets/images/global/frontend/6825854d9e5dd1747289421.png",
  },
  {
    label: "Content",
    title: "Schedule and Publish Your Content",
    description:
      "Boost your creative abilities and get access to a wide variety of design elements for your social media.",
    image:
      "https://digitalsimba.io/assets/images/global/frontend/682585687ad821747289448.png",
  },
  {
    label: "Insight",
    title: "Gain Actionable Insights from Analytics",
    description:
      "Get detailed analytics on post performance and audience behavior to optimize your strategy.",
    image:
      "https://digitalsimba.io/assets/images/global/frontend/68258584297761747289476.png",
  },
];

const ServiceSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollContainerRef = useHorizontalScroll();
  const scrollContainerRef2 = useHorizontalScroll();

  return (
    <>
      <style>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar.active { cursor: grabbing; cursor: -webkit-grabbing; }
      `}</style>

      <section className="py-20 md:py-[110px] relative overflow-x-clip bg-white text-gray-800">
        <div className="container mx-auto px-4 relative">
          <div className="hidden lg:block absolute left-0 top-0 h-full w-20 z-0">
            <div className="absolute left-14 top-0 h-full w-0.5 bg-purple-500 transform -translate-x-1/2" />
          </div>
          <div className="flex items-start relative z-10 mb-24">
            <div className="hidden lg:flex flex-col items-center w-20 relative z-10">
              <div className="flex items-center justify-center text-4xl rounded-full border-1 border-purple-500 p-4 h-20 w-20 text-purple-500 bg-white shadow-lg z-10">
                <BiLaptop />
              </div>
            </div>
            <div className="w-full pl-8">
              <div className="text-left mb-[60px]">
                <div className="text-xl font-semibold mb-2 text-purple-500">
                  Service
                </div>
                <h2 className="text-4xl md:text-4xl font-bold leading-tight mb-4">
                  Empowering social media{" "}
                  <span className="text-purple-500">insights</span>
                </h2>
                <p className="text-lg">
                  Discover the power of our secure and rewarding credit cards.
                </p>
              </div>
              <div className="text-left mb-[60px]">
                <h2 className="text-4xl md:text-4xl font-bold leading-tight mb-4">
                  Unlock the power of social media{" "}
                  <span className="text-purple-500">insights</span> to drive
                  your strategy forward.
                </h2>
                <p className="text-lg">
                  Discover the power of our secure and rewarding credit cards.
                </p>
              </div>
              <div
                ref={scrollContainerRef}
                className="
                  overflow-x-auto
                  hide-scrollbar
                  cursor-grab
                  w-full
                  sm:w-[380px]
                  md:w-[762px]
                  lg:w-[1060px]
                  max-w-full
                  p-10
                "
              >
                <div className="flex space-x-6 min-w-max">
                  {serviceItemsOne.map((item, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-80 p-6 rounded-4xl text-left service-item bg-gray-100 select-none flex flex-col justify-between gap-8 relative h-[300px]"
                    >
                      <div>
                        <div className="mb-4 flex justify-start pointer-events-none">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-h-22 w-auto object-contain"
                          />
                        </div>
                        <h4 className="text-2xl font-semibold mb-2 pointer-events-none">
                          {item.title}
                        </h4>
                        <p className="mb-6 text-gray-700 pointer-events-none">
                          {item.description}
                        </p>
                      </div>
                      <a
                        href={item.link}
                        className="inline-flex absolute border border-gray-200 -left-3 -bottom-5 items-center justify-center py-3 px-6 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-300 bg-white text-purple-500 mt-auto"
                      >
                        More Info{" "}
                        <span className="ml-2">
                          <GoArrowUpRight className="ml-4 -mr-2 text-2xl font-bold p-0.5 rounded-full bg-gray-100" />
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Second Section - Now Scrollable */}
          <div className="flex items-start relative z-10 mb-24">
            <div className="hidden lg:flex flex-col items-center w-20 relative z-10">
              <div className="flex items-center justify-center text-4xl rounded-full border-2 border-purple-500 p-4 h-20 w-20 text-purple-500 bg-white shadow-lg z-10">
                <BiLaptop />
              </div>
            </div>
            <div className="w-full pl-8">
              <div className="flex flex-col items-start">
                <div className="w-full lg:w-10/12 text-left mb-[60px]">
                  <h2 className="text-4xl md:text-4xl font-bold leading-tight mb-4">
                    Discover the game-changing impact of social media{" "}
                    <span className="text-purple-500">insights</span>
                  </h2>
                  <p className="text-lg">
                    Discover the power of our secure and rewarding credit cards.
                  </p>
                </div>
              </div>
              <div
                ref={scrollContainerRef2}
                className="
                  overflow-x-auto
                  hide-scrollbar
                  cursor-grab
                  w-full
                  sm:w-[380px]
                  md:w-[762px]
                  lg:w-[1060px]
                  max-w-full
                  p-10
                "
              >
                <div className="flex space-x-6 min-w-max">
                  {serviceItemsTwo.map((item, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-80 p-6 rounded-4xl text-center service-item bg-gray-100 flex flex-col justify-between relative h-[300px]"
                    >
                      <div>
                        <div className="mb-4 flex justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-h-24 w-auto object-contain"
                          />
                        </div>
                        <h4 className="text-2xl font-semibold mb-2">
                          {item.title}
                        </h4>
                        <p className="mb-6 text-gray-700">{item.description}</p>
                      </div>
                      <a
                        href={item.link}
                        className="absolute border border-gray-200 -left-3 -bottom-5 inline-flex items-center justify-center py-3 px-6 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300 bg-white text-purple-500 mt-auto"
                      >
                        More Info{" "}
                        <span className="ml-2">
                          <GoArrowUpRight className="ml-4 -mr-2 text-2xl font-bold p-0.5 rounded-full bg-gray-100" />
                        </span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Third Section (Tabs) */}
          <div className="flex items-start relative z-10">
            <div className="hidden lg:flex flex-col items-center w-20 relative z-10">
              <div className="flex items-center justify-center text-4xl rounded-full border-2 border-purple-500 p-4 h-20 w-20 text-purple-500 bg-white shadow-lg z-10">
                <BiLaptop />
              </div>
            </div>
            <div className="w-full pl-8 pt-2">
              <div className="text-left mb-[60px]">
                <h2 className="text-4xl md:text-4xl font-bold leading-tight mb-4">
                  Empowering social media{" "}
                  <span className="text-purple-500">insights</span>
                </h2>
              </div>
              <div className="p-8 md:p-12 bg-gray-100 rounded-3xl shadow-md">
                <ul className="flex flex-wrap gap-2 lg:gap-4 mb-8">
                  {tabItems.map((tab, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setActiveTab(index)}
                        className={`relative inline-flex items-center justify-between w-full px-6 py-2 text-lg transition-all duration-300 rounded-full ${
                          activeTab === index
                            ? "bg-purple-500 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {tab.label}
                        <span
                          className={`ml-4 -mr-2 text-xl font-bold p-0.5 rounded-full ${
                            activeTab === index
                              ? "bg-white text-purple-500"
                              : "bg-gray-200 text-purple-500"
                          }`}
                        >
                          <GoArrowUpRight />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {tabItems.map((tab, index) => (
                  <div
                    key={index}
                    className={`transition-opacity duration-500 ease-in-out ${
                      activeTab === index
                        ? "opacity-100 block"
                        : "opacity-0 hidden"
                    }`}
                  >
                    <div className="mb-4">
                      <h5 className="text-2xl font-semibold mb-2">
                        {tab.title}
                      </h5>
                      <p className="text-gray-700">{tab.description}</p>
                    </div>
                    <img
                      src={tab.image}
                      alt={tab.title}
                      className="rounded-lg w-full h-auto object-cover max-h-[500px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceSection;