import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  parlourName: { type: String, required: true },
  parlourAddress: { type: String, required: true },
  secretCode: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);