import React from "react";
import { Link } from "react-router-dom";

export default function Services() {

  const services = [
    {
      img: "/img/hairstyling.png",
      title: "Hair Styling",
      desc: "Cuts, color, styling & treatments",
    },
    {
      img: "/img/bridalmakeup.png",
      title: "Bridal Makeup",
      desc: "Complete bridal beauty packages",
    },
    {
      img: "/img/skincare.png",
      title: "Skin Care",
      desc: "Facials, peels & skin therapy",
    },
    {
      img: "/img/nailart.png",
      title: "Nail Art",
      desc: "Creative designs & nail extensions",
    },
    {
      img: "/img/make.png",
      title: "Makeup",
      desc: "Party & professional makeup",
    },
    {
      img: "/img/spa.png",
      title: "Spa",
      desc: "Relaxing body & wellness treatments",
    },
  ];

  return (
    <section className="py-24 bg-[#f8f5f2]">

      {/* Heading */}
      <div className="text-center mb-16">
        <p className="text-pink-500 tracking-[0.2em] text-sm mb-3 font-bold">
          OUR SERVICES
        </p>
        <h2 className="text-5xl text-gray-800 font-bold">
          Beauty, Perfected
        </h2>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">

          {services.map((item, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden group"
            >
              <img
                src={item.img}
                className="w-full h-[420px] object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-200">{item.desc}</p>
              </div>
            </div>
          ))}

        </div>

        {/* View All Services Link */}
        <div className="text-center mt-12">
          <Link
            to="/services"
            className="text-pink-600 text-lg font-medium inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            View All Services →
          </Link>
        </div>

      </div>

    </section>
  );
}