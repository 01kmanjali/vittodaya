/**
 * Seed script — populates MongoDB with initial data from constants.
 * Run: npx tsx scripts/seed.ts
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

// ---- inline model imports (avoid Next.js module resolution) ----
import { fdSchemes } from "../constants/fdSchemes";
import { banks } from "../constants/banks";
import { loanProducts } from "../constants/loans";
import { faqs } from "../constants/faqs";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB:", MONGODB_URI);

  const db = mongoose.connection.db!;

  // ---- Users ----
  const usersCol = db.collection("users");
  await usersCol.deleteMany({});
  const adminHash = await bcrypt.hash("Admin@123", 12);
  const userHash = await bcrypt.hash("User@1234", 12);
  await usersCol.insertMany([
    {
      name: "Admin User",
      email: "admin@vfspl.in",
      password: adminHash,
      phone: "9000000001",
      role: "admin",
      status: "active",
      kycStatus: "verified",
      isSeniorCitizen: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Anjali Sharma",
      email: "01kmanjali@gmail.com",
      password: userHash,
      phone: "9876543210",
      role: "user",
      status: "active",
      kycStatus: "verified",
      panNumber: "ABCPS1234D",
      dateOfBirth: "1990-05-15",
      address: "123, MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isSeniorCitizen: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log("✓ Users seeded (admin@vfspl.in / Admin@123, 01kmanjali@gmail.com / User@1234)");

  // ---- Banks ----
  const banksCol = db.collection("banks");
  await banksCol.deleteMany({});
  await banksCol.insertMany(
    banks.map((b) => ({ ...b, slug: b.id, createdAt: new Date(), updatedAt: new Date() }))
  );
  console.log(`✓ Banks seeded (${banks.length})`);

  // ---- FD Schemes ----
  const fdCol = db.collection("fdschemes");
  await fdCol.deleteMany({});
  await fdCol.insertMany(
    fdSchemes.map((s) => ({ ...s, slug: s.id, createdAt: new Date(), updatedAt: new Date() }))
  );
  console.log(`✓ FD Schemes seeded (${fdSchemes.length})`);

  // ---- Loan Products ----
  const loansCol = db.collection("loanproducts");
  await loansCol.deleteMany({});
  await loansCol.insertMany(
    loanProducts.map((l) => ({ ...l, slug: l.id, createdAt: new Date(), updatedAt: new Date() }))
  );
  console.log(`✓ Loan Products seeded (${loanProducts.length})`);

  // ---- FAQs ----
  const faqsCol = db.collection("faqs");
  await faqsCol.deleteMany({});
  await faqsCol.insertMany(
    faqs.map((f, i) => ({ ...f, isActive: true, order: i, createdAt: new Date(), updatedAt: new Date() }))
  );
  console.log(`✓ FAQs seeded (${faqs.length})`);

  await mongoose.disconnect();
  console.log("\nSeed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
