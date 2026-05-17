import React from "react";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  const handleBooking = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    // ❌ Not logged in
    if (!user) {
      alert("⚠️ Please sign up or login first to book an appointment");
      return;
    }

    // ❌ Admin restriction
    if (user.role === "admin") {
      alert("🚫 Admins are not allowed to book appointments");
      return;
    }

    // ✅ Allowed
    navigate("/booking");
  };

  return (
    <section className="py-24 bg-[#a9444d] text-center text-white">
      
      {/* Heading */}
      <h2 className="text-5xl font-bold mb-6">
        Ready to Glow?
      </h2>

      {/* Description */}
      <p className="max-w-2xl mx-auto text-lg text-white/80 mb-10 leading-relaxed">
        Book your appointment today and let our expert stylists transform your look into something extraordinary.
      </p>

      {/* Button */}
      <button
        onClick={handleBooking}
        className="bg-white text-gray-800 px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition flex items-center gap-2 mx-auto"
      >
        Book Your Appointment →
      </button>

    </section>
  );
}