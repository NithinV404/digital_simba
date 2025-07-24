import { FaCheckCircle } from "react-icons/fa";

export default function PowerfulFeature() {
  const features = [
    {
      title: "AI-Driven Content Creation",
      description:
        "Create engaging posts, captions, and strategies tailored to your audience. Save time and focus on growing your brand while AI does the heavy lifting.",
    },
    {
      title: "Unified Platform Management",
      description:
        "Manage all your social accounts, including Facebook, Instagram, LinkedIn, and Twitter/X, from a single intuitive dashboard.",
    },
    {
      title: "Smart Scheduling & Automation",
      description:
        "Optimize post timings with AI-powered recommendations and automate publishing to reach your audience at the right time.",
    },
    {
      title: "Optimization Engine Rank",
      description:
        "Discover our powerful features designed to elevate your experience. From cutting-edge technology to user-friendly interfaces, our features are crafted to provide maximum efficiency and unparalleled performance. Experience the difference today.",
    },
  ];
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <img
              src="/powerful-feature.jpg"
              alt="Powerful Feature"
              className="w-full h-[600px] object-cover rounded-4xl shadow-lg"
            />
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="mb-8">
              <h3 className="font-medium text-lg uppercase tracking-wider mb-2 relative inline-block">
                <span className="absolute left-0 right-0 bottom-1/2 translate-y-1/2 mx-auto w-full h-0.5 bg-yellow-600"></span>
                <p className="relative z-10 px-2 bg-gradient-to-b from-white to-gray-50 text-orange-500">Powerful features</p>
              </h3>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                The best features for you
              </h1>
              <p className="text-gray-600 text-lg">
                Enhance your experience and enjoy seamless automation, intelligent
                insights, and effortless management. Discover the difference with
                DigitalSimbaAI
              </p>
            </div>

            <div className="flex flex-col space-y-6 w-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 hover:border-purple-200 flex items-start group cursor-pointer transform hover:translate-x-2 transition-all duration-300 w-full"
                >
                  <div className="flex-shrink-0 mr-4 transition-transform duration-300">
                    <FaCheckCircle className="h-15 w-8 text-purple-600 transition-all duration-300 group-hover:text-blue-600 group-hover:scale-125" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800  group-hover:text-blue-800 transition-colors duration-300">
                      {feature.title}
                    </h2>
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
