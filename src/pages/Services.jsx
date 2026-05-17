import React, { useState, useEffect } from "react";
import {
  Search,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  "All",
  "Hair",
  "Makeup",
  "Skin Care",
  "Nails",
  "Bridal",
  "Spa & Wellness",
];

export default function ServicesPage() {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ADMIN STATES
  const [showForm, setShowForm] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const emptyService = {
    category: "",
    title: "",
    desc: "",
    price: "",
    time: "",
    popular: false,
  };

  const [newService, setNewService] = useState(emptyService);

  // Detect Admin
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = user?.role === "admin";

  // Fetch Services
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/services")
      .then((res) => {
        setServicesData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // Filter
  const filteredServices = servicesData.filter((service) => {
    const matchCategory =
      activeCategory === "All" ||
      service.category === activeCategory;

    const matchSearch =
      service.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      service.desc
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <div className="text-center mt-40 text-gray-500">
        Loading services...
      </div>
    );
  }

  return (
    <>
      <section className="pt-32 pb-20 bg-[#f8f5f2] px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-pink-500 tracking-[0.2em] text-sm font-bold mb-3">
            WHAT WE OFFER
          </p>

          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Our Services
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our full range of premium beauty services
            designed to make you look and feel your best.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12">

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === cat
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-[#f8f6f4] border border-gray-300 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
            />
          </div>
        </div>

        {/* Service Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredServices.length > 0 ? (
            filteredServices.map((item) => (
              <div
                key={item._id}
                className="bg-[#f8f5f2] rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition relative"
              >

                {/* 3 DOT MENU */}
                {isAdmin && (
                  <div className="absolute top-4 right-4">

                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === item._id
                            ? null
                            : item._id
                        )
                      }
                      className="p-1 hover:bg-gray-200 rounded-full"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMenu === item._id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg border z-20">

                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setEditingService(item);
                            setNewService(item);
                            setShowForm(true);
                            setOpenMenu(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={async () => {
                            const confirmDelete =
                              window.confirm(
                                "Delete this service?"
                              );

                            if (!confirmDelete) return;

                            try {
                              await axios.delete(
                                `http://localhost:5000/api/services/${item._id}`
                              );

                              // Realtime UI update
                              setServicesData(
                                servicesData.filter(
                                  (service) =>
                                    service._id !== item._id
                                )
                              );

                              setOpenMenu(null);

                            } catch (err) {
                              console.log(err);
                              alert(
                                "Error deleting service"
                              );
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-500 w-full text-left"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Category */}
                <div className="flex gap-2 mb-4">
                  <span className="bg-pink-100 text-pink-600 text-xs px-3 py-1 rounded-full font-bold">
                    {item.category}
                  </span>

                  {item.popular && (
                    <span className="bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full font-bold">
                      Popular
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">
                  {item.desc}
                </p>

                {/* Price + Booking */}
                <div className="flex items-center justify-between mt-6">

                  <div className="flex items-center gap-6">

                    <p className="text-pink-500 font-bold text-lg">
                      ${item.price}
                    </p>

                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Clock size={14} />
                      {item.time}
                    </p>

                  </div>

                  <button
                    onClick={() => {
                      const user = JSON.parse(
                        localStorage.getItem(
                          "currentUser"
                        )
                      );

                      // Not logged in
                      if (!user) {
                        alert(
                          "⚠️ Please sign up or login first to book an appointment"
                        );
                        return;
                      }

                      // Admin restriction
                      if (user.role === "admin") {
                        alert(
                          "🚫 Admins are not allowed to book appointments"
                        );
                        return;
                      }

                      // Navigate
                      navigate("/booking", {
                        state: {
                          selectedService: item.title,
                        },
                      });
                    }}
                    className="text-pink-500 font-medium hover:underline flex items-center gap-1"
                  >
                    Book →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              No services found.
            </p>
          )}
        </div>

        {/* FLOATING ADD BUTTON */}
        {isAdmin && (
          <button
            onClick={() => {
              setEditingService(null);
              setNewService(emptyService);
              setShowForm(true);
            }}
            className="fixed bottom-6 right-6 bg-pink-500 text-white w-14 h-14 rounded-full text-3xl shadow-lg hover:bg-pink-600"
          >
            +
          </button>
        )}
      </section>

      {/* MODAL FORM */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-xl w-[600px] space-y-4">

            <h2 className="text-xl font-bold">
              {editingService
                ? "Edit Service"
                : "Add Service"}
            </h2>

            {/* Title */}
            <input
              type="text"
              placeholder="Title"
              value={newService.title}
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setNewService({
                  ...newService,
                  title: e.target.value,
                })
              }
            />

            {/* Category */}
            <input
              type="text"
              placeholder="Category"
              value={newService.category}
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setNewService({
                  ...newService,
                  category: e.target.value,
                })
              }
            />

            {/* Description */}
            <input
              type="text"
              placeholder="Description"
              value={newService.desc}
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setNewService({
                  ...newService,
                  desc: e.target.value,
                })
              }
            />

            {/* Price */}
            <input
              type="number"
              placeholder="Price"
              value={newService.price}
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setNewService({
                  ...newService,
                  price: e.target.value,
                })
              }
            />

            {/* Time */}
            <input
              type="text"
              placeholder="Time"
              value={newService.time}
              className="w-full border p-2 rounded"
              onChange={(e) =>
                setNewService({
                  ...newService,
                  time: e.target.value,
                })
              }
            />

            {/* Popular */}
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={newService.popular}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    popular: e.target.checked,
                  })
                }
              />
              Popular
            </label>

            {/* Buttons */}
            <div className="flex justify-between">

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingService(null);
                  setNewService(emptyService);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {

                    // UPDATE
                    if (editingService) {

                      const res = await axios.put(
                        `http://localhost:5000/api/services/${editingService._id}`,
                        newService
                      );

                      setServicesData(
                        servicesData.map((service) =>
                          service._id ===
                          editingService._id
                            ? res.data
                            : service
                        )
                      );

                    } else {

                      // ADD
                      const res = await axios.post(
                        "http://localhost:5000/api/services",
                        newService
                      );

                      setServicesData([
                        ...servicesData,
                        res.data,
                      ]);
                    }

                    setShowForm(false);
                    setEditingService(null);
                    setNewService(emptyService);

                  } catch (err) {
                    console.log(err);
                    alert("Error saving service");
                  }
                }}
                className="px-4 py-2 bg-pink-500 text-white rounded"
              >
                {editingService ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}