const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const slotRoutes = require("./routes/slots");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes); // ✅ ONLY admin route

mongoose.connect("mongodb://127.0.0.1:27017/appointmentDB")
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});

