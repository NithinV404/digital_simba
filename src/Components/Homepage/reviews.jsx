import { useState } from "react";
import { BiSolidQuoteLeft} from "react-icons/bi";
import {FaStar, FaRegStar} from "react-icons/fa"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const reviews = [
  {
    name: "Sam Wister",
    role: "Social media manager",
    image: "https://digitalsimba.io/default/image/150x150",
    rating: 3,
    text: `Game-changer for our content strategy! The AI creates engaging posts and schedules them perfectly. Running multiple accounts is now effortless with DigitalSimbaAI.
It handles scheduling, content creation, and analytics in one place. A total lifesaver for our social media team!`
  },
  {
    name: "Charles Lucas",
    role: "Social media manager",
    image: "https://digitalsimba.io/default/image/150x150",
    rating: 4,
    text: `DigitalSimbaAI is the smartest tool in our marketing stack. It auto-generates posts that actually resonate with our audience. We've seen consistent follower growth every week!`
  },
  {
    name: "Winstar",
    role: "Manager",
    image: "https://digitalsimba.io/default/image/150x150",
    rating: 2,
    text: `Thanks to DigitalSimbaAI, we save hours every week on content planning.
The AI understands our brand voice and audience perfectly.
Our engagement and reach have never been better!`
  },
  {
    name: "Mac foster",
    role: "CEO",
    image: "https://digitalsimba.io/default/image/150x150",
    rating: 5,
    text: `DigitalSimbaAI is a game-changer for busy marketers.
From captions to hashtags, it handles everything with precision.
Our feed looks professional and performs great!`
  },
  {
    name: "Sam Wister",
    role: "Social media manager",
    image: "https://digitalsimba.io/default/image/150x150",
    rating: 1,
    text: `With DigitalSimbaAI, social media management is no longer a hassle. Creative suggestions, smart automation, and powerful insights— this tool truly does it all!`
  }
];

export default function ReviewsSection() {
  const [active, setActive] = useState(0);

  const handlePrev = () => setActive((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  const handleNext = () => setActive((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  const goTo = (idx) => setActive(idx);

  return (
    <section className="reviews pb-28 bg-white relative pt-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="max-w-xl">
            <div className="text-center mb-16">
              <div className="text-purple-500 font-semibold mb-2">Reviews</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What our <span className="text-purple-500">Clients</span> say.
              </h2>
              <p className="text-gray-600">
                "DigitalSimbaAI completely transformed our social media presence.
                It creates content, schedules posts, and tracks performance effortlessly.
                It’s like having a full-time strategist on autopilot!".
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://digitalsimba.io/assets/images/default/template_shape.png"
            alt="shape"
            className="absolute -top-8 -left-8 w-20 opacity-30 pointer-events-none"
          />
          <img
            src="https://digitalsimba.io/assets/images/default/template_shape.png"
            alt="shape"
            className="absolute -bottom-8 -right-8 w-20 opacity-30 pointer-events-none"
          />

          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handlePrev}
              className="bg-white border border-gray-200 rounded-full p-3 shadow hover:bg-purple-100 transition"
              aria-label="Previous review"
            >
              <FaChevronLeft className="text-xl text-purple-500" />
            </button>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handleNext}
              className="bg-white border border-gray-200 rounded-full p-3 shadow hover:bg-purple-100 transition"
              aria-label="Next review"
            >
              <FaChevronRight className="text-xl text-purple-500" />
            </button>
          </div>

          <div className="relative h-[420px] flex items-center justify-center ">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className={`
                  absolute left-0 right-0 mx-auto transition-all duration-500
                  ${active === idx ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"}
                  bg-neutral-800 rounded-2xl shadow-lg p-8 md:p-12 max-w-3xl
                `}
                style={{ minHeight: 350 }}
                aria-hidden={active !== idx}
              >
                <div className="absolute left-6 top-6 text-purple-200 text-5xl opacity-60">
                  <BiSolidQuoteLeft />
                </div>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-purple-100"
                    />
                  </div>
                  <div>
                    <ul className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) =>
                        i < review.rating ? (
                          <li key={i} className="text-yellow-400 text-xl">
                            <FaStar />
                          </li>
                        ) : (
                          <li key={i} className="text-gray-300 text-xl">
                            <FaRegStar />
                          </li>
                        )
                      )}
                    </ul>
                    <p className="text-gray-200 mb-4">{review.text}</p>
                    <div>
                      <h6 className="font-semibold text-lg text-white">{review.name}</h6>
                      <span className="text-gray-200 text-sm">{review.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots/Pagination */}
          <div className="flex justify-center mt-8 gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  active === idx ? "bg-purple-500" : "bg-gray-300"
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}