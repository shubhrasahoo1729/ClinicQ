import Clinic from "../models/Clinic.js";

export async function createClinic(req, res) {
  const clinic = await Clinic.create(req.body);
  res.status(201).json({ message: "Clinic created", clinic });
}

export async function listClinics(req, res) {
  // Admins see everything; everyone else sees only active clinics
  const filter = req.user.role === "admin" ? {} : { isActive: true };
  const clinics = await Clinic.find(filter).sort({ name: 1 });
  res.json({ clinics });
}

export async function updateClinic(req, res) {
  const clinic = await Clinic.findById(req.params.id);
  if (!clinic) {
    return res.status(404).json({ message: "Clinic not found" });
  }

  clinic.set(req.body);

  if (clinic.openTime >= clinic.closeTime) {
    return res
      .status(400)
      .json({ message: "Closing time must be after opening time" });
  }

  await clinic.save();
  res.json({ message: "Clinic updated", clinic });
}
