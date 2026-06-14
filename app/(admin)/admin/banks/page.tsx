"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Plus, Pencil, Trash2, X, Loader2, Search, Building2, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

// ─── types ────────────────────────────────────────────────────────────────────

interface Bank {
  _id: string;
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  type: string;
  rating: string;
  ratingAgency: string;
  established: number;
  hq: string;
  description: string;
  isActive: boolean;
}

type BankForm = Omit<Bank, "_id">;

// ─── constants ────────────────────────────────────────────────────────────────

const BANK_TYPES = [
  "Small Finance Bank",
  "NBFC",
  "Corporate FD",
  "Public Sector Bank",
  "Private Bank",
];

const RATING_AGENCIES = ["CRISIL", "ICRA", "CARE", "India Ratings", "Brickwork", "—"];

const EMPTY: BankForm = {
  slug: "",
  name: "",
  shortName: "",
  logo: "",
  type: "Small Finance Bank",
  rating: "",
  ratingAgency: "CRISIL",
  established: new Date().getFullYear(),
  hq: "",
  description: "",
  isActive: true,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchAllBanks(): Promise<Bank[]> {
  const res = await fetch("/api/banks?showAll=true");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to fetch banks");
  return data.banks;
}

async function createBank(body: BankForm): Promise<Bank> {
  const res = await fetch("/api/banks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create bank");
  return data.bank;
}

async function updateBank({ id, body }: { id: string; body: Partial<BankForm> }): Promise<Bank> {
  const res = await fetch(`/api/banks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update bank");
  return data.bank;
}

async function deleteBank(id: string): Promise<void> {
  const res = await fetch(`/api/banks/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to delete bank");
}

// ─── sub-components ───────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-200"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[75vh]">{children}</div>
      </div>
    </div>,
    document.body
  );
}

function Field({
  label, name, value, onChange, type = "text", placeholder, disabled, as,
  options,
}: {
  label: string; name: string; value: string | number; type?: string;
  placeholder?: string; disabled?: boolean; as?: "select" | "textarea";
  options?: string[];
  onChange: (n: string, v: string) => void;
}) {
  const base = "w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-50";
  const style = { borderColor: "var(--border)" };
  if (as === "select") {
    return (
      <div>
        <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
        <select className={base} style={style} value={value} onChange={e => onChange(name, e.target.value)}>
          {options?.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (as === "textarea") {
    return (
      <div>
        <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
        <textarea rows={3} className={`${base} resize-none`} style={style} value={value} placeholder={placeholder}
          onChange={e => onChange(name, e.target.value)} />
      </div>
    );
  }
  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <input type={type} className={base} style={style} value={value} placeholder={placeholder}
        disabled={disabled} onChange={e => onChange(name, e.target.value)} />
    </div>
  );
}

// ─── bank form modal ──────────────────────────────────────────────────────────

function BankFormModal({
  initial, onClose, onSave, saving,
}: {
  initial: BankForm & { _id?: string };
  onClose: () => void;
  onSave: (form: BankForm, id?: string) => void;
  saving: boolean;
}) {
  const isEdit = !!initial._id;
  const [form, setForm] = useState<BankForm>({
    slug: initial.slug,
    name: initial.name,
    shortName: initial.shortName,
    logo: initial.logo,
    type: initial.type,
    rating: initial.rating,
    ratingAgency: initial.ratingAgency,
    established: initial.established,
    hq: initial.hq,
    description: initial.description,
    isActive: initial.isActive,
  });

  function set(name: string, value: string) {
    setForm(prev => {
      const next = { ...prev, [name]: name === "established" ? Number(value) : value };
      if (name === "name" && !isEdit) next.slug = slugify(value);
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.slug || !form.name || !form.shortName || !form.type) {
      toast.error("Slug, name, short name, and type are required.");
      return;
    }
    onSave(form, initial._id);
  }

  return (
    <Modal title={isEdit ? "Edit Institution" : "Add Institution"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name *" name="name" value={form.name} onChange={set} placeholder="e.g. Ujjivan Small Finance Bank" />
          <Field label="Short Name *" name="shortName" value={form.shortName} onChange={set} placeholder="e.g. Ujjivan SFB" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Slug *</label>
            <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <span className="px-3 py-2 text-xs bg-gray-50 border-r text-gray-400 select-none" style={{ borderColor: "var(--border)" }}>id/</span>
              <input
                className="flex-1 px-3 py-2 text-sm outline-none font-mono"
                value={form.slug}
                onChange={e => set("slug", slugify(e.target.value))}
                placeholder="ujjivan-sfb"
              />
            </div>
          </div>
          <Field label="Type *" name="type" value={form.type} onChange={set} as="select" options={BANK_TYPES} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Credit Rating" name="rating" value={form.rating} onChange={set} placeholder="e.g. AA+" />
          <Field label="Rating Agency" name="ratingAgency" value={form.ratingAgency} onChange={set} as="select" options={RATING_AGENCIES} />
          <Field label="Est. Year" name="established" value={form.established} type="number" onChange={set} placeholder="1994" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Headquarters" name="hq" value={form.hq} onChange={set} placeholder="e.g. Mumbai" />
          <Field label="Logo URL" name="logo" value={form.logo} onChange={set} placeholder="/banks/logo.png" />
        </div>
        <Field label="Description" name="description" value={form.description} onChange={set} as="textarea" placeholder="Brief description of the institution…" />

        <div className="flex items-center gap-3 pt-1">
          <Toggle checked={form.isActive} onChange={v => setForm(p => ({ ...p, isActive: v }))} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Active (visible to users)</span>
        </div>

        <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
          <Button type="submit" variant="primary" size="md" disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Institution"}
          </Button>
          <Button type="button" variant="neutral" size="md" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── delete confirm modal ─────────────────────────────────────────────────────

function DeleteModal({ bank, onClose, onConfirm, deleting }: {
  bank: Bank; onClose: () => void; onConfirm: () => void; deleting: boolean;
}) {
  return (
    <Modal title="Delete Institution" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{bank.name}</strong>?
          This cannot be undone and will remove all FD scheme associations.
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="danger" size="md" onClick={onConfirm} disabled={deleting} className="gap-2">
            {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete
          </Button>
          <Button type="button" variant="neutral" size="md" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminBanksPage() {
  const qc = useQueryClient();

  const { data: banks = [], isLoading } = useQuery<Bank[]>({
    queryKey: ["banks-admin"],
    queryFn: fetchAllBanks,
  });

  const createMut = useMutation({
    mutationFn: createBank,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["banks-admin"] }); qc.invalidateQueries({ queryKey: ["banks"] }); },
  });
  const updateMut = useMutation({
    mutationFn: updateBank,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["banks-admin"] }); qc.invalidateQueries({ queryKey: ["banks"] }); },
  });
  const deleteMut = useMutation({
    mutationFn: deleteBank,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["banks-admin"] }); qc.invalidateQueries({ queryKey: ["banks"] }); },
  });

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Bank | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Bank | null>(null);

  const filtered = banks.filter(b => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.shortName.toLowerCase().includes(search.toLowerCase()) || b.slug.includes(search.toLowerCase());
    const matchType = typeFilter === "All" || b.type === typeFilter;
    const matchStatus = statusFilter === "All" || (statusFilter === "Active" ? b.isActive : !b.isActive);
    return matchSearch && matchType && matchStatus;
  });

  async function handleSave(form: BankForm, id?: string) {
    try {
      if (id) {
        await updateMut.mutateAsync({ id, body: form });
        toast.success("Institution updated successfully.");
      } else {
        await createMut.mutateAsync(form);
        toast.success("Institution added successfully.");
      }
      setFormOpen(false);
      setEditTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save institution.");
    }
  }

  async function handleToggle(bank: Bank) {
    try {
      await updateMut.mutateAsync({ id: bank._id, body: { isActive: !bank.isActive } });
      toast.success(`${bank.name} ${!bank.isActive ? "enabled" : "disabled"}.`);
    } catch {
      toast.error("Failed to update status.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget._id);
      toast.success(`${deleteTarget.name} deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete institution.");
    }
  }

  const stats = [
    { label: "Total Partners", value: banks.length },
    { label: "Active", value: banks.filter(b => b.isActive).length },
    { label: "Small Finance Banks", value: banks.filter(b => b.type === "Small Finance Bank").length },
    { label: "NBFCs", value: banks.filter(b => b.type === "NBFC").length },
  ];

  function typeColor(type: string) {
    const map: Record<string, string> = {
      "Small Finance Bank": "#eff6ff|#1d4ed8",
      "NBFC": "#fef3c7|#d97706",
      "Corporate FD": "#f3e8ff|#7c3aed",
      "Public Sector Bank": "#dcfce7|#16a34a",
      "Private Bank": "#fce7f3|#be185d",
    };
    const [bg, text] = (map[type] ?? "#f1f5f9|#475569").split("|");
    return { background: bg, color: text };
  }

  const saving = createMut.isPending || updateMut.isPending;

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Banks & NBFCs</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage partner institutions — {banks.length} total
          </p>
        </div>
        <Button variant="primary" size="md" className="gap-2" onClick={() => { setEditTarget(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Institution
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

      {/* filters */}
      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-5 flex flex-wrap items-center gap-3" style={{ borderColor: "var(--border)" }}>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search institutions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-8 pr-4 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...BANK_TYPES].map(t => (
            <Button key={t} type="button" size="sm" variant={typeFilter === t ? "primary" : "neutral"}
              className="rounded-full text-xs" onClick={() => setTypeFilter(t)}>
              {t}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {["All", "Active", "Inactive"].map(s => (
            <Button key={s} type="button" size="sm" variant={statusFilter === s ? "primary" : "neutral"}
              className="rounded-full text-xs" onClick={() => setStatusFilter(s)}>
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* loading skeleton */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-60 rounded-2xl animate-pulse" style={{ background: "var(--bg-light)" }} />
          ))}
        </div>
      )}

      {/* empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border shadow-sm p-16 text-center" style={{ borderColor: "var(--border)" }}>
          <Building2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="font-medium" style={{ color: "var(--text-primary)" }}>No institutions found</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {search || typeFilter !== "All" || statusFilter !== "All" ? "Try adjusting your filters." : "Add your first partner institution."}
          </p>
        </div>
      )}

      {/* bank cards */}
      {!isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(bank => (
            <div
              key={bank._id}
              className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col transition-opacity ${!bank.isActive ? "opacity-60" : ""}`}
              style={{ borderColor: "var(--border)" }}
            >
              {/* card header */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-base shrink-0 select-none"
                  style={{ background: "var(--primary)" }}
                >
                  {bank.logo
                    ? <img src={bank.logo} alt={bank.shortName} className="w-full h-full object-contain rounded-xl" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    : bank.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{bank.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{bank.shortName}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bank.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {bank.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={typeColor(bank.type)}>
                    {bank.type}
                  </span>
                </div>
              </div>

              {/* details grid */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                {[
                  { label: "Rating", value: bank.rating ? `${bank.rating}` : "—" },
                  { label: "Agency", value: bank.ratingAgency || "—" },
                  { label: "Est.", value: bank.established ? String(bank.established) : "—" },
                  { label: "HQ", value: bank.hq || "—" },
                  { label: "Slug", value: bank.slug },
                ].map(({ label, value }) => (
                  <div key={label} className="p-2 rounded-lg" style={{ background: "var(--bg-light)" }}>
                    <p className="text-muted-foreground">{label}</p>
                    <p className="font-semibold mt-0.5 truncate" style={{ color: "var(--text-primary)" }}>{value}</p>
                  </div>
                ))}
              </div>

              {bank.description && (
                <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                  {bank.description}
                </p>
              )}

              {/* rating badge */}
              {bank.rating && (
                <div className="flex items-center gap-1.5 mb-3">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-semibold text-green-700">{bank.rating}</span>
                  {bank.ratingAgency && bank.ratingAgency !== "—" && (
                    <span className="text-xs text-muted-foreground">by {bank.ratingAgency}</span>
                  )}
                </div>
              )}

              {/* actions */}
              <div className="flex gap-2 mt-auto pt-2">
                <Button
                  type="button" variant="primaryOutline" size="sm" className="flex-1 gap-1"
                  onClick={() => { setEditTarget(bank); setFormOpen(true); }}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  type="button" variant={bank.isActive ? "dangerOutline" : "success"} size="sm" className="flex-1"
                  onClick={() => handleToggle(bank)}
                  disabled={updateMut.isPending}
                >
                  {bank.isActive ? "Disable" : "Enable"}
                </Button>
                <Button
                  type="button" variant="dangerOutline" size="sm"
                  onClick={() => setDeleteTarget(bank)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* modals */}
      {formOpen && (
        <BankFormModal
          initial={editTarget ? { ...editTarget } : { ...EMPTY }}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
          onSave={handleSave}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          bank={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleteMut.isPending}
        />
      )}
    </div>
  );
}
