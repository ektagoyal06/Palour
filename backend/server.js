import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

import auth from "./middleware/auth.js";

dotenv.config();

const app = express();

console.log("Server file loaded");


// =========================
// MIDDLEWARE
// =========================
app.use(cors());

app.use(express.json());


// =========================
// CREATE HTTP SERVER
// =========================
const server = http.createServer(app);


// =========================
// SOCKET.IO
// =========================
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});


// =========================
// SOCKET CONNECTION
// =========================
io.on("connection", (socket) => {

  console.log("⚡ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log(
      "❌ User disconnected:",
      socket.id
    );
  });

});


// =========================
// MONGODB CONNECTION
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });


// =========================
// API ROUTES
// =========================

// AUTH
app.use("/api/auth", authRoutes);

// ADMIN
app.use("/api/admin", auth, adminRoutes);

// BOOKINGS
app.use("/api/bookings", bookingRoutes);

// SERVICES
app.use("/api/services", serviceRoutes);


// =========================
// TEST ROUTE
// =========================
app.get("/", (req, res) => {
  res.send("API Running...");
});


// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});