import mongoose, { Schema, Document, Model } from "mongoose";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "active"
  | "matured"
  | "cancelled"
  | "rejected";

export type ApplicationType = "fd" | "personal" | "msme" | "ev" | "lap";

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  type: ApplicationType;
  schemeId: string;
  schemeName: string;
  bankId?: string;
  bankName?: string;
  principalAmount: number;
  tenureMonths?: number;
  tenureLabel?: string;
  interestRate?: number;
  maturityAmount?: number;
  isSeniorCitizen: boolean;
  compoundingFrequency?: string;
  status: ApplicationStatus;
  approvedAt?: Date;
  startDate?: Date;
  maturityDate?: Date;
  fdNumber?: string;
  loanNumber?: string;
  remarks?: string;
  documents?: string[];
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    type: { type: String, enum: ["fd", "personal", "msme", "ev", "lap"], required: true },
    schemeId: { type: String, required: true },
    schemeName: { type: String, required: true },
    bankId: String,
    bankName: String,
    principalAmount: { type: Number, required: true },
    tenureMonths: Number,
    tenureLabel: String,
    interestRate: Number,
    maturityAmount: Number,
    isSeniorCitizen: { type: Boolean, default: false },
    compoundingFrequency: String,
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "active", "matured", "cancelled", "rejected"],
      default: "submitted",
    },
    approvedAt: Date,
    startDate: Date,
    maturityDate: Date,
    fdNumber: String,
    loanNumber: String,
    remarks: String,
    documents: [String],
  },
  { timestamps: true }
);

const Application: Model<IApplication> =
  mongoose.models.Application ?? mongoose.model<IApplication>("Application", applicationSchema);
export default Application;
