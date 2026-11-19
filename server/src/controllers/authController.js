import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function register(req, res) {
  const { name, email, phone, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, phone, passwordHash });

  res.status(201).json({
    message: "Registration successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
}
