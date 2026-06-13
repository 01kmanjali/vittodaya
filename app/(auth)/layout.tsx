import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-light)" }}>
      <header className="h-16 flex items-center px-6 bg-white border-b" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-lg" style={{ color: "var(--primary)" }}>Vittodaya</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">{children}</main>
      <footer className="py-4 text-center text-xs" style={{ color: "var(--text-secondary)" }}>
        © 2025 Vittodaya Financial Services Pvt. Ltd.
      </footer>
    </div>
  );
}
