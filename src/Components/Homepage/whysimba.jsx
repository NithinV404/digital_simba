import { HiSparkles } from "react-icons/hi2";

const features = [
  {
    title: "AI Content Generation",
    description:
      "Generate captions and images based on prompts, summarize complex content, and turn your product descriptions into highly converting posts.",
  },
  {
    title: "AI Content Generation",
    description:
      "Generate captions and images based on prompts, summarize complex content, and turn your product descriptions into highly converting posts.",
  },
  {
    title: "AI Content Generation",
    description:
      "Generate captions and images based on prompts, summarize complex content, and turn your product descriptions into highly converting posts.",
  },
  {
    title: "AI Content Generation",
    description:
      "Generate captions and images based on prompts, summarize complex content, and turn your product descriptions into highly converting posts.",
  },
  {
    title: "AI Content Generation",
    description:
      "Generate captions and images based on prompts, summarize complex content, and turn your product descriptions into highly converting posts.",
  },
  {
    title: "AI Content Generation",
    description:
      "Generate captions and images based on prompts, summarize complex content, and turn your product descriptions into highly converting posts.",
  },
];

export default function WhySimba() {
  return (
    <>
    <div className="py-12 px-6 max-w-7xl mx-auto">
      <p className="text-center text-sm text-gray-500">
        Why <span className="text-orange-500 font-semibold">DigitalSimba</span>
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Watch Your Accounts Grow
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const isFilled = index % 2 === 1;
          return (
            <div
              key={index}
              className={`rounded-xl p-6 shadow-sm transition-all duration-300 flex flex-col items-center hover:shadow-lg hover:-translate-y-1 ${
                isFilled
                  ? "bg-purple-500 text-white"
                  : "border border-purple-400 bg-white text-gray-900"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-md flex items-center justify-center mb-4 mx-auto ${
                  isFilled
                    ? "bg-white text-purple-600"
                    : "bg-purple-100 text-purple-500"
                }`}
              >
                <HiSparkles className="w-8 h-8" />
              </div>

              <h3
                className={`text-lg font-semibold text-center ${
                  isFilled ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>

              <p
                className={`mt-2 text-sm text-center ${
                  isFilled ? "text-white/90" : "text-gray-600"
                }`}
              >
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>

    </>
  )
}
