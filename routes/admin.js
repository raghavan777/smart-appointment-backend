const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Slot = require("../models/Slot");   // ✅ ADD THIS LINE
const User = require("../models/User");

/**
 * 📊 ADMIN DASHBOARD STATS
 */
router.get("/stats", async (req, res) => {
  try {
    const total = await Slot.countDocuments();
    const booked = await Slot.countDocuments({ isBooked: true });
    const available = total - booked;

    res.json({ total, booked, available });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

/**
 * 📋 GET ALL BOOKINGS (ADMIN)
 */
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("slotId", "date time")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Admin bookings error:", err);
    res.status(500).json({ message: "Failed to load bookings" });
  }
});

module.exports = router;
