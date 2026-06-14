"use client";
import { SessionProvider } from "next-auth/react";
import { ReactQueryProvider } from "@/lib/queryClient";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReactQueryProvider>
        {children}
        <Toaster position="top-right" richColors closeButton duration={4000} />
      </ReactQueryProvider>
    </SessionProvider>
  );
}
