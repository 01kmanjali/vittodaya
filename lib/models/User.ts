import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "admin" | "user";
  status: "active" | "inactive" | "pending";
  kycStatus: "verified" | "pending" | "rejected" | "not_started";
  panNumber?: string;
  aadharNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isSeniorCitizen: boolean;
  lastLogin?: Date;
  phoneVerified?: boolean;
  panVerified?: boolean;
  aadhaarVerified?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "pending" },
    kycStatus: { type: String, enum: ["verified", "pending", "rejected", "not_started"], default: "not_started" },
    panNumber: { type: String, uppercase: true, trim: true },
    aadharNumber: { type: String, trim: true },
    dateOfBirth: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    isSeniorCitizen: { type: Boolean, default: false },
    lastLogin: Date,
    phoneVerified:   { type: Boolean, default: false },
    panVerified:     { type: Boolean, default: false },
    aadhaarVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret:  { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);
export default User;
