import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  category: String,
  title: String,
  desc: String,
  price: Number,
  time: String,
  popular: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Service", serviceSchema);