import mongoose, { Schema, Document, Model } from "mongoose";

export type FeatureStatus = "active" | "maintenance" | "upcoming" | "disabled";

export interface IAppConfig extends Document {
  // Feature visibility & status for users
  features: {
    fixedDeposits:    { enabled: boolean; status: FeatureStatus; label: string };
    loans:            { enabled: boolean; status: FeatureStatus; label: string };
    kycVerification:  { enabled: boolean; status: FeatureStatus; label: string };
    investorRelations:{ enabled: boolean; status: FeatureStatus; label: string };
    newsMedia:        { enabled: boolean; status: FeatureStatus; label: string };
  };
  // FD specific settings
  fd: {
    minAmount:  number;
    maxAmount:  number;
    tenures:    number[]; // in months
    seniorCitizenBonus: number; // extra % for senior citizens
  };
  // Loan settings per type
  loans: {
    personal: { enabled: boolean; minAmount: number; maxAmount: number; minTenureMonths: number; maxTenureMonths: number };
    msme:     { enabled: boolean; minAmount: number; maxAmount: number; minTenureMonths: number; maxTenureMonths: number };
    ev:       { enabled: boolean; minAmount: number; maxAmount: number; minTenureMonths: number; maxTenureMonths: number };
    lap:      { enabled: boolean; minAmount: number; maxAmount: number; minTenureMonths: number; maxTenureMonths: number };
  };
  // App-wide settings
  app: {
    maintenanceMode:    boolean;
    maintenanceMessage: string;
    registrationOpen:   boolean;
    supportEmail:       string;
    supportPhone:       string;
  };
  // Notification toggles
  notifications: {
    welcomeEmail:        boolean;
    otpEmail:            boolean;
    applicationUpdates:  boolean;
  };
  updatedAt: Date;
}

const featureSchema = {
  enabled: { type: Boolean, default: true },
  status:  { type: String, enum: ["active", "maintenance", "upcoming", "disabled"], default: "active" },
  label:   { type: String, default: "" },
};

const loanTypeSchema = {
  enabled:          { type: Boolean, default: true },
  minAmount:        { type: Number, default: 50000 },
  maxAmount:        { type: Number, default: 5000000 },
  minTenureMonths:  { type: Number, default: 12 },
  maxTenureMonths:  { type: Number, default: 60 },
};

const configSchema = new Schema<IAppConfig>(
  {
    features: {
      fixedDeposits:     { ...featureSchema, label: { type: String, default: "Fixed Deposits" } },
      loans:             { ...featureSchema, label: { type: String, default: "Loan Products" } },
      kycVerification:   { ...featureSchema, label: { type: String, default: "KYC Verification" } },
      investorRelations: { ...featureSchema, label: { type: String, default: "Investor Relations" } },
      newsMedia:         { ...featureSchema, label: { type: String, default: "News & Media" } },
    },
    fd: {
      minAmount:           { type: Number, default: 10000 },
      maxAmount:           { type: Number, default: 10000000 },
      tenures:             { type: [Number], default: [6, 12, 18, 24, 36, 60] },
      seniorCitizenBonus:  { type: Number, default: 0.25 },
    },
    loans: {
      personal: loanTypeSchema,
      msme:     loanTypeSchema,
      ev:       { ...loanTypeSchema, minAmount: { type: Number, default: 100000 }, maxAmount: { type: Number, default: 2000000 } },
      lap:      { ...loanTypeSchema, minAmount: { type: Number, default: 500000 }, maxAmount: { type: Number, default: 50000000 } },
    },
    app: {
      maintenanceMode:    { type: Boolean, default: false },
      maintenanceMessage: { type: String, default: "We are currently under maintenance. Please check back soon." },
      registrationOpen:   { type: Boolean, default: true },
      supportEmail:       { type: String, default: "support@vfspl.in" },
      supportPhone:       { type: String, default: "+91 98765 43210" },
    },
    notifications: {
      welcomeEmail:       { type: Boolean, default: true },
      otpEmail:           { type: Boolean, default: true },
      applicationUpdates: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const AppConfig: Model<IAppConfig> =
  mongoose.models.AppConfig ?? mongoose.model<IAppConfig>("AppConfig", configSchema);

export default AppConfig;

// Helper to get or create the single config document
export async function getConfig(): Promise<IAppConfig> {
  let config = await AppConfig.findOne();
  if (!config) config = await AppConfig.create({});
  return config;
}
