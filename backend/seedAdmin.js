/**
 * One-time admin seeder script.
 * Run with: node backend/seedAdmin.js
 *
 * This creates a single admin account in the database.
 * Edit the credentials below before running.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

const ADMIN = {
  name: "Campus Admin",
  email: "admin@ouce.edu",
  password: "Admin@1234",   // Change this!
  role: "admin",
  department: "",
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await User.findOne({ role: "admin" });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${existing.email}`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN.password, 10);
    const admin = await User.create({ ...ADMIN, password: hashed });
    console.log(`✅ Admin created successfully!`);
    console.log(`   Email   : ${admin.email}`);
    console.log(`   Password: ${ADMIN.password}`);
    console.log(`\n🔐 Login at http://localhost:5173`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
