const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const auth = require("../middleware/auth"); // 🔐 JWT middleware

// ✅ CREATE SLOT (ADMIN)
router.post("/create", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time required" });
    }

    const slot = await Slot.create({
      date,
      time,
      isBooked: false
    });

    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL SLOTS (ADMIN)
router.get("/all", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  try {
    const slots = await Slot.find().sort({ date: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET AVAILABLE SLOTS (USER)
router.get("/", async (req, res) => {
  try {
    const slots = await Slot.find({ isBooked: false });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔄 RESET SLOT (ADMIN)
router.put("/reset/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    slot.isBooked = false;
    await slot.save();

    res.json({ message: "Slot reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ❌ DELETE SLOT (ADMIN)
router.delete("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }

  try {
    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: "Slot deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
