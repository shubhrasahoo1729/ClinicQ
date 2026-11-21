import { z } from "zod";

export const timeString = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "Time must be in HH:mm format, like 09:30",
  );

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const phoneRule = z
  .string()
  .regex(/^\d{10}$/, "Phone must be 10 digits");

export const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/\d/, "Password must contain a number");
