import { z } from "zod";
import { objectId, phoneRule } from "./common.js";

export const walkInSchema = z.object({
  doctorId: objectId,
  patientName: z
    .string()
    .trim()
    .min(2, "Patient name must be at least 2 characters"),
  patientPhone: phoneRule.optional(),
});
