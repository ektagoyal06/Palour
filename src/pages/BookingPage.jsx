import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookingPage() {
    const location = useLocation();
    const selectedServiceFromNav = location.state?.selectedService;
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    const [selectedService, setSelectedService] = useState(null); // ✅ FIXED
    const [selectedStylist, setSelectedStylist] = useState(null);
    const [slotFilter, setSlotFilter] = useState("All");
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingDone, setBookingDone] = useState(false);

    // ✅ Fetch services
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/services")
            .then((res) => setServices(res.data))
            .catch((err) => console.log(err));
    }, []);

    // ✅ Auto-select service
    useEffect(() => {
        if (selectedServiceFromNav && services.length > 0) {
            const matched = services.find(
                (s) => s.title === selectedServiceFromNav
            );
            if (matched) setSelectedService(matched);
        }
    }, [selectedServiceFromNav, services]);

    const handleConfirmBooking = async () => {
    if (!phone || phoneError) return;

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        alert("⚠️ Please login first to book appointment");
        return;
    }

    setIsBooking(true);

    const newBooking = {
        name: user.name,
        email: user.email,
        phone: phone,
        service: selectedService.title,
        date: selectedDate,
        time: selectedTime,
        price: selectedService.price,
        status: "Pending",
    };

    try {
        // ✅ SEND TO DATABASE
        await axios.post("http://localhost:5000/api/bookings", newBooking);

        // ✅ ALSO SAVE LOCALLY (your existing feature)
        const existing = JSON.parse(localStorage.getItem("bookings")) || [];
        const updatedBookings = [{ ...newBooking, id: Date.now() }, ...existing];

        localStorage.setItem("bookings", JSON.stringify(updatedBookings));

        setTimeout(() => {
            setIsBooking(false);
            setBookingDone(true);
        }, 1000);

    } catch (error) {
        console.error("Booking Error:", error);
        alert("❌ Failed to save booking");
        setIsBooking(false);
    }
};

    // Calendar logic
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return (
        <>
            <div className="min-h-screen bg-[#f8f6f4] px-6 md:px-16 py-16">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-semibold py-20">
                        Book an Appointment
                    </h1>
                    <p className="text-gray-500 -mt-12">
                        Choose your service, pick a time, and you're all set.
                    </p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-center mb-10">
                    <div className={`px-5 py-2 rounded-full ${step === 1 ? "bg-pink-500 text-white" : "bg-gray-200"}`}>Service</div>
                    <div className={`w-16 h-[2px] mx-2 ${step >= 2 ? "bg-pink-500" : "bg-gray-300"}`}></div>
                    <div className={`px-5 py-2 rounded-full ${step === 2 ? "bg-pink-500 text-white" : "bg-gray-200"}`}>Date & Time</div>
                    <div className={`w-16 h-[2px] mx-2 ${step >= 3 ? "bg-pink-500" : "bg-gray-300"}`}></div>
                    <div className={`px-5 py-2 rounded-full ${step === 3 ? "bg-pink-500 text-white" : "bg-gray-200"}`}>Your Details</div>
                </div>

                {bookingDone && (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f6f4] text-center px-6 pb-[400px]">

    {/* Icon */}
    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
      <span className="text-green-600 text-3xl">✓</span>
    </div>

    {/* Title */}
    <h1 className="text-4xl font-serif font-semibold mb-3">
      Booking Confirmed!
    </h1>

    {/* Details */}
    <p className="text-gray-600 mb-6">
      {selectedService?.title} on{" "}
      {selectedDate?.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}{" "}
      at {selectedTime}
    </p>

    {/* Buttons */}
    <div className="flex gap-4">
      <button
        onClick={() => {
          const user = JSON.parse(localStorage.getItem("currentUser"));
          if (!user) {
            alert("⚠️ Please login first");
            return;
          }
          navigate("/my-bookings");
        }}
        className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700"
      >
        View My Bookings
      </button>

      <button
        onClick={() => {
          setBookingDone(false);
          setStep(1);
          setSelectedService(null);
          setSelectedDate(null);
          setSelectedTime(null);
        }}
        className="border px-6 py-3 rounded-full"
      >
        Book Another
      </button>
    </div>

    {/* Toast */}
    {showToast && (
      <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-xl p-4">

        {/* Close Button */}
        <button
          onClick={() => setShowToast(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-sm"
        >
          ✕
        </button>

        <p className="font-semibold">Appointment Booked!</p>
        <p className="text-sm text-gray-500">
          We'll confirm your booking shortly.
        </p>
      </div>
    )}
  </div>
)}

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <div className="max-w-4xl mx-auto bg-[#f8f6f4] rounded-2xl shadow p-6">
                            <h2 className="text-xl font-semibold mb-6">Choose a Service</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {services.map((service) => {
                                    const isSelected = selectedService?._id === service._id;

                                    return (
                                        <div
                                            key={service._id}
                                            onClick={() => setSelectedService(service)}
                                            className={`border rounded-xl p-4 flex justify-between items-center cursor-pointer transition
                                            ${isSelected ? "border-pink-500 bg-pink-50 shadow-md" : "hover:border-pink-400"}`}
                                        >
                                            <div>
                                                <h3 className="font-medium">{service.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {service.category} · {service.time}
                                                </p>
                                            </div>
                                            <span className="text-pink-500 font-semibold">
                                                ₹{service.price}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Stylist */}
                        <div className="max-w-4xl mx-auto mt-10 bg-[#f8f6f4] rounded-2xl shadow p-6">
                            <h2 className="text-xl font-semibold mb-6">
                                Prefer a Stylist? (Optional)
                            </h2>

                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    "Any Available",
                                    "Isabella Rossi",
                                    "Sophia Laurent",
                                    "Ava Chen",
                                    "Mia Nakamura",
                                    "Emma Thompson",
                                ].map((stylist, index) => {
                                    const isSelected = selectedStylist === stylist;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedStylist(stylist)}
                                            className={`border rounded-xl p-4 text-center cursor-pointer transition
                        ${isSelected
                                                    ? "border-pink-500 bg-pink-50 shadow-md"
                                                    : "hover:shadow"}
                      `}
                                        >
                                            <p className="font-medium">{stylist}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto flex justify-end mt-8">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedService}
                                className={`px-8 py-3 rounded-full transition 
                                ${selectedService ? "bg-pink-600 text-white" : "bg-gray-300 text-gray-500"}`}
                            >
                                Continue
                            </button>
                        </div>
                    </>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                    <div className="max-w-4xl mx-auto bg-[#f8f6f4] rounded-2xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-6">Pick Your Date & Time</h2>

                        {/* Month Navigation */}
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() =>
                                    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))
                                }
                            >
                                ◀
                            </button>

                            <h3 className="font-medium">
                                {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                                {currentMonth.getFullYear()}
                            </h3>

                            <button
                                onClick={() =>
                                    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))
                                }
                            >
                                ▶
                            </button>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day}>{day}</div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-6">
                            {calendarDays.map((day, index) => {
                                const isToday =
                                    day &&
                                    new Date().toDateString() === day.toDateString();

                                const isSelected =
                                    selectedDate &&
                                    day &&
                                    selectedDate.toDateString() === day.toDateString();

                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                const isPast = day && day < today;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (!day || isPast) return;
                                            setSelectedDate(day);
                                            setSelectedTime(null);
                                        }}
                                        className={`h-12 flex items-center justify-center rounded-lg cursor-pointer transition
              ${!day ? "" : ""}
              ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
              ${isSelected ? "bg-pink-500 text-white" : "hover:bg-gray-100"}
              ${isToday ? "border border-pink-400" : ""}
            `}
                                    >
                                        {day ? day.getDate() : ""}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Time Slots */}
                        {/* Time Slots */}
                        {selectedDate && (
                            <div className="mt-6">

                                {/* Heading */}
                                <h3 className="mb-4 font-medium text-lg flex items-center gap-2">
                                    ⏰ Available Slots —{" "}
                                    {selectedDate.toDateString()}
                                </h3>

                                {/* Filters */}
                                <div className="flex gap-3 mb-6">
                                    {["All", "Morning", "Afternoon", "Evening"].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setSlotFilter(filter)}
                                            className={`px-4 py-1 rounded-full text-sm transition
            ${slotFilter === filter
                                                    ? "bg-pink-500 text-white"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }
          `}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>

                                {/* Time Slots Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                                    {[
                                        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
                                        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
                                        "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
                                        "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
                                        "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM",
                                        "07:00 PM", "07:30 PM"
                                    ]
                                        .filter((time) => {
                                            if (slotFilter === "All") return true;

                                            // Split time and period
                                            const [timePart, period] = time.split(" ");
                                            let hour = parseInt(timePart.split(":")[0]);

                                            // Convert to 24-hour format correctly
                                            if (period === "PM" && hour !== 12) hour += 12;
                                            if (period === "AM" && hour === 12) hour = 0;

                                            // Apply filters
                                            if (slotFilter === "Morning") return hour >= 6 && hour < 12;
                                            if (slotFilter === "Afternoon") return hour >= 12 && hour < 16;
                                            if (slotFilter === "Evening") return hour >= 16 && hour <= 22;

                                            return true;
                                        })
                                        .map((time) => (
                                            <div
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`p-3 rounded-xl text-center border cursor-pointer transition
              ${selectedTime === time
                                                        ? "bg-pink-500 text-white border-pink-500"
                                                        : "bg-white hover:border-pink-400"
                                                    }
            `}
                                            >
                                                {time}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                        {/* Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 rounded-full border"
                            >
                                Back
                            </button>

                            <button
                                onClick={() => {
                                    if (!currentUser) {
                                        alert("⚠️ Please login first");
                                        return;
                                    }
                                    setStep(3);
                                }}
                                disabled={!selectedTime}
                                className={`px-8 py-3 rounded-full transition
          ${selectedTime
                                        ? "bg-pink-600 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"}
        `}
                            >
                                Continue
                            </button>
                        </div>

                    </div>
                )}

                {/* ================= STEP 3 ================= */}
                {step === 3 && !bookingDone && currentUser && (
                    <div className="max-w-4xl mx-auto bg-[#f8f6f4] rounded-2xl shadow p-6">

                        <h2 className="text-xl font-semibold mb-6">Your Details</h2>

                        {/* Selected Service Summary */}
                        <div className="bg-gray-100 rounded-xl p-4 mb-6">
                            <h3 className="font-medium text-lg">
                                {selectedService?.title} · {selectedDate?.toDateString()} at {selectedTime}
                            </h3>
                            <p className="text-pink-600 font-semibold mt-1">
                                ₹{selectedService?.price} · {selectedService?.title}
                            </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">

                            <div>
                                <label className="block mb-1 font-medium">Full Name *</label>
                                <input
                                    type="text"
                                    value={currentUser?.name || ""}
                                    readOnly
                                    className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Email *</label>
                                <input
                                    type="email"
                                    value={currentUser?.email || ""}
                                    readOnly
                                    className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                                />
                            </div>

                            {/* ✅ UPDATED PHONE FIELD */}
                            <div>
                                <label className="block mb-1 font-medium">Phone *</label>
                                <input
                                    type="text"
                                    value={phone}
                                    maxLength={10}
                                    placeholder="Enter 10-digit number"
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // allow only digits
                                        if (!/^\d*$/.test(value)) return;

                                        setPhone(value);

                                        if (value.length === 0) {
                                            setPhoneError("Phone number is required");
                                        } else if (!/^[6-9]\d{9}$/.test(value)) {
                                            setPhoneError("Enter valid 10-digit number starting with 6-9");
                                        } else {
                                            setPhoneError("");
                                        }
                                    }}
                                    className={`w-full border rounded-lg px-4 py-2 ${phoneError ? "border-red-500" : ""
                                        }`}
                                />

                                {phoneError && (
                                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">Special Notes</label>
                                <textarea
                                    placeholder="Any special requests or preferences..."
                                    className="w-full border rounded-lg px-4 py-2"
                                />
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-2 rounded-full border"
                            >
                                Back
                            </button>

                            {/* ✅ UPDATED BUTTON */}
                            <button
                                onClick={handleConfirmBooking}
                                disabled={!phone || phoneError || isBooking}
                                className={`px-8 py-3 rounded-full transition flex items-center justify-center gap-2
    ${phone && !phoneError && !isBooking
                                        ? "bg-pink-600 text-white hover:bg-pink-700"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                {isBooking ? (
                                    <>
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                        Booking...
                                    </>
                                ) : (
                                    "Confirm Booking"
                                )}
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer */}
            <Footer />
        </>
    );
}