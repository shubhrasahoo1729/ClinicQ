import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createClinicSchema,
  updateClinicSchema,
} from "../validators/clinic.validator.js";
import {
  createClinic,
  listClinics,
  updateClinic,
} from "../controllers/clinicController.js";

const router = Router();

router.use(protect); // everything below requires login

router.get("/", asyncHandler(listClinics));
router.post(
  "/",
  authorize("admin"),
  validate(createClinicSchema),
  asyncHandler(createClinic),
);
router.patch(
  "/:id",
  authorize("admin"),
  validate(updateClinicSchema),
  asyncHandler(updateClinic),
);

export default router;
