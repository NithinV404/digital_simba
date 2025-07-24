import { MdCancel } from "react-icons/md";
import { BsArrowUpRightCircleFill, BsCart4, BsSearch } from "react-icons/bs";
import { PiArrowElbowUpRightBold } from "react-icons/pi";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

export default function PricingPlan() {
  const [selected, setSelected] = useState("Monthly");
  const buttons = ["Monthly", "Yearly", "Unlimited"];
  return (
    <section className="py-20 bg-white w-full">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center md:items-center justify-between mb-12 px-4">
        <div className="flex-1 text-left">
          <p className="text-orange-600 font-semibold mb-2 text-lg">Pricing Plan</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">Life Planning, Making Easy to Turn r <span className="text-purple-600">Dreams </span> a Reality</h2>
          <p className="text-gray-600 max-w-2xl mb-0">
            We offer flexible pricing plans to suit the diverse needs of our clients.
          </p>
        </div>
        <div className="flex justify-center md:justify-end w-full md:w-auto mt-8 md:mt-0">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white font-semibold rounded-full shadow hover:bg-gray-900 transition">
            View All
            <BsArrowUpRightCircleFill className="w-5 h-5" />
          </button>
        </div>
        </div>
        <div className="flex justify-center bg-blue-50 rounded-full border border-blue-200 mx-auto w-[350px] h-[50px] items-center relative overflow-hidden">
          {buttons.map((btn, idx) => (
            <button
              key={btn}
              className={`p-2 rounded-full font-semibold transition-all cursor-pointer duration-300 ease-in-out
                ${selected === btn
                  ? 'bg-purple-600 text-white shadow scale-110 z-10'
                  : 'bg-blue-50 text-black'}
                `}
              style={{ minWidth: 110 }}
              onClick={() => setSelected(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
        {selected === "Monthly" && (
          <div className="flex flex-col md:flex-row gap-8 justify-center mt-12">
            {/* Free Plan Card */}
            <div className="w-full max-w-md bg-gray-800 rounded-3xl border border-blue-100 p-8 flex flex-col items-start relative" style={{minHeight: 600}}>
              <div className="absolute top-2 left-2 px-4 py-1 bg-yellow-400 text-black rounded-full text-xl font-semibold">Recommended Plan</div>
              <div className="absolute -top-2 -right-2 bg-white h-20 w-20  rounded-full"></div>
              <div className="absolute top-0 right-0 bg-gray-800 h-15 w-15  rounded-full p-2 shadow-md flex items-center justify-center z-10">
                <PiArrowElbowUpRightBold className="text-yellow-400 text-2xl" />
              </div>
              <div className="text-2xl font-extrabold text-white mb-1 mt-10 text-left">Free</div>
              <div className="text-gray-100 mb-4 text-left">Free Plan to test our Solution</div>
              <div className="flex items-end gap-2 mb-2 text-left">
                <span className="text-3xl font-extrabold text-yellow-400 ">$9</span>
                <span className="text-lg font-bold text-white line-through">$19</span>
                <span className="text-base text-yellow-400">/MONTHLY</span>
              </div>
              <div className="w-full text-left mb-6 mt-4">
                <div className="font-semibold mb-2 text-white">What’s Included</div>
                <ul className="text-gray-100 text-sm flex flex-col gap-4 pl-0">
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />1% Affiliate commission</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />5 Social profile</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />20 Social post</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />Facebook, Instagram, Linkedin, youtube Platform access</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />Schedule posting</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />Webhook access</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />1 Prebuilt ai templates</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />gpt-4-0613 Open ai model</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />dall-e-2 Image ai model</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />2000 Word token</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-yellow-400 text-xl" />20 Image token</li>
                </ul>
              </div>
              <button className="absolute -bottom-5 right-2 px-8 py-3 bg-yellow-400 text-gray-800 font-bold rounded-full shadow hover:bg-yellow-500 transition text-center">Subscribe</button>
            </div>
            {/* Basic Plan Card */}
            <div className="w-full max-w-md bg-gray-200 rounded-3xl border border-blue-100 p-8 flex flex-col items-start relative" style={{minHeight: 600}}>
              <div className="absolute top-2 left-2 px-4 py-1 bg-purple-400 text-black rounded-full text-xl font-semibold">Basic</div>
              <div className="absolute -top-2 -right-2 bg-white h-20 w-20  rounded-full"></div>
              <div className="absolute top-0 right-0 bg-purple-400 h-15 w-15  rounded-full p-2 shadow-md flex items-center justify-center z-10">
                <BsCart4 className="text-white text-2xl" />
              </div>
              <div className="text-2xl font-bold text-gray-700 mb-1 mt-10 text-left">Flexible monthly plan for consistent social media management</div>
              <div className="flex items-end gap-2 mb-2 text-left mt-2">
                <span className="text-3xl font-extrabold text-black ">$39</span>
                <span className="text-lg font-bold text-gray-500 line-through">$59</span>
                <span className="text-base text-black">/MONTHLY</span>
              </div>
              <div className="w-full text-left mb-6 mt-4">
                <div className="font-semibold mb-2 text-black">What’s Included</div>
                <ul className="text-gray-800 text-sm flex flex-col gap-4 pl-0">
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-xl" />5% Affiliate commission</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-xl" />10 Social profile</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-xl" />2000 Social post</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-2xl" />Facebook, Instagram, Twitter, Linkedin, tikTok, youtube Platform access</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-xl" />Schedule posting</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-xl" />Webhook access</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-xl" />gpt-4-0613 Open ai model</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-xl" />dall-e-2 Image ai model</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-xl" />1000 Word token</li>
                  <li className="flex items-center gap-2"><FaCheckCircle className="text-purple-600 text-xl" />10 Image token</li>
                  <li className="flex items-center gap-2"><MdCancel  className="text-red-500 text-2xl" />Prebuilt ai templates</li>
                </ul>
              </div>
              <button className="absolute -bottom-5 right-2 px-8 py-3 bg-purple-400 text-gray-800 font-bold rounded-full shadow hover:bg-purple-700 transition text-center">Subscribe</button>
            </div>
          </div>
        )}
        {(selected === "Yearly" || selected === "Unlimited") && (
          <div className="flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
            <div className="mb-6">
              <BsSearch className="text-6xl text-gray-400 animate-bounce" />
            </div>
            <div className="text-2xl font-bold text-gray-500">No data found!!</div>
          </div>
        )}
    </section>
  );
}
