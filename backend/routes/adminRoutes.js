import express from "express";
import Admin from "../models/Admin.js";
import auth from "../middleware/auth.js"; // ✅ IMPORT

const router = express.Router();

// GET logged-in admin
router.get("/me", auth, async (req, res) => { // ✅ ADD auth
  try {
    const admin = await Admin.findById(req.userId).select("-password");

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;