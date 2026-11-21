import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    specialization: { type: String, required: true, trim: true },
    workingDays: { type: [Number], required: true }, // 0 = Sunday ... 6 = Saturday
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotMinutes: { type: Number, default: 15 },
    avgConsultMinutes: { type: Number, default: 10 },
    queueStatus: {
      type: String,
      enum: ["open", "paused", "closed"],
      default: "closed",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Doctor", doctorSchema);
