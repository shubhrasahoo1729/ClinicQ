import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// The only fields we ever send back about a user. passwordHash is never included.
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

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
    user: publicUser(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passwordOk =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!passwordOk) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.isActive) {
    return res
      .status(403)
      .json({ message: "This account has been deactivated" });
  }

  res.json({
    message: "Login successful",
    token: signToken(user),
    user: publicUser(user),
  });
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
