import { z } from "zod";
import { timeString, phoneRule } from "./common.js";

const clinicFields = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  address: z.string().trim().min(5, "Address must be at least 5 characters"),
  phone: phoneRule.optional(),
  openTime: timeString,
  closeTime: timeString,
});

export const createClinicSchema = clinicFields.refine(
  (d) => d.openTime < d.closeTime,
  { message: "Closing time must be after opening time", path: ["closeTime"] },
);

export const updateClinicSchema = clinicFields
  .partial()
  .extend({ isActive: z.boolean().optional() });
