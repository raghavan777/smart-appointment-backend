router.get("/bookings", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    const bookings = await Booking.find()
      .populate({
        path: "slotId",
        select: "date time isBooked",
      })
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    // 🛡️ FILTER BROKEN BOOKINGS (IMPORTANT)
    const safeBookings = bookings.filter(b => b.slotId !== null);

    res.json(safeBookings);
  } catch (error) {
    console.error("Admin bookings error:", error);
    res.status(500).json({ message: "Failed to load bookings" });
  }
});
