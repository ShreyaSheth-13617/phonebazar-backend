require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 👉 Import your User model (fix path if needed)
const User = require("./models/UserModel");

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  try {
    // Connect DB
    await mongoose.connect("mongodb://127.0.0.1:27017/phonebazar");
    console.log("✅ MongoDB Connected");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists:");
      console.log("Email:", existingAdmin.email);
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@phonebazar.com",
      password: hashedPassword,
      role: "Admin",
    });

    console.log("\n🎉 ADMIN CREATED SUCCESSFULLY");
    console.log("Email: admin@phonebazar.com");
    console.log("Password: admin123\n");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createAdmin();