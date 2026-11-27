import Doctor from "../models/Doctor.js";
import { issueToken } from "../services/queueService.js";

export async function issueWalkIn(req, res) {
  const { doctorId, patientName, patientPhone } = req.body;

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  // A receptionist can only work with doctors at their own clinic
  if (String(doctor.clinic) !== String(req.user.clinic)) {
    return res
      .status(403)
      .json({ message: "This doctor belongs to a different clinic" });
  }

  const { token, patientsAhead } = await issueToken({
    doctor,
    patientName,
    patientPhone,
    source: "walk_in",
  });

  res.status(201).json({
    message: "Token issued",
    token: {
      id: token._id,
      number: token.number,
      status: token.status,
      patientName: token.patientName,
      date: token.date,
      issuedAt: token.issuedAt,
    },
    patientsAhead,
  });
}
