import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOTP extends Document {
  userId: mongoose.Types.ObjectId;
  type: "phone" | "aadhaar" | "pan" | "2fa_setup" | "email_verify";
  code: string;
  expiresAt: Date;
  used: boolean;
  attempts: number;
}

const otpSchema = new Schema<IOTP>({
  userId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
  type:      { type: String, enum: ["phone", "aadhaar", "pan", "2fa_setup", "email_verify"], required: true },
  code:      { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used:      { type: Boolean, default: false },
  attempts:  { type: Number, default: 0 },
});

// Auto-delete expired documents
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP: Model<IOTP> = mongoose.models.OTP ?? mongoose.model<IOTP>("OTP", otpSchema);
export default OTP;
