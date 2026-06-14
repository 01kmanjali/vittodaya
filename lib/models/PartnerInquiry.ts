import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPartnerInquiry extends Document {
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  profile: "dsa" | "advisor" | "realestate" | "channel" | "other";
  message?: string;
  status: "new" | "contacted" | "converted" | "rejected";
  notes?: string;
}

const partnerInquirySchema = new Schema<IPartnerInquiry>(
  {
    name:    { type: String, required: true },
    mobile:  { type: String, required: true },
    email:   String,
    city:    String,
    profile: {
      type: String,
      enum: ["dsa", "advisor", "realestate", "channel", "other"],
      required: true,
    },
    message: String,
    status:  { type: String, enum: ["new", "contacted", "converted", "rejected"], default: "new" },
    notes:   String,
  },
  { timestamps: true }
);

const PartnerInquiry: Model<IPartnerInquiry> =
  mongoose.models.PartnerInquiry ??
  mongoose.model<IPartnerInquiry>("PartnerInquiry", partnerInquirySchema);

export default PartnerInquiry;
