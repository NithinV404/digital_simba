import { useState } from "react";
import { FiChevronDown } from "react-icons/fi"; // Using a chevron is more standard and clean

const features = [
  {
    title: "Social Media Calendar",
    content: (
      <>
        Plan, schedule, and auto-publish posts across platforms.
        <br />
        Get AI suggestions, collaborate with your team, and track performance.
      </>
    ),
  },
  {
    title: "Bulk Scheduling",
    content: "Upload and schedule multiple posts at once to save time and streamline your workflow.",
  },
  {
    title: "AI Assistant",
    content: "Generate content ideas, captions, and hashtags instantly to boost your social media engagement.",
  },
  {
    title: "Engagement",
    content: "Track likes, comments, and shares to measure and improve your audience interaction.",
  },
];

export default function FeatureSection() {
  // Start with the first item open by default
  const [open, setOpen] = useState(0);

  const toggleAccordion = (index) => {
    // If the clicked item is already open, close it. Otherwise, open the new one.
    setOpen(open === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:justify-start mb-16">
          <div className="md:w-2/3 lg:w-1/2">
            <div className="mb-10">
              <div className="text-blue-600 font-semibold mb-4 text-lg">Key Features</div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-left leading-tight">
                Transforming Social With <span className="text-purple-600">Wealth Management</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* Accordion */}
          <div className="w-full lg:w-5/12">
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl transition-all duration-300">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className={`w-full flex justify-between items-center p-6 text-left text-lg font-semibold focus:outline-none ${
                      open === idx ? "text-blue-600 bg-gray-50 rounded-t-xl" : "text-gray-800"
                    }`}
                  >
                    <span>{feature.title}</span>
                    <FiChevronDown
                      className={`ml-2 h-5 w-5 transition-transform duration-300 ${
                        open === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      open === idx ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-6 text-gray-700 text-base">
                      {feature.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-7/12 flex justify-center items-start">
            <img
              src="https://digitalsimba.io/assets/images/global/frontend/682583e345b551747289059.png"
              alt="Feature"
              className="rounded-3xl w-full max-w-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}