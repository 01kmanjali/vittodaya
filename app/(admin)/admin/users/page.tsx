"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAdminUsers } from "@/lib/queries/useAdminAnalytics";

const kycColors: Record<string, { bg: string; text: string }> = {
  verified:    { bg: "#f0fdf4", text: "#16a34a" },
  pending:     { bg: "#fef9c3", text: "#ca8a04" },
  rejected:    { bg: "#fef2f2", text: "#dc2626" },
  not_started: { bg: "#f3f4f6", text: "#6b7280" },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAdminUsers();
  const allUsers = data?.users ?? [];
  const regularUsers = allUsers.filter(u => u.role === "user");

  const filtered = regularUsers.filter(u =>
    !search ||
    `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Users</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage registered investors on the platform</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Users", value: regularUsers.length },
          { label: "Active", value: regularUsers.filter(u => u.status === "active").length },
          { label: "KYC Verified", value: regularUsers.filter(u => u.kycStatus === "verified").length },
          { label: "Senior Citizens", value: regularUsers.filter(u => u.isSeniorCitizen).length },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm" style={{ borderColor: "var(--border)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm outline-none w-full max-w-sm"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        {isLoading && <p className="px-5 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>Loading users…</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-light)" }}>
                {["User", "Phone", "City", "KYC Status", "Senior", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {filtered.map(user => {
                const kc = kycColors[user.kycStatus] ?? kycColors.not_started;
                const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
                return (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "var(--primary)" }}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium" style={{ color: "var(--text-primary)" }}>{name}</div>
                          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>{user.phone ?? "—"}</td>
                    <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>{user.city ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: kc.bg, color: kc.text }}>
                        {user.kycStatus.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">{user.isSeniorCitizen ? "✅" : "—"}</td>
                    <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>
                      {user.createdAt ? new Date(String(user.createdAt)).toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button variant="primaryOutline" size="sm">View</Button>
                        {user.kycStatus === "pending" && (
                          <Button variant="success" size="sm">Verify KYC</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
