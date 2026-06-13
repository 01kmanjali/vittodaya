import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBank extends Document {
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  type: string;
  rating: string;
  ratingAgency: string;
  established: number;
  hq: string;
  description: string;
  isActive: boolean;
}

const bankSchema = new Schema<IBank>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    logo: { type: String, default: "" },
    type: { type: String, required: true },
    rating: String,
    ratingAgency: String,
    established: Number,
    hq: String,
    description: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Bank: Model<IBank> = mongoose.models.Bank ?? mongoose.model<IBank>("Bank", bankSchema);
export default Bank;
