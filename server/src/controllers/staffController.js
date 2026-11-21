import bcrypt from "bcryptjs";
import Clinic from "../models/Clinic.js";
import User from "../models/User.js";

export async function createReceptionist(req, res) {
  const { name, email, phone, password, clinicId } = req.body;

  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    return res.status(404).json({ message: "Clinic not found" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone,
    passwordHash,
    role: "receptionist",
    clinic: clinic._id,
  });

  res.status(201).json({
    message: "Receptionist created",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      clinic: user.clinic,
    },
  });
}
