import React, { useEffect, useState } from "react";
import { socket } from "../socket";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");

  // ✅ NEW STATE
  const [addedToCalendar, setAddedToCalendar] =
    useState(() => {
      return JSON.parse(
        localStorage.getItem(
          "addedToCalendar"
        ) || "{}"
      );
    });

  const getCurrentUser = () =>
    JSON.parse(localStorage.getItem("currentUser") || "null");

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  // ✅ FETCH BOOKINGS
  const loadBookings = async () => {
    const user = getCurrentUser();

    if (!user || !user.email) {
      setBookings([]);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/bookings"
      );

      const data = await res.json();

      const userBookings = data.filter(
        (b) => b.email === user.email
      );

      setBookings(userBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // ✅ ADD TO CALENDAR
  // ✅ GOOGLE CALENDAR REDIRECT
  const addToCalendar = (booking) => {
    try {
      const bookingDate = new Date(
        booking.date
      );

      // Extract time
      let [time, modifier] =
        booking.time.split(" ");

      let [hours, minutes] =
        time.split(":");

      hours = parseInt(hours, 10);

      // Handle AM/PM
      if (
        modifier === "PM" &&
        hours < 12
      ) {
        hours += 12;
      }

      if (
        modifier === "AM" &&
        hours === 12
      ) {
        hours = 0;
      }

      minutes = minutes
        ? parseInt(minutes, 10)
        : 0;

      bookingDate.setHours(hours);
      bookingDate.setMinutes(minutes);
      bookingDate.setSeconds(0);

      // End time = +1 hour
      const endDate = new Date(
        bookingDate.getTime() +
        60 * 60 * 1000
      );

      // Google calendar format
      const formatGoogleDate = (
        date
      ) => {
        return date
          .toISOString()
          .replace(/-|:|\.\d+/g, "");
      };

      const start =
        formatGoogleDate(
          bookingDate
        );

      const end =
        formatGoogleDate(endDate);

      // ✅ GOOGLE CALENDAR URL
      const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        booking.service
      )}&dates=${start}/${end}&details=${encodeURIComponent(
        `Your appointment for ${booking.service}`
      )}&location=${encodeURIComponent(
        "Salon"
      )}`;

      // Open Google Calendar
      window.open(url, "_blank");

      // ✅ Change button to Added
      const updatedState = {
        ...addedToCalendar,
        [booking._id]: true,
      };

      setAddedToCalendar(updatedState);

      // ✅ SAVE IN LOCAL STORAGE
      localStorage.setItem(
        "addedToCalendar",
        JSON.stringify(updatedState)
      );

    } catch (err) {
      console.error(
        "Calendar error:",
        err
      );

      alert(
        "Invalid booking date or time"
      );
    }
  };

  // ✅ LOAD + SOCKET
  useEffect(() => {
    loadBookings();

    // 🆕 New booking
    socket.on("new-booking", (booking) => {
      if (
        booking.email ===
        currentUser?.email
      ) {
        setBookings((prev) => [
          booking,
          ...prev,
        ]);
      }
    });

    // 🔄 Booking updated
    socket.on(
      "booking-updated",
      (updatedBooking) => {
        if (
          updatedBooking.email ===
          currentUser?.email
        ) {
          setBookings((prev) =>
            prev.map((b) =>
              b._id ===
                updatedBooking._id
                ? updatedBooking
                : b
            )
          );
        }
      }
    );

    // ✅ CLEANUP
    return () => {
      socket.off("new-booking");
      socket.off("booking-updated");
    };
  }, []);

  // ✅ VALID BOOKINGS
  const validBookings = bookings.filter(
    (b) =>
      b.date &&
      b.time &&
      !isNaN(new Date(b.date))
  );

  // ✅ FILTER BOOKINGS
  const filteredBookings =
    filter === "All"
      ? validBookings
      : validBookings.filter(
        (b) => b.status === filter
      );

  return (
    <div className="min-h-screen bg-[#f8f6f4] px-4 sm:px-6 lg:px-20 xl:px-40 py-24">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold">
          My Bookings
        </h1>

        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Manage your appointments
        </p>
      </div>

      {/* Filters */}
      {!isAdmin && (
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            "All",
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled",
            "Denied",
          ].map((f) => (
            <button
              key={f}
              onClick={() =>
                setFilter(f)
              }
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
                ${filter === f
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="space-y-5">

        {!currentUser ? (
          <p className="text-red-500">
            ⚠️ You are not signed up yet
          </p>

        ) : isAdmin ? (
          <p className="text-blue-500 font-medium">
            🚫 You are an admin.
            Bookings are not available.
          </p>

        ) : filteredBookings.length ===
          0 ? (
          <p className="text-gray-500">
            No bookings yet
          </p>

        ) : (
          filteredBookings.map((b) => {
            const parsedDate =
              new Date(b.date);

            const isValidDate =
              !isNaN(parsedDate);

            return (
              <div
                key={b._id}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-5"
              >

                {/* LEFT */}
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl">
                    {b.service}
                  </h3>

                  <p className="text-gray-500 text-sm sm:text-base mt-1">
                    {isValidDate
                      ? `${parsedDate.toDateString()} · ${b.time}`
                      : `Invalid Date · ${b.time}`}{" "}
                    · ₹{b.price}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

                  {/* STATUS */}
                  <div className="flex flex-col">
                    <span
                      className={`px-4 py-1 rounded-full text-sm text-center
                        ${b.status ===
                        "Pending" &&
                        "bg-yellow-100 text-yellow-700"
                        }
                        ${b.status ===
                        "Cancelled" &&
                        "bg-red-100 text-red-600"
                        }
                        ${b.status ===
                        "Confirmed" &&
                        "bg-green-100 text-green-600"
                        }
                        ${b.status ===
                        "Completed" &&
                        "bg-blue-100 text-blue-600"
                        }
                        ${b.status ===
                        "Denied" &&
                        "bg-red-200 text-red-700"
                        }`}
                    >
                      {b.status}
                    </span>

                    {/* DENIED NOTE */}
                    {b.status ===
                      "Denied" &&
                      b.note && (
                        <p className="text-sm text-red-500 mt-2 max-w-xs">
                          Reason: {b.note}
                        </p>
                      )}

                    {/* ✅ ADD TO CALENDAR */}
                    {b.status ===
                      "Confirmed" && (
                        <button
                          onClick={() =>
                            addToCalendar(b)
                          }
                          disabled={
                            addedToCalendar[
                            b._id
                            ]
                          }
                          className={`mt-3 px-4 py-2 rounded-lg text-sm transition text-white
                          ${addedToCalendar[
                              b._id
                            ]
                              ? "bg-blue-600 cursor-default"
                              : "bg-pink-500 hover:bg-pink-600"
                            }`}
                        >
                          {addedToCalendar[
                            b._id
                          ]
                            ? "Added ✓"
                            : "Add to Calendar"}
                        </button>
                      )}
                  </div>

                  {/* CANCEL BUTTON */}
                  {b.status ===
                    "Pending" && (
                      <button
                        onClick={async () => {
                          try {
                            await fetch(
                              `http://localhost:5000/api/bookings/${b._id}`,
                              {
                                method:
                                  "PUT",
                                headers: {
                                  "Content-Type":
                                    "application/json",
                                },
                                body:
                                  JSON.stringify(
                                    {
                                      status:
                                        "Cancelled",
                                    }
                                  ),
                              }
                            );
                          } catch (err) {
                            console.error(
                              err
                            );
                          }
                        }}
                        className="text-red-500 font-medium hover:text-red-700 transition"
                      >
                        Cancel
                      </button>
                    )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}