import React, { useEffect, useState } from "react";
import { socket } from "../socket";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newBooking, setNewBooking] = useState(null);
  const [denyNote, setDenyNote] = useState("");
  const [activeDenyId, setActiveDenyId] = useState(null);

  // ✅ CONFIRM BOOKING
  const handleConfirm = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/bookings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: "Confirmed",
          }),
        }
      );

      const updatedBookings =
        bookings.map((b) =>
          b._id === id
            ? {
                ...b,
                status: "Confirmed",
              }
            : b
        );

      setBookings(updatedBookings);
    } catch (err) {
      console.error(
        "❌ Confirm error:",
        err
      );
    }
  };

  // ✅ DENY BOOKING
  const handleDeny = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: "Denied",
            note: denyNote,
          }),
        }
      );

      const updatedBooking =
        await res.json();

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id
            ? updatedBooking
            : b
        )
      );

      setActiveDenyId(null);
      setDenyNote("");
    } catch (err) {
      console.error(
        "❌ Deny error:",
        err
      );
    }
  };

  // ✅ CANCEL BOOKING
  const handleCancel = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/bookings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: "Cancelled",
          }),
        }
      );

      const updatedBookings =
        bookings.map((b) =>
          b._id === id
            ? {
                ...b,
                status: "Cancelled",
              }
            : b
        );

      setBookings(updatedBookings);
    } catch (err) {
      console.error(
        "❌ Cancel error:",
        err
      );
    }
  };

  // ✅ LOAD BOOKINGS
  const loadBookings = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/bookings"
      );

      const data = await res.json();

      setBookings(data);
    } catch (err) {
      console.error(
        "❌ Fetch bookings error:",
        err
      );
    }
  };

  // ✅ FETCH ADMIN
  const fetchAdmin = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        console.error(
          "❌ No token found"
        );
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/admin/me",
        {
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setAdmin(data);
      } else {
        console.error(
          "❌ API Error:",
          data.message
        );
      }
    } catch (err) {
      console.error(
        "❌ Fetch Error:",
        err
      );
    }
  };

  // ✅ SOCKET EVENTS
  useEffect(() => {
    loadBookings();

    const notificationSound =
      new Audio("/notification.wav");

    // NEW BOOKING
    socket.on(
      "new-booking",
      (booking) => {
        setBookings((prev) => [
          booking,
          ...prev,
        ]);

        notificationSound
          .play()
          .catch(() => {
            console.log(
              "Autoplay blocked"
            );
          });

        setNewBooking(booking);
        setShowPopup(true);

        setTimeout(
          () => setShowPopup(false),
          4000
        );
      }
    );

    // UPDATED BOOKING
    socket.on(
      "booking-updated",
      (updatedBooking) => {
        setBookings((prev) =>
          prev.map((b) =>
            b._id ===
            updatedBooking._id
              ? updatedBooking
              : b
          )
        );
      }
    );

    fetchAdmin();

    return () => {
      socket.off("new-booking");
      socket.off("booking-updated");
    };
  }, []);

  // ENABLE SOUND
  useEffect(() => {
    const enableSound = () => {
      const audio = new Audio(
        "/notification.wav"
      );

      audio
        .play()
        .then(() => {
          audio.pause();
        })
        .catch(() => {});

      window.removeEventListener(
        "click",
        enableSound
      );
    };

    window.addEventListener(
      "click",
      enableSound
    );
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-24 px-4 sm:px-6 lg:px-10">
      
      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* ================= LEFT PANEL ================= */}
        <div className="w-full lg:w-1/4 bg-pink-200 shadow-lg p-6 rounded-2xl flex flex-col justify-between">
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-pink-600 mb-8">
              Admin Panel
            </h1>

            {/* Admin Info */}
            {admin ? (
              <div className="space-y-5">
                
                <div>
                  <p className="text-sm text-pink-600 font-semibold">
                    Name
                  </p>

                  <p className="font-semibold break-words">
                    {admin.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-pink-600 font-semibold">
                    Email
                  </p>

                  <p className="font-semibold break-words">
                    {admin.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-pink-600 font-semibold">
                    Contact
                  </p>

                  <p className="font-semibold">
                    {admin.contact}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-pink-600 font-semibold">
                    Parlour Name
                  </p>

                  <p className="font-semibold">
                    {admin.parlourName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-pink-600 font-semibold">
                    Address
                  </p>

                  <p className="font-semibold break-words">
                    {admin.parlourAddress}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">
                Loading admin details...
              </p>
            )}

            {/* About */}
            <div className="mt-8 bg-pink-50 p-4 rounded-xl">
              <h2 className="font-semibold text-pink-600 mb-2">
                About our Parlour
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                Welcome to our premium beauty
                parlour. We offer
                professional services
                including skincare, hair
                styling, makeup, and
                wellness treatments.
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem(
                "currentUser"
              );

              localStorage.removeItem(
                "token"
              );

              window.location.href =
                "/";
            }}
            className="mt-8 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl w-full transition"
          >
            Logout
          </button>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="w-full lg:w-3/4">
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            All Bookings
          </h2>

          <div className="bg-white shadow rounded-2xl p-4 sm:p-6">
            
            {bookings.length === 0 ? (
              <p className="text-gray-500">
                No bookings yet.
              </p>
            ) : (
              <div className="space-y-5">
                
                {bookings.map((b) => (
                  <div
                    key={b._id}
                    className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-gray-50"
                  >
                    
                    {/* TOP */}
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      
                      {/* LEFT INFO */}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          {b.service}
                        </h3>

                        <p className="text-gray-600 text-sm">
                          📅{" "}
                          {new Date(
                            b.date
                          ).toLocaleDateString()}
                        </p>

                        <p className="text-gray-600 text-sm">
                          ⏰ {b.time}
                        </p>

                        <p className="text-pink-600 font-semibold">
                          ₹{b.price}
                        </p>

                        <p className="text-gray-700 break-all text-sm">
                          👤 {b.email}
                        </p>
                      </div>

                      {/* RIGHT ACTIONS */}
                      <div className="flex flex-col gap-3 md:items-end">
                        
                        {/* STATUS */}
                        {b.status ===
                        "Pending" ? (
                          <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm w-fit">
                            Pending
                          </span>
                        ) : b.status ===
                          "Confirmed" ? (
                          <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm w-fit">
                            Confirmed
                          </span>
                        ) : b.status ===
                          "Denied" ? (
                          <span className="px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm w-fit">
                            Denied
                          </span>
                        ) : (
                          <span className="px-4 py-1 rounded-full bg-gray-200 text-gray-700 text-sm w-fit">
                            {b.status}
                          </span>
                        )}

                        {/* ACTION BUTTONS */}
                        {b.status ===
                          "Pending" && (
                          <div className="flex flex-wrap gap-2">
                            
                            <button
                              onClick={() =>
                                handleConfirm(
                                  b._id
                                )
                              }
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
                            >
                              Confirm
                            </button>

                            {activeDenyId ===
                            b._id ? (
                              <div className="flex flex-col sm:flex-row gap-2 w-full">
                                
                                <input
                                  type="text"
                                  placeholder="Reason"
                                  value={
                                    denyNote
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    setDenyNote(
                                      e.target
                                        .value
                                    )
                                  }
                                  className="border px-3 py-2 rounded-lg w-full"
                                />

                                <button
                                  onClick={() =>
                                    handleDeny(
                                      b._id
                                    )
                                  }
                                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                  Submit
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  setActiveDenyId(
                                    b._id
                                  )
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
                              >
                                Deny
                              </button>
                            )}
                          </div>
                        )}

                        {/* NOTE */}
                        {b.note && (
                          <p className="text-sm text-red-500 max-w-xs">
                            Reason: {b.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔔 NEW BOOKING POPUP */}
      {showPopup && newBooking && (
        <div className="fixed top-5 right-5 bg-white shadow-xl border-l-4 border-green-500 p-4 rounded-xl z-50 animate-bounce max-w-xs">
          
          <h3 className="font-semibold text-green-600">
            New Booking!
          </h3>

          <p className="text-sm text-gray-600 break-words">
            {newBooking.service} by{" "}
            {newBooking.email}
          </p>
        </div>
      )}
    </div>
  );
}