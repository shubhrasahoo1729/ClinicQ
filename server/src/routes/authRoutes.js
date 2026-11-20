import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { register, login, me } from "../controllers/authController.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));
router.get("/me", protect, asyncHandler(me));

// TEMPORARY route, only to test role protection. We delete it on Day 4.
router.get("/admin-check", protect, authorize("admin"), (req, res) => {
  res.json({ message: `Hello admin ${req.user.name}` });
});

export default router;
