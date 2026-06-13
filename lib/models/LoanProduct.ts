import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILoanProduct extends Document {
  slug: string;
  type: "personal" | "msme" | "ev" | "lap";
  name: string;
  tagline: string;
  heroDesc: string;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  rateFrom: number;
  rateTo: number;
  processingFee: string;
  features: Array<{ icon: string; title: string; desc: string }>;
  eligibility: Array<{ label: string; value: string }>;
  documents: Array<{ category: string; items: string[] }>;
  tags: string[];
  isActive: boolean;
  featuredOrder?: number;
}

const loanProductSchema = new Schema<ILoanProduct>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: ["personal", "msme", "ev", "lap"], required: true },
    name: { type: String, required: true },
    tagline: String,
    heroDesc: String,
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    minTenureMonths: Number,
    maxTenureMonths: Number,
    rateFrom: Number,
    rateTo: Number,
    processingFee: String,
    features: [{ icon: String, title: String, desc: String, _id: false }],
    eligibility: [{ label: String, value: String, _id: false }],
    documents: [{ category: String, items: [String], _id: false }],
    tags: [String],
    isActive: { type: Boolean, default: true },
    featuredOrder: Number,
  },
  { timestamps: true }
);

const LoanProduct: Model<ILoanProduct> =
  mongoose.models.LoanProduct ?? mongoose.model<ILoanProduct>("LoanProduct", loanProductSchema);
export default LoanProduct;
