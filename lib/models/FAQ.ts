import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

const faqSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FAQ: Model<IFAQ> = mongoose.models.FAQ ?? mongoose.model<IFAQ>("FAQ", faqSchema);
export default FAQ;
