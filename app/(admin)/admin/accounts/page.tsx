"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  UserPlus, Pencil, Trash2, X, Loader2, Search, ShieldCheck,
  KeyRound, ShieldOff, ShieldAlert, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  ROLE_LABELS, ROLE_COLORS, ADMIN_ROLES,
  isSuperAdmin, type AdminRole,
} from "@/lib/permissions";

// ─── types ────────────────────────────────────────────────────────────────────

interface AdminAccount {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: "active" | "inactive";
  lastLogin?: string;
  createdAt: string;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchAdmins(): Promise<AdminAccount[]> {
  const res = await fetch("/api/admin/accounts");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch accounts");
  return data.admins;
}

async function createAdmin(body: {
  name: string; email: string; phone: string; password: string; role: AdminRole;
}): Promise<AdminAccount> {
  const res = await fetch("/api/admin/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create account");
  return data.admin;
}

async function updateAdmin({ id, body }: { id: string; body: Partial<AdminAccount> }): Promise<AdminAccount> {
  const res = await fetch(`/api/admin/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update account");
  return data.admin;
}

async function deleteAdmin(id: string): Promise<void> {
  const res = await fetch(`/api/admin/accounts/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete account");
}

async function resetPassword({ id, password }: { id: string; password: string }): Promise<void> {
  const res = await fetch(`/api/admin/accounts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to reset password");
}

// ─── helpers ──────────────────────────────────────────────────────────────────

const SELECTABLE_ROLES: AdminRole[] = ["super-admin", "support-admin", "operation-admin", "auditor"];

const ROLE_DESCRIPTIONS: Record<string, string> = {
  "super-admin":     "Full access — manages all pages, config, and other admin accounts.",
  "support-admin":   "Handles users, applications, news & FAQs. No product or config access.",
  "operation-admin": "Manages FD schemes, banks, loans, applications. No config or accounts.",
  "auditor":         "Read-only access to applications, users, FD schemes, and financials.",
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  "super-admin":     ShieldCheck,
  "support-admin":   ShieldAlert,
  "operation-admin": ShieldAlert,
  "auditor":         ShieldOff,
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${ROLE_COLORS[role] ?? "bg-gray-100 text-gray-700"}`}>
      {ROLE_LABELS[role] ?? role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-200"}`}>
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-8 px-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ─── Create / Edit form ───────────────────────────────────────────────────────

function AccountFormModal({
  initial, onClose, onSave, saving,
}: {
  initial?: AdminAccount;
  onClose: () => void;
  onSave: (data: { name: string; email: string; phone: string; password: string; role: AdminRole }) => void;
  saving: boolean;
}) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [role, setRole] = useState<AdminRole>(initial?.role ?? "support-admin");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Name, email, and phone are required.");
      return;
    }
    if (!isEdit && (!password || password.length < 8)) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    onSave({ name: name.trim(), email: email.trim(), phone: phone.trim(), password, role });
  }

  return (
    <Modal title={isEdit ? "Edit Admin Account" : "Create Admin Account"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Full Name *</label>
            <input className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
              style={{ borderColor: "var(--border)" }} value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Phone *</label>
            <input className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
              style={{ borderColor: "var(--border)" }} value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Email Address *</label>
          <input type="email" className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
            style={{ borderColor: "var(--border)" }} value={email} onChange={e => setEmail(e.target.value)}
            placeholder="john@company.com" disabled={isEdit} />
          {isEdit && <p className="text-xs mt-1 text-muted-foreground">Email cannot be changed after account creation.</p>}
        </div>

        {!isEdit && (
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Password *</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"}
                className="w-full border rounded-xl px-3 py-2 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-400"
                style={{ borderColor: "var(--border)" }} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>Role *</label>
          <div className="space-y-2">
            {SELECTABLE_ROLES.map(r => {
              const Icon = ROLE_ICONS[r] ?? ShieldCheck;
              return (
                <label key={r} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${role === r ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                  style={{ borderColor: role === r ? undefined : "var(--border)" }}>
                  <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon className="h-3.5 w-3.5" style={{ color: role === r ? "#2563eb" : "var(--text-secondary)" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{ROLE_LABELS[r]}</span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{ROLE_DESCRIPTIONS[r]}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
          <Button type="submit" variant="primary" size="md" disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Account"}
          </Button>
          <Button type="button" variant="neutral" size="md" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Password Reset modal ─────────────────────────────────────────────────────

function ResetPasswordModal({ account, onClose, onSave, saving }: {
  account: AdminAccount; onClose: () => void;
  onSave: (pw: string) => void; saving: boolean;
}) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  return (
    <Modal title={`Reset Password — ${account.name}`} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Set a new password for <strong style={{ color: "var(--text-primary)" }}>{account.email}</strong>.
          The user will need to log in again.
        </p>
        <div>
          <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>New Password</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"}
              className="w-full border rounded-xl px-3 py-2 pr-10 text-sm outline-none focus:ring-1 focus:ring-blue-400"
              style={{ borderColor: "var(--border)" }}
              value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="primary" size="md" disabled={saving || password.length < 8}
            onClick={() => onSave(password)} className="gap-2">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Reset Password
          </Button>
          <Button type="button" variant="neutral" size="md" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────

function DeleteModal({ account, onClose, onConfirm, deleting }: {
  account: AdminAccount; onClose: () => void; onConfirm: () => void; deleting: boolean;
}) {
  return (
    <Modal title="Delete Admin Account" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{account.name}</strong>&apos;s account
          ({account.email})? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="danger" size="md" onClick={onConfirm} disabled={deleting} className="gap-2">
            {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete Account
          </Button>
          <Button type="button" variant="neutral" size="md" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Access denied guard ──────────────────────────────────────────────────────

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShieldOff className="h-12 w-12 mb-4 text-red-400" />
      <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Access Denied</h2>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Only Super Admins can manage admin accounts.
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminAccountsPage() {
  const { data: session } = useSession();
  const currentRole = session?.user?.role ?? "";
  const qc = useQueryClient();

  if (!isSuperAdmin(currentRole)) return <AccessDenied />;

  const { data: admins = [], isLoading } = useQuery<AdminAccount[]>({
    queryKey: ["admin-accounts"],
    queryFn: fetchAdmins,
  });

  const createMut = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-accounts"] }),
  });
  const updateMut = useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-accounts"] }),
  });
  const deleteMut = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-accounts"] }),
  });
  const resetMut = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-accounts"] }),
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [resetTarget, setResetTarget] = useState<AdminAccount | null>(null);

  const filtered = admins.filter(a => {
    const matchSearch = !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || a.role === roleFilter;
    return matchSearch && matchRole;
  });

  async function handleCreate(data: Parameters<typeof createAdmin>[0]) {
    try {
      await createMut.mutateAsync(data);
      toast.success(`Admin account created for ${data.name}.`);
      setFormOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create account.");
    }
  }

  async function handleUpdate(data: Parameters<typeof createAdmin>[0]) {
    if (!editTarget) return;
    try {
      await updateMut.mutateAsync({ id: editTarget._id, body: { name: data.name, phone: data.phone, role: data.role } });
      toast.success("Account updated.");
      setEditTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update account.");
    }
  }

  async function handleToggleStatus(account: AdminAccount) {
    const next = account.status === "active" ? "inactive" : "active";
    try {
      await updateMut.mutateAsync({ id: account._id, body: { status: next } });
      toast.success(`${account.name} ${next === "active" ? "enabled" : "disabled"}.`);
    } catch {
      toast.error("Failed to update status.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget._id);
      toast.success(`${deleteTarget.name}'s account deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete account.");
    }
  }

  async function handleResetPassword(pw: string) {
    if (!resetTarget) return;
    try {
      await resetMut.mutateAsync({ id: resetTarget._id, password: pw });
      toast.success(`Password reset for ${resetTarget.name}.`);
      setResetTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reset password.");
    }
  }

  const stats = [
    { label: "Total Admins", value: admins.length },
    { label: "Active", value: admins.filter(a => a.status === "active").length },
    { label: "Super Admins", value: admins.filter(a => a.role === "super-admin" || a.role === "admin").length },
    { label: "Auditors", value: admins.filter(a => a.role === "auditor").length },
  ];

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Admin Accounts</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage admin team access and roles — {admins.length} account{admins.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="primary" size="md" className="gap-2" onClick={() => { setEditTarget(null); setFormOpen(true); }}>
          <UserPlus className="h-4 w-4" /> Create Admin
        </Button>
      </div>

      {/* stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* role cards — quick overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {SELECTABLE_ROLES.map(r => {
          const Icon = ROLE_ICONS[r] ?? ShieldCheck;
          return (
            <div key={r} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{ROLE_LABELS[r]}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{ROLE_DESCRIPTIONS[r]}</p>
            </div>
          );
        })}
      </div>

      {/* search + filter */}
      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-5 flex flex-wrap items-center gap-3" style={{ borderColor: "var(--border)" }}>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search by name or email…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-8 pr-4 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border)" }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...SELECTABLE_ROLES].map(r => (
            <Button key={r} type="button" size="sm" variant={roleFilter === r ? "primary" : "neutral"}
              className="rounded-full text-xs" onClick={() => setRoleFilter(r)}>
              {r === "All" ? "All Roles" : ROLE_LABELS[r]}
            </Button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="px-5 py-3 border-b text-sm" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          {isLoading ? "Loading…" : <><strong>{filtered.length}</strong> admin account{filtered.length !== 1 ? "s" : ""}</>}
        </div>

        {isLoading && (
          <div className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 px-5 flex items-center gap-4 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-40" />
                  <div className="h-2.5 bg-gray-100 rounded w-56" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="px-5 py-8 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
            {search || roleFilter !== "All" ? "No accounts match your filters." : "No admin accounts yet. Create the first one."}
          </p>
        )}

        <div className="divide-y">
          {filtered.map(account => {
            const initials = account.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
            const isCurrentUser = account._id === session?.user?.id;

            return (
              <div key={account._id}
                className={`px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${account.status === "inactive" ? "opacity-60" : ""}`}>
                {/* avatar */}
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 select-none"
                  style={{ background: "var(--primary)" }}>
                  {initials}
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{account.name}</span>
                    {isCurrentUser && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">You</span>
                    )}
                    <RoleBadge role={account.role} />
                    <StatusBadge status={account.status} />
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
                    {account.email} · {account.phone}
                    {account.lastLogin && ` · Last login ${new Date(account.lastLogin).toLocaleDateString("en-IN")}`}
                  </p>
                </div>

                {/* actions — disabled for self */}
                {!isCurrentUser && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Toggle
                      checked={account.status === "active"}
                      onChange={() => handleToggleStatus(account)}
                    />
                    <Button type="button" variant="primaryOutline" size="sm" className="gap-1"
                      onClick={() => setEditTarget(account)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" variant="neutral" size="sm" className="gap-1"
                      onClick={() => setResetTarget(account)} title="Reset password">
                      <KeyRound className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" variant="dangerOutline" size="sm"
                      onClick={() => setDeleteTarget(account)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                {isCurrentUser && (
                  <span className="text-xs text-muted-foreground shrink-0 px-2">Your account</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* modals */}
      {formOpen && !editTarget && (
        <AccountFormModal
          onClose={() => setFormOpen(false)}
          onSave={handleCreate}
          saving={createMut.isPending}
        />
      )}
      {editTarget && (
        <AccountFormModal
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleUpdate}
          saving={updateMut.isPending}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          account={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleteMut.isPending}
        />
      )}
      {resetTarget && (
        <ResetPasswordModal
          account={resetTarget}
          onClose={() => setResetTarget(null)}
          onSave={handleResetPassword}
          saving={resetMut.isPending}
        />
      )}
    </div>
  );
}
