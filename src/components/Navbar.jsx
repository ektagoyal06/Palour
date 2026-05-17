import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { User, Menu, X } from "lucide-react";
import SignupForm from "../pages/SignupForm";

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [role, setRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Load logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) setCurrentUser(user);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#f8f5f2] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-pink-500 text-xl">✨</span>

          <h1 className="text-xl sm:text-2xl font-bold text-pink-800">
            Glamour Studio
          </h1>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-pink-500"
                  : "text-gray-600 hover:text-pink-500"
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                isActive
                  ? "text-pink-500"
                  : "text-gray-600 hover:text-pink-500"
              }
            >
              Services
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                isActive
                  ? "text-pink-500"
                  : "text-gray-600 hover:text-pink-500"
              }
            >
              Gallery
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/my-bookings"
              className={({ isActive }) =>
                isActive
                  ? "text-pink-500"
                  : "text-gray-600 hover:text-pink-500"
              }
            >
              My Bookings
            </NavLink>
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          
          {/* Desktop Book Button */}
          <NavLink
            to="/booking"
            className="hidden sm:block"
            onClick={(e) => {
              const user = JSON.parse(
                localStorage.getItem("currentUser")
              );

              // ❌ Not logged in
              if (!user) {
                e.preventDefault();
                alert("⚠️ Please sign up or login first");
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
          >
            <button className="bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition">
              Book Now
            </button>
          </NavLink>

          {/* User Section */}
          <div className="relative">
            
            {/* User Icon / Initial */}
            <button
              onClick={() =>
                setShowDropdown(!showDropdown)
              }
            >
              {currentUser ? (
                <div className="w-9 h-9 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
                  {currentUser.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
              ) : (
                <User className="w-6 h-6 text-gray-700 hover:text-pink-500" />
              )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border z-50">
                
                {/* If NOT logged in */}
                {!currentUser && (
                  <>
                    <button
                      onClick={() => {
                        setRole("user");
                        setShowAuth(true);
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-pink-100 text-pink-600"
                    >
                      Signup as User
                    </button>

                    <button
                      onClick={() => {
                        setRole("admin");
                        setShowAuth(true);
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-pink-100 text-pink-600"
                    >
                      Signup as Admin
                    </button>
                  </>
                )}

                {/* If logged in */}
                {currentUser && (
                  <>
                    <div className="px-4 py-2 text-gray-700 font-semibold border-b">
                      {currentUser.name}
                    </div>

                    {/* Admin Dashboard */}
                    {currentUser.role === "admin" && (
                      <NavLink
                        to="/admin-dashboard"
                        onClick={() =>
                          setShowDropdown(false)
                        }
                        className="block px-4 py-2 hover:bg-pink-100 text-pink-600"
                      >
                        My Dashboard
                      </NavLink>
                    )}

                    <button
                      onClick={() => {
                        localStorage.removeItem(
                          "currentUser"
                        );
                        setCurrentUser(null);
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-pink-100 text-red-500"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            {mobileMenu ? (
              <X className="w-7 h-7 text-pink-600" />
            ) : (
              <Menu className="w-7 h-7 text-pink-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white shadow-md px-6 py-5 space-y-4">
          
          <NavLink
            to="/"
            onClick={() => setMobileMenu(false)}
            className="block text-gray-700 hover:text-pink-500"
          >
            Home
          </NavLink>

          <NavLink
            to="/services"
            onClick={() => setMobileMenu(false)}
            className="block text-gray-700 hover:text-pink-500"
          >
            Services
          </NavLink>

          <NavLink
            to="/gallery"
            onClick={() => setMobileMenu(false)}
            className="block text-gray-700 hover:text-pink-500"
          >
            Gallery
          </NavLink>

          <NavLink
            to="/my-bookings"
            onClick={() => setMobileMenu(false)}
            className="block text-gray-700 hover:text-pink-500"
          >
            My Bookings
          </NavLink>

          {/* Mobile Book Button */}
          <NavLink
            to="/booking"
            onClick={(e) => {
              setMobileMenu(false);

              const user = JSON.parse(
                localStorage.getItem("currentUser")
              );

              if (!user) {
                e.preventDefault();
                alert(
                  "⚠️ Please sign up or login first"
                );
                return;
              }

              if (user.role === "admin") {
                e.preventDefault();
                alert(
                  "🚫 Admins are not allowed to book appointments"
                );
                return;
              }
            }}
          >
            <button className="w-full bg-pink-500 text-white py-3 rounded-full hover:bg-pink-600 transition">
              Book Now
            </button>
          </NavLink>
        </div>
      )}

      {/* Signup Form */}
      {showAuth && (
        <SignupForm
          role={role}
          onClose={() => {
            setShowAuth(false);

            // 🔄 Refresh user after login/signup
            const user = JSON.parse(
              localStorage.getItem("currentUser")
            );

            setCurrentUser(user);
          }}
        />
      )}
    </nav>
  );
}