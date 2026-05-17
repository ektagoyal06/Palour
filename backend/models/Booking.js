import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  service: String,
  date: Date,
  time: String,
  price: Number,
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Denied"],
    default: "Pending",
  },

  // ✅ ADD THIS
  note: {
    type: String,
    default: ""
  }

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;