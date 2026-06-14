"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store/authStore";

export function SessionSync() {
  const { data: session, status } = useSession();
  const { user, fetchMe } = useAuthStore();

  useEffect(() => {
    // Session is loaded and user is authenticated but Zustand store is empty
    // (happens after page refresh — NextAuth restores session but Zustand is reset)
    if (status === "authenticated" && session?.user && !user) {
      fetchMe();
    }
  }, [status, session, user, fetchMe]);

  return null;
}
