import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createStaffSchema } from "../validators/staff.validator.js";
import {
  createReceptionist,
  listReceptionists,
} from "../controllers/staffController.js";

const router = Router();

router.use(protect);

router.post(
  "/receptionists",
  authorize("admin"),
  validate(createStaffSchema),
  asyncHandler(createReceptionist),
);
router.get(
  "/receptionists",
  authorize("admin"),
  asyncHandler(listReceptionists),
);

export default router;
