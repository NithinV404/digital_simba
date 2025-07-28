import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";

import {FaLongArrowAltRight} from "react-icons/fa"

const socialIcons = [
  { icon: <FaFacebookF />, color: "bg-[#facc15]" },
  { icon: <FaLinkedinIn />, color: "bg-[#facc15]" },
  { icon: <FaInstagram />, color: "bg-[#facc15]" },
  { icon: <FaTwitter />, color: "bg-[#facc15]" },
  { icon: <FaYoutube />, color: "bg-[#facc15]" },
  { icon: <FaTiktok />, color: "bg-[#facc15]" },
];

export default function Footer() {
  return (
    <footer className="bg-[#292c31] text-white pt-30 overflow-x-hidden">
      <div className="relative flex flex-col items-center px-4">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full sm:w-full md:w-4xl lg:w-4xl">
          <img
            src="https://digitalsimba.io/assets/images/global/frontend/682581b41ca3a1747288500.png"
            alt="682581b41ca3a1747288500.png"
            className="footer-top-img object-contain"
          />
        </div>
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-30"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 z-10">
          Improve your social media content
        </h2>
        <p className="text-gray-300 text-center max-w-xl mb-8 z-10">
          Enhance your social media presence with engaging, high-quality content that captures attention and drives results
        </p>
        {/* Responsive Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 z-10 w-full max-w-md mx-auto">
          <a
            href="https://calendly.com/mahendraai/docuvaai"
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 md:px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition w-full"
          >
            Book a demo <span className="text-lg"><FaLongArrowAltRight /></span>
          </a>
          <a
            href="https://digitalsimba.io/login"
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 md:px-8 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition w-full"
          >
            Get Started Free <span className="text-lg"><FaLongArrowAltRight /></span>
          </a>
        </div>
      </div>

      {/* Newsletter */}
     <div className="flex justify-end py-20">
  <form
    action="https://digitalsimba.io/subscribe"
    method="post"
    className="w-full max-w-lg flex flex-col sm:flex-row bg-white rounded-lg md:rounded-tl-full md:rounded-bl-full shadow-lg p-2 pr-2 mt-[-3rem] z-20 "
  >
    <input
      name="email"
      type="email"
      placeholder="Enter Your Email"
      className="flex-1 px-4 py-3 rounded-md sm:rounded-l-full sm:rounded-r-none text-gray-800 outline-none text-lg mb-2 sm:mb-0 "
      required
    />
    <button
      type="submit"
      className="bg-[#8b5cf6] space-x-2 hover:bg-[#7c3aed] text-white px-4 md:px-8 py-3 rounded-l-full sm:rounded-lg md:rounded-l-full font-semibold flex items-center justify-center gap-2 transition text-lg w-full sm:w-auto"
    >
      SUBSCRIBE <FaLongArrowAltRight/>
    </button>
  </form>
</div>

      {/* Links */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Quick Link */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Link</h4>
            <ul className="space-y-2">
              <li><a href="https://digitalsimba.io" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Home</a></li>
              <li><a href="https://digitalsimba.io/contact" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Contact</a></li>
              <li><a href="https://digitalsimba.io/blogs" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Blogs</a></li>
              <li><a href="https://digitalsimba.io/plans" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Plans</a></li>
            </ul>
          </div>
          {/* Information */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li><a href="https://digitalsimba.io/pages/terms-and-conditions" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Terms and conditions</a></li>
              <li><a href="https://digitalsimba.io/pages/cookies-policy" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Cookies policy</a></li>
              <li><a href="https://digitalsimba.io/pages/privacy-policy" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Privacy policy</a></li>
            </ul>
          </div>
          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="https://digitalsimba.io/services/social-media-monitor/3278dca6-bf6c-4695-b946-cde85332604e" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Social Media Monitor</a></li>
              <li><a href="https://digitalsimba.io/services/analytical-reports/73298247-1cbe-41ec-8f70-c0d86e17300d" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Analytical Reports</a></li>
              <li><a href="https://digitalsimba.io/services/template-management/51cef27a-ea2e-4716-9ac8-1aa5f719065c" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Template Management</a></li>
              <li><a href="https://digitalsimba.io/services/feed-analytic/9f151f03-5caf-4c41-8d47-a7c6ca57e48f" className="flex items-center gap-2 hover:underline"><span className="text-yellow-400">›</span> Feed Analytic</a></li>
            </ul>
          </div>
          {/* Blogs */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Blogs</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://digitalsimba.io/blogs/trend2025" className="flex items-center gap-2 hover:underline">
                  <span className="text-yellow-400">›</span> Social media tool trend 2025
                </a>
                <div className="text-xs text-gray-400 ml-5">May 14, 2025</div>
              </li>
              <li>
                <a href="https://digitalsimba.io/blogs/ai-content" className="flex items-center gap-2 hover:underline">
                  <span className="text-yellow-400">›</span> AI content
                </a>
                <div className="text-xs text-gray-400 ml-5">May 14, 2025</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social, Payment, Copyright */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-gray-700 pt-8">
          {/* Social Icons */}
          <div className="flex gap-3">
            {socialIcons.map((item, idx) => (
              <a
                key={idx}
                href="#"
                className={`w-10 h-10 flex items-center justify-center rounded-full ${item.color} text-gray-900 text-xl hover:scale-110 transition`}
                aria-label="Social"
              >
                {item.icon}
              </a>
            ))}
          </div>
          {/* Payment Images */}
          <div className="flex gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-8 bg-white rounded px-2" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-8 bg-white rounded px-2" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Stripe_Logo%2C_revised_2016.png" alt="Stripe" className="h-8 bg-white rounded px-2" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 bg-white rounded px-2" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Coinbase.png" alt="Coinbase" className="h-8 bg-white rounded px-2" />
          </div>
          {/* Copyright */}
          <div className="text-gray-400 text-sm text-center">
            © 2024 Digital Simba AI. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}