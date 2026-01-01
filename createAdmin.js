const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose
  .connect("mongodb://127.0.0.1:27017/appointmentDB")
  .then(async () => {
    const existing = await User.findOne({ email: "admin@mail.com" });

    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit(0);
    }

    // 🔐 Hash password properly
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // ✅ Save HASHED password
    await User.create({
      name: "Admin",
      email: "admin@mail.com",
      password: hashedPassword,   // ✅ FIXED
      role: "admin"
    });

    console.log("✅ Admin user CREATED successfully");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  });
