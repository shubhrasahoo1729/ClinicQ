import Token from "../models/Token.js";
import { getNextSequence } from "./counterService.js";
import { todayIST, weekdayIST } from "../utils/dates.js";
import { HttpError } from "../utils/httpError.js";

export async function issueToken({
  doctor,
  patient = null,
  patientName,
  patientPhone,
  source,
}) {
  // Rule 1: the doctor must work today
  if (!doctor.workingDays.includes(weekdayIST())) {
    throw new HttpError(409, "This doctor does not work today");
  }

  // Rule 2: the queue must be open
  if (doctor.queueStatus === "closed") {
    throw new HttpError(409, "The queue is closed right now");
  }
  if (doctor.queueStatus === "paused") {
    throw new HttpError(409, "The queue is paused. Please try again shortly");
  }

  const date = todayIST();
  const number = await getNextSequence(`${doctor._id}:${date}`);

  const token = await Token.create({
    doctor: doctor._id,
    clinic: doctor.clinic,
    patient,
    patientName,
    patientPhone,
    date,
    number,
    source,
  });

  // How many people are waiting in front of this token?
  const patientsAhead = await Token.countDocuments({
    doctor: doctor._id,
    date,
    status: "waiting",
    number: { $lt: number },
  });

  return { token, patientsAhead };
}
