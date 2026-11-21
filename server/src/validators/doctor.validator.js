import { z } from "zod";
import { timeString, objectId, phoneRule, passwordRule } from "./common.js";

const workingDays = z
  .array(z.number().int().min(0).max(6))
  .min(1, "Choose at least one working day")
  .refine(
    (days) => new Set(days).size === days.length,
    "Working days must be unique",
  );

const profileFields = {
  specialization: z.string().trim().min(2, "Specialization is required"),
  workingDays,
  startTime: timeString,
  endTime: timeString,
  slotMinutes: z.number().int().min(5).max(60).optional(),
  avgConsultMinutes: z.number().int().min(1).max(120).optional(),
};

export const createDoctorSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    phone: phoneRule.optional(),
    password: passwordRule,
    clinicId: objectId,
    ...profileFields,
  })
  .refine((d) => d.startTime < d.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const updateDoctorSchema = z.object(profileFields).partial();
