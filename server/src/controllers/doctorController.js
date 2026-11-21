import bcrypt from "bcryptjs";
import Clinic from "../models/Clinic.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";

export async function createDoctor(req, res) {
  const { name, email, phone, password, clinicId, ...profile } = req.body;

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
    role: "doctor",
    clinic: clinic._id,
  });

  try {
    const doctor = await Doctor.create({
      ...profile,
      user: user._id,
      clinic: clinic._id,
    });
    await doctor.populate("user", "name email phone");
    res.status(201).json({ message: "Doctor created", doctor });
  } catch (err) {
    // The login was created but the profile failed: undo it, so no half-made doctor exists
    await User.findByIdAndDelete(user._id);
    throw err;
  }
}

export async function listDoctors(req, res) {
  const filter = {};
  if (req.query.clinic) filter.clinic = req.query.clinic;

  const doctors = await Doctor.find(filter)
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });

  res.json({ doctors });
}

export async function updateDoctor(req, res) {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  doctor.set(req.body);

  if (doctor.startTime >= doctor.endTime) {
    return res
      .status(400)
      .json({ message: "End time must be after start time" });
  }

  await doctor.save();
  await doctor.populate("user", "name email phone");
  res.json({ message: "Doctor updated", doctor });
}
