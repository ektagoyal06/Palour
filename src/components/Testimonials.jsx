import React from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      service: "Bridal Makeup Package",
      text: `"Absolutely incredible bridal makeup! Isabella made me feel like a queen on my wedding day. The attention to detail was flawless."`,
    },
    {
      name: "Emily Chen",
      service: "Balayage Highlights",
      text: `"Best balayage I've ever had! Sophia really understood exactly what I wanted and the results exceeded my expectations."`,
    },
    {
      name: "Maria Garcia",
      service: "Signature Facial",
      text: `"The signature facial was absolutely divine. My skin has never looked this good. Ava is a true skincare wizard!"`,
    },
  ];

  return (
    <section className="pt-10 pb-24 bg-[#f8f5f2]">
      
      {/* Heading */}
      <div className="text-center mb-16">
        <p className="text-pink-500 tracking-[0.2em] text-sm font-bold mb-3">
          TESTIMONIALS
        </p>
        <h2 className="text-5xl font-bold text-gray-800">
          Words from Our Clients
        </h2>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 relative"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-pink-200 text-5xl font-serif">
              ”
            </div>

            {/* Text */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {item.text}
            </p>

            {/* Name */}
            <h3 className="font-semibold text-gray-800">
              {item.name}
            </h3>

            {/* Service */}
            <p className="text-sm text-gray-500">
              {item.service}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}