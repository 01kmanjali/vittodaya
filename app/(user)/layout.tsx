import UserSidebar from "@/components/layout/UserSidebar";
import { SessionSync } from "@/components/session-sync";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-light)" }}>
      <SessionSync />
      <UserSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
