import { BsArrowUpRightCircleFill } from "react-icons/bs";

export default function Blog() {
    const blogCards = [
    {
      title: "AI content",
      date: "May 14, 2025",
      image: "/blog-1.png",
    },
    {
      title: "Social posting",
      date: "May 14, 2025",
      image: "/blog-2.png",
    },
    {
      title: "Post management",
      date: "May 14, 2025",
      image: "/blog-3.png",
    },
  ];
  return (
    <>
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="mb-10 relative flex items-center">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-500">Blogs</h3>
          <h2 className="text-3xl md:text-4xl font-bold">
            News & <span className="text-purple-600">Blogs</span>
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            Track the engagement rate, comments, likes, shares, and impressions for each post, so you know what's working best for your audience. Once you've identified your high-performing posts, you can share them again.
          </p>
        </div>
        <div className="flex justify-center md:justify-end w-full md:w-auto mt-8 md:mt-0">
          <button className="inline-flex items-center gap-2 px-6 py-3 cursor-pointer bg-gray-800 text-white font-semibold rounded-full shadow hover:bg-gray-900 transition">
            View All
            <BsArrowUpRightCircleFill className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Blog Card */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        {/* Image */}
        <div className="w-full md:w-[60%] rounded-xl overflow-hidden shadow-md">
          <img
            src="/blog.png"
            alt="blog"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 px-8 text-left relative flex flex-col justify-center">
          <h3 className="text-xl md:text-2xl font-semibold mb-1">
            Social media tool trend 2025
          </h3>
          <p className="text-gray-500 text-md mt-2 mb-4">Social Media Trends for 2024...</p>
          <button className="inline-flex items-center gap-2 px-6 py-3 cursor-pointer bg-purple-600 text-white font-semibold rounded-full shadow hover:bg-purple-900 transition w-fit">
            More Info <BsArrowUpRightCircleFill className="w-5 h-5" />
          </button>
        </div>
      </div>

   <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
      {blogCards.map((card, idx) => (
        <div
          key={idx}
          className="relative rounded-[24px] overflow-hidden shadow-md group"
        >
          {/* Background Image */}
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Date at top right */}
          <div className="absolute top-3 right-4 text-white text-sm font-medium">
            {card.date}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="relative w-full h-16">
              <div className="absolute bottom-0 left-2 rounded-full bg-gradient-to-t from-black/95 to-black/95 px-4 py-2">
                <h3 className="text-white text-lg font-semibold mb-0">{card.title}</h3>
              </div>
              <button className="absolute bottom-0 right-2 px-5 py-2 bg-white text-gray-800 cursor-pointer font-bold rounded-full shadow hover:bg-gray-200 transition text-center flex items-center gap-2">
                More Info <BsArrowUpRightCircleFill />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    </section>

    </>
  )
}
