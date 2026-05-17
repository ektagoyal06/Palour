import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage: "url('/img/makeup.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl text-white pt-28 sm:pt-20">
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="text-yellow-400 text-base sm:text-lg">
              ★★★★★
            </div>
            <p className="text-xs sm:text-sm">
              500+ Happy Clients
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6">
            Unveil Your{" "}
            <span className="italic font-light">Inner</span>
            <br />
            Radiance
          </h1>

          {/* Description */}
          <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-8 leading-relaxed">
            Premium beauty services crafted by expert stylists.
            From bridal makeovers to everyday glam — we bring
            your vision to life.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            
            <NavLink
              to="/booking"
              onClick={(e) => {
                const user = JSON.parse(
                  localStorage.getItem("currentUser")
                );

                // ❌ Not logged in
                if (!user) {
                  e.preventDefault();
                  alert(
                    "⚠️ Please sign up or login first to book an appointment"
                  );
                  return;
                }

                // ❌ Admin restriction
                if (user.role === "admin") {
                  e.preventDefault();
                  alert(
                    "🚫 Admins are not allowed to book appointments"
                  );
                  return;
                }
              }}
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto bg-pink-500 px-6 py-3 rounded-full text-white flex items-center justify-center gap-2 hover:bg-pink-600 transition font-bold">
                Book Appointment →
              </button>
            </NavLink>

            <Link
              to="/services"
              className="w-full sm:w-auto"
            >
              <button className="w-full sm:w-auto border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition font-bold">
                Explore Services
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}