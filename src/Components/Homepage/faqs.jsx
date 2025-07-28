import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

const faqs = [
  {
    question: "What is DigitalSimba.io?",
    answer:
      "DigitalSimba.io is an AI-powered social media management platform that helps brands grow online by simplifying content creation, scheduling, and analytics in one intuitive dashboard.",
  },
  {
    question: "How does the AI Assistant enhance content creation?",
    answer:
      "The AI Assistant in DigitalSimba.io generates content ideas, captions, and hashtags instantly, helping to boost social media engagement and streamline the content creation process.",
  },
  {
    question: "Which social media platforms does DigitalSimba.io support?",
    answer:
      "DigitalSimba.io supports major social media platforms, including Facebook, Instagram, LinkedIn, and Twitter/X, allowing users to manage all their accounts from a single dashboard.",
  },
  {
    question: "Can I schedule multiple posts at once?",
    answer:
      "Yes, DigitalSimba.io offers a bulk scheduling feature that allows users to upload and schedule multiple posts simultaneously, saving time and streamlining workflow.",
  },
];

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="py-20 px-4 sm:px-8 max-w-7xl mx-auto bg-gradient-to-b from-blue-50 via-white to-purple-50 rounded-3xl shadow-lg">
      {/* Heading */}
      <div className="text-center mb-12">
        <h3 className="text-base font-bold text-yellow-500 tracking-widest uppercase mb-2">FAQs</h3>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Frequently asked <span className="text-purple-600">questions</span>
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base">
          Before you get started, here are the questions we get asked the most.
        </p>
      </div>

      {/* FAQ Cards - each in its own container, vertically spaced and centered */}
      <div className="flex flex-col items-center w-full space-y-6">
        {faqs.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className={`w-full max-w-2xl border border-gray-200 rounded-2xl p-5 transition-all duration-300 ease-in-out bg-white shadow-sm hover:shadow-lg focus-within:shadow-lg group ${
                isOpen ? "ring-2 ring-purple-400 shadow-md" : ""
              }`}
            >
              <button
                onClick={() => toggle(index)}
                className="flex items-start justify-between w-full text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <div className={`transition-colors duration-200 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md group-hover:bg-yellow-600 ${isOpen ? "bg-purple-500" : ""}`}>
                      {isOpen ? (
                        <FaMinus className="w-3.5 h-3.5" />
                      ) : (
                        <FaPlus className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                    {item.question}
                  </h3>
                </div>
              </button>

              {isOpen && (
                <p className="mt-4 text-base text-gray-700 leading-relaxed pl-10 pr-2 border-l-4 border-purple-200 bg-purple-50 rounded-md">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
