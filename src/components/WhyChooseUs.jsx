import React from "react";
import { Award, Heart, Clock, Shield } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Award size={28} />,
      title: "Expert Stylists",
      desc: "Certified professionals with 10+ years of experience",
    },
    {
      icon: <Heart size={28} />,
      title: "Premium Products",
      desc: "We use only top-tier, cruelty-free beauty products",
    },
    {
      icon: <Clock size={28} />,
      title: "Flexible Scheduling",
      desc: "Easy online booking with convenient time slots",
    },
    {
      icon: <Shield size={28} />,
      title: "Hygiene First",
      desc: "Sanitized tools and pristine salon environment",
    },
  ];

  return (
    <section className="py-24 bg-[#f4efec]">
      
      {/* Heading */}
      <div className="text-center mb-16">
        <p className="text-pink-500 tracking-[0.2em] text-sm mb-3 font-bold">
          WHY CHOOSE US
        </p>
        <h2 className="text-5xl font-bold text-gray-800">
          The Glamour Difference
        </h2>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition"
          >
            {/* Icon Circle */}
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-pink-100 text-pink-600">
              {item.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm">
              {item.desc}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}