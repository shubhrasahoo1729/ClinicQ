import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerSchema } from "../validators/auth.validator.js";
import { register } from "../controllers/authController.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));

export default router;
