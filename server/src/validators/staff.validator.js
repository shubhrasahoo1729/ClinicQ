import { z } from "zod";
import { objectId, phoneRule, passwordRule } from "./common.js";

export const createStaffSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: phoneRule.optional(),
  password: passwordRule,
  clinicId: objectId,
});
