import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICareer extends Document {
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  experience: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  isActive: boolean;
  isFeatured: boolean;
}

const careerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ["full-time", "part-time", "contract", "internship"], required: true },
    experience: String,
    postedDate: String,
    description: String,
    responsibilities: [String],
    requirements: [String],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Career: Model<ICareer> = mongoose.models.Career ?? mongoose.model<ICareer>("Career", careerSchema);
export default Career;
