import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Clinic", clinicSchema);
