import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // null for walk-ins without an account
    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, trim: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD' in IST
    number: { type: Number, required: true },
    source: {
      type: String,
      enum: ["walk_in", "booked", "online"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "waiting",
        "called",
        "in_consultation",
        "completed",
        "skipped",
        "cancelled",
        "no_show",
      ],
      default: "waiting",
    },
    issuedAt: { type: Date, default: Date.now },
    calledAt: Date,
    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true },
);

// A second safety net: even if our counter logic ever failed, the database itself refuses duplicates
tokenSchema.index({ doctor: 1, date: 1, number: 1 }, { unique: true });
// Speeds up "show me today's waiting tokens for this doctor"
tokenSchema.index({ doctor: 1, date: 1, status: 1 });

export default mongoose.model("Token", tokenSchema);
