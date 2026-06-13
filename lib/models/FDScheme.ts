import mongoose, { Schema, Document, Model } from "mongoose";

const tenureRateSchema = new Schema(
  {
    tenureMonths: { type: Number, required: true },
    tenureLabel: { type: String, required: true },
    regularRate: { type: Number, required: true },
    seniorRate: { type: Number, required: true },
  },
  { _id: false }
);

export interface IFDScheme extends Document {
  slug: string;
  bankId: string;
  bankName: string;
  bankType: string;
  schemeName: string;
  minAmount: number;
  maxAmount?: number;
  tenureRates: Array<{ tenureMonths: number; tenureLabel: string; regularRate: number; seniorRate: number }>;
  compoundingFrequency: string;
  prematureWithdrawal: boolean;
  loanAgainstFD: boolean;
  autoRenewal: boolean;
  taxSaverFD: boolean;
  rating: string;
  ratingAgency: string;
  tags: string[];
  isActive: boolean;
  featuredOrder?: number;
}

const fdSchemeSchema = new Schema<IFDScheme>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    bankId: { type: String, required: true },
    bankName: { type: String, required: true },
    bankType: { type: String, required: true },
    schemeName: { type: String, required: true },
    minAmount: { type: Number, required: true },
    maxAmount: Number,
    tenureRates: [tenureRateSchema],
    compoundingFrequency: { type: String, required: true },
    prematureWithdrawal: { type: Boolean, default: false },
    loanAgainstFD: { type: Boolean, default: false },
    autoRenewal: { type: Boolean, default: false },
    taxSaverFD: { type: Boolean, default: false },
    rating: String,
    ratingAgency: String,
    tags: [String],
    isActive: { type: Boolean, default: true },
    featuredOrder: Number,
  },
  { timestamps: true }
);

const FDScheme: Model<IFDScheme> = mongoose.models.FDScheme ?? mongoose.model<IFDScheme>("FDScheme", fdSchemeSchema);
export default FDScheme;
