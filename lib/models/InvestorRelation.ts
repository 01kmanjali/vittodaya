import mongoose, { Schema, Document, Model } from "mongoose";

export type IRDocType = "annual_report" | "financial_result" | "board_member" | "shareholding" | "press_release";

export interface IInvestorRelation extends Document {
  type: IRDocType;
  title: string;
  year?: string;
  quarter?: string;
  period?: string;
  revenue?: string;
  netProfit?: string;
  npa?: string;
  fileSize?: string;
  publishedDate: string;
  resultType?: "quarterly" | "annual";
  name?: string;
  designation?: string;
  experience?: string;
  qualification?: string;
  bio?: string;
  imageInitial?: string;
  isActive: boolean;
  order?: number;
}

const investorRelationSchema = new Schema<IInvestorRelation>(
  {
    type: { type: String, enum: ["annual_report", "financial_result", "board_member", "shareholding", "press_release"], required: true },
    title: { type: String, required: true },
    year: String,
    quarter: String,
    period: String,
    revenue: String,
    netProfit: String,
    npa: String,
    fileSize: String,
    publishedDate: { type: String, required: true },
    resultType: { type: String, enum: ["quarterly", "annual"] },
    name: String,
    designation: String,
    experience: String,
    qualification: String,
    bio: String,
    imageInitial: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const InvestorRelation: Model<IInvestorRelation> =
  mongoose.models.InvestorRelation ?? mongoose.model<IInvestorRelation>("InvestorRelation", investorRelationSchema);
export default InvestorRelation;
