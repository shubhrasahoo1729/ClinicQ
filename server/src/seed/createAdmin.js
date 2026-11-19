import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

async function createAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name: "Admin", email, passwordHash, role: "admin" });
    console.log("Admin created:", email);
  }

  await mongoose.disconnect();
}

createAdmin();
