import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHomeProduct extends Document {
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

const homeProductSchema = new Schema<IHomeProduct>(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image:       { type: String, default: "" },
    order:       { type: Number, default: 0 },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

const HomeProduct: Model<IHomeProduct> =
  mongoose.models.HomeProduct ?? mongoose.model<IHomeProduct>("HomeProduct", homeProductSchema);

export default HomeProduct;
