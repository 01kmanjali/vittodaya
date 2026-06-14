"use client";

import { Suspense } from "react";
import LoanApplyForm from "./LoanApplyForm";
import { Loader2 } from "lucide-react";

export default function LoanApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary)" }} />
      </div>
    }>
      <LoanApplyForm />
    </Suspense>
  );
}
