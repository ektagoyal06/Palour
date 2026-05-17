import React from "react";
import Footer from "../components/Footer"; // adjust path if needed

export default function Gallery() {
  return (
    <>
      <section className="px-6 md:px-16 py-16 bg-[#f8f6f4]">
        
        {/* Heading */}
        <div className="text-center mb-12 py-12">
          <p className="text-pink-500 tracking-[0.2em] text-sm font-bold mb-5 " >
            Our Work
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mt-2">
            Gallery
          </h2>
          <p className="text-gray-500 mt-4 mb-[-35px] max-w-xl mx-auto">
            A glimpse into the beauty transformations we create every day.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Big Image */}
          <div className="md:col-span-2">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
              alt="Makeup"
              className="w-[800px] h-full object-cover rounded-2xl"
            />
          </div>

          {/* Right Side Grid */}
          <div className="grid grid-cols-2 gap-10">
            
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
              alt=""
              className="w-[800px] h-full object-cover rounded-2xl ml-[-120px]"
            />

            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371"
              alt=""
              className="w-full h-full object-cover rounded-2xl"
            />

            <img
              src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796"
              alt=""
              className="w-full h-full object-cover rounded-2xl"
            />

            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
              alt=""
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}