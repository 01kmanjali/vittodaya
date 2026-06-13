import mongoose, { Schema, Document, Model } from "mongoose";

export interface INewsArticle extends Document {
  title: string;
  excerpt: string;
  source: string;
  publishedDate: string;
  category: "press-release" | "media-coverage" | "awards" | "announcement";
  imageInitial: string;
  imageColor: string;
  readTime: string;
  isFeatured: boolean;
  isActive: boolean;
}

const newsArticleSchema = new Schema<INewsArticle>(
  {
    title: { type: String, required: true },
    excerpt: String,
    source: String,
    publishedDate: String,
    category: { type: String, enum: ["press-release", "media-coverage", "awards", "announcement"], required: true },
    imageInitial: String,
    imageColor: String,
    readTime: String,
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const NewsArticle: Model<INewsArticle> =
  mongoose.models.NewsArticle ?? mongoose.model<INewsArticle>("NewsArticle", newsArticleSchema);
export default NewsArticle;
