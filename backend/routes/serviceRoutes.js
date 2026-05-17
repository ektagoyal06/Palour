import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

console.log("Service route loaded");


// ✅ Add multiple services (bulk)
router.post("/seed", async (req, res) => {
  try {

    const services = req.body;

    await Service.insertMany(services);

    res.json({
      message: "Services added successfully",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});


// ✅ Add single service
router.post("/", async (req, res) => {
  try {

    const service = await Service.create(req.body);

    res.status(201).json(service);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});


// ✅ Get all services
router.get("/", async (req, res) => {
  try {

    const services = await Service.find();

    res.json(services);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});


// ✅ UPDATE SERVICE
router.put("/:id", async (req, res) => {
  try {

    const updatedService =
      await Service.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    if (!updatedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json(updatedService);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});


// ✅ DELETE SERVICE
router.delete("/:id", async (req, res) => {
  try {

    const deletedService =
      await Service.findByIdAndDelete(
        req.params.id
      );

    if (!deletedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.json({
      message: "Service deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});

export default router;