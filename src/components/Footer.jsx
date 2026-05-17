import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#2b1e1f] to-[#3a2a2c] text-white pt-20 pb-10 px-6 mt-[100px]">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Logo + Description */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            ✨ Glamour Studio
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Where beauty meets artistry. Premium beauty services crafted to make you feel extraordinary.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:text-white cursor-pointer">Services</li>
            <li className="hover:text-white cursor-pointer">Our Team</li>
            <li className="hover:text-white cursor-pointer">Book Appointment</li>
            <li className="hover:text-white cursor-pointer">Gallery</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase">Contact</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> 123 Beauty Lane, Suite 4, New York
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +1 (555) 123-4567
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> hello@glamourstudio.com
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase">Hours</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <Clock size={16} /> Mon - Fri: 9AM - 8PM
            </li>
            <li>Sat: 9AM - 6PM</li>
            <li>Sun: 10AM - 5PM</li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-600 mt-12 pt-6 text-center text-gray-400 text-sm">
        © 2026 Glamour Studio. All rights reserved.
      </div>

    </footer>
  );
}