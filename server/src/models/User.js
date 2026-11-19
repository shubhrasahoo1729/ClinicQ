import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["patient", "receptionist", "doctor", "admin"],
      default: "patient",
    },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
