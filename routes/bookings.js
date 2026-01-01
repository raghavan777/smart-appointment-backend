const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const auth = require("../middleware/auth");

/* ======================================
   CREATE BOOKING (USER)
====================================== */
router.post("/create", auth, async (req, res) => {
  try {
    const { slotId } = req.body;

    const slot = await Slot.findById(slotId);
    if (!slot || slot.isBooked) {
      return res.status(400).json({ message: "Slot unavailable" });
    }

    slot.isBooked = true;
    await slot.save();

    const booking = await Booking.create({
      userId: req.user.id,
      userName: "User", // optional
      slotId
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================
   GET ALL BOOKINGS (ADMIN)
====================================== */
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const bookings = await Booking.find()
      .populate("slotId")
      .populate("userId", "email");

    res.json(
      bookings.map(b => ({
        _id: b._id,
        user: b.userId.email,
        date: b.slotId.date,
        time: b.slotId.time
      }))
    );
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


/* ======================================
   GET MY BOOKINGS (USER)
====================================== */
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("slotId");

    res.json(
      bookings.map(b => ({
        _id: b._id,
        slot: {
          date: b.slotId.date,
          time: b.slotId.time
        }
      }))
    );
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================
   CANCEL BOOKING (USER)
====================================== */
router.delete("/cancel/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure user owns the booking
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Free the slot
    const slot = await Slot.findById(booking.slotId);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    await booking.deleteOne();

    res.json({ message: "Booking cancelled successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
