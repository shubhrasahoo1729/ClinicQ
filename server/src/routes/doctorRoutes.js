import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createDoctorSchema,
  updateDoctorSchema,
} from "../validators/doctor.validator.js";
import {
  createDoctor,
  listDoctors,
  updateDoctor,
} from "../controllers/doctorController.js";

const router = Router();

router.use(protect);

router.get("/", asyncHandler(listDoctors));
router.post(
  "/",
  authorize("admin"),
  validate(createDoctorSchema),
  asyncHandler(createDoctor),
);
router.patch(
  "/:id",
  authorize("admin"),
  validate(updateDoctorSchema),
  asyncHandler(updateDoctor),
);

export default router;
