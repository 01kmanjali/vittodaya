import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-light)" }}>
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
