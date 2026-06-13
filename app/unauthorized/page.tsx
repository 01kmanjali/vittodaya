import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-light)" }}>
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: "#fef2f2" }}>
          <span className="text-4xl">🔒</span>
        </div>

        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Access Denied</h1>
        <p className="text-sm mb-1 font-medium" style={{ color: "var(--danger)" }}>403 – Unauthorised</p>

        <p className="text-sm leading-relaxed mt-4 mb-8" style={{ color: "var(--text-secondary)" }}>
          You do not have permission to access this page. If you believe this is a mistake,
          please contact your administrator or log in with an account that has the required permissions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)" }}
          >
            Go to Homepage
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl font-semibold text-sm border hover:bg-gray-50 transition-colors"
            style={{ color: "var(--primary)", borderColor: "var(--primary)" }}
          >
            Log In as Different User
          </Link>
        </div>

        <p className="text-xs mt-8" style={{ color: "var(--text-secondary)" }}>
          Need help? Contact us at{" "}
          <a href="mailto:support@vfspl.in" style={{ color: "var(--primary)" }}>support@vfspl.in</a>
        </p>
      </div>
    </div>
  );
}
