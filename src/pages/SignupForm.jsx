import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function SignupForm({ onClose, role }) {
  const [isSignIn, setIsSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    parlourName: "",
    parlourAddress: "",
    secretCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact" && !/^\d{0,10}$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignIn && formData.contact.length !== 10) {
      alert("📞 Contact number must be 10 digits");
      return;
    }

    try {
      // ================= SIGN IN =================
      if (isSignIn) {
        const res = await fetch("http://localhost:5000/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role,
            secretCode: role === "admin" ? formData.secretCode : undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(`❌ ${data.message}`);
          return;
        }

        // ✅ Save token properly
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        alert("✅ Login successful");
        onClose();

        if (role === "admin") {
          navigate("/admin-dashboard");
        }

        return;
      }

      // ================= SIGN UP =================
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`❌ ${data.message}`);
        return;
      }

      alert(`✅ ${role === "admin" ? "Admin" : "User"} Signup successful`);

      // ================= AUTO LOGIN =================
      const loginRes = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role,
          secretCode: role === "admin" ? formData.secretCode : undefined,
        }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        localStorage.setItem("token", loginData.token);
        localStorage.setItem("currentUser", JSON.stringify(loginData.user));
      }

      onClose();

      if (role === "admin") {
        navigate("/admin-dashboard");
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        contact: "",
        parlourName: "",
        parlourAddress: "",
        secretCode: "",
      });

    } catch (err) {
      alert("❌ Server error. Make sure backend is running.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignIn
            ? "Sign In"
            : role === "admin"
              ? "Admin Sign Up"
              : "User Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isSignIn && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              <input
                type="text"
                name="contact"
                placeholder="Phone Number"
                value={formData.contact}
                onChange={handleChange}
                maxLength={10}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              {role === "admin" && (
                <>
                  <input
                    type="text"
                    name="parlourName"
                    placeholder="Parlour Name"
                    value={formData.parlourName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />

                  <input
                    type="text"
                    name="parlourAddress"
                    placeholder="Parlour Address"
                    value={formData.parlourAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </>
              )}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          {role === "admin" && (
            <input
              type="text"
              name="secretCode"
              placeholder="Secret Code"
              value={formData.secretCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button className="w-full bg-pink-600 text-white py-2 rounded-lg">
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-pink-600 cursor-pointer ml-1"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}