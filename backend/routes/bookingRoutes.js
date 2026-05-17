import express from "express";
import Booking from "../models/Booking.js";
import { io } from "../server.js";

const router = express.Router();

// ✅ CREATE BOOKING
router.post("/", async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();

        // 🔥 EMIT NEW BOOKING
        io.emit("new-booking", booking);

        res.status(201).json({
            message: "Booking saved",
            booking
        });
    } catch (err) {
        res.status(500).json({
            message: "Error saving booking",
            error: err.message,
        });
    }
});

// ✅ GET ALL BOOKINGS
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching bookings",
            error: err.message,
        });
    }
});

// ✅ UPDATE BOOKING STATUS
// ✅ UPDATE BOOKING STATUS + NOTE
router.put("/:id", async (req, res) => {
    try {
        const { status, note } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        // 🔥 Prepare update object dynamically
        const updateData = { status };

        // ✅ Only update note if it's provided
        if (note !== undefined) {
            updateData.note = note;
        }

        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // 🔥 EMIT REAL-TIME UPDATE
        io.emit("booking-updated", updated);

        res.json(updated);
    } catch (err) {
        res.status(500).json({
            message: "Error updating booking",
            error: err.message,
        });
    }
});

export default router;