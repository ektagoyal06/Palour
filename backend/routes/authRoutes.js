import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

const router = express.Router();

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { role, email, password, secretCode } = req.body;

    // ===== ADMIN SIGNUP =====
    if (role === "admin") {
      if (secretCode !== "1234") {
        return res.status(400).json({ message: "Invalid secret code" });
      }

      const existing = await Admin.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const admin = new Admin({
        ...req.body,
        password: hashedPassword,
      });

      await admin.save();

      return res.json({ message: "Admin signup successful" });
    }

    // ===== USER SIGNUP =====
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User signup successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= SIGNIN =================
router.post("/signin", async (req, res) => {
  try {
    const { email, password, role, secretCode } = req.body;

    // ===== ADMIN LOGIN =====
    if (role === "admin") {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: "Admin not found" });
      }

      if (admin.secretCode !== secretCode) {
        return res.status(400).json({ message: "Invalid secret code" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        { id: admin._id },
        process.env.JWT_SECRET, // ✅ FIXED
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        },
      });
    }

    // ===== USER LOGIN =====
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET, // ✅ FIXED (IMPORTANT)
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;