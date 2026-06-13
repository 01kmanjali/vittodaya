import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Application from "@/lib/models/Application";
import FDScheme from "@/lib/models/FDScheme";
import LoanProduct from "@/lib/models/LoanProduct";
import { withAuth } from "@/lib/apiAuth";

export const GET = withAuth(async (_req: NextRequest) => {
  await connectDB();

  const [
    totalUsers,
    activeUsers,
    pendingKYC,
    totalApplications,
    pendingApplications,
    approvedApplications,
    activeApplications,
    totalFDSchemes,
    totalLoanProducts,
    recentApplications,
    applicationsByType,
    applicationsByStatus,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "user", status: "active" }),
    User.countDocuments({ role: "user", kycStatus: "pending" }),
    Application.countDocuments(),
    Application.countDocuments({ status: "submitted" }),
    Application.countDocuments({ status: "approved" }),
    Application.countDocuments({ status: "active" }),
    FDScheme.countDocuments({ isActive: true }),
    LoanProduct.countDocuments({ isActive: true }),
    Application.find().sort({ createdAt: -1 }).limit(10).lean(),
    Application.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
    Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  return NextResponse.json({
    users: { total: totalUsers, active: activeUsers, pendingKYC },
    applications: {
      total: totalApplications,
      pending: pendingApplications,
      approved: approvedApplications,
      active: activeApplications,
      byType: applicationsByType,
      byStatus: applicationsByStatus,
    },
    products: { fdSchemes: totalFDSchemes, loanProducts: totalLoanProducts },
    recentApplications,
  });
}, "admin");
