const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
