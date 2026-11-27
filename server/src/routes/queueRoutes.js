import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { walkInSchema } from "../validators/queue.validator.js";
import { issueWalkIn } from "../controllers/queueController.js";

const router = Router();

router.use(protect);

router.post(
  "/walk-in",
  authorize("receptionist"),
  validate(walkInSchema),
  asyncHandler(issueWalkIn),
);

export default router;
