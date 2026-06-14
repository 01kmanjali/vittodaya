"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useFDSchemes, useCreateFDScheme, useUpdateFDScheme, useDeleteFDScheme,
  type FDScheme,
} from "@/lib/queries/useFDSchemes";
import { Button } from "@/components/ui/button";
import {
  Plus, Pencil, Trash2, X, Loader2, Search, ChevronUp, ChevronDown,
  LayoutGrid, AlertTriangle, CheckCircle,
} from "lucide-react";

// ─── constants ────────────────────────────────────────────────────────────────

const BANK_TYPES   = ["Bank", "NBFC", "Post Office", "Corporate"];
const COMPOUNDING  = ["Monthly", "Quarterly", "Half-Yearly", "Yearly", "At Maturity"];
const RATING_AGENCIES = ["CRISIL", "ICRA", "CARE", "India Ratings", "Brickwork", "—"];

const EMPTY_SCHEME: Partial<FDScheme> = {
  bankName: "", schemeName: "", bankType: "Bank", slug: "",
  minAmount: 10000, maxAmount: undefined,
  tenureRates: [],
  compoundingFrequency: "Quarterly",
  prematureWithdrawal: false, loanAgainstFD: false,
  autoRenewal: false, taxSaverFD: false,
  rating: "", ratingAgency: "CRISIL",
  tags: [], isActive: true, featuredOrder: undefined,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── small helpers ────────────────────────────────────────────────────────────

function getMaxRate(scheme: FDScheme, senior = false) {
  if (!scheme.tenureRates?.length) return 0;
  return Math.max(...scheme.tenureRates.map(r => senior ? (r.seniorRate ?? r.regularRate) : r.regularRate));
}

function Badge({ active }: { active: boolean }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-200"}`}>
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

// ─── scheme form ──────────────────────────────────────────────────────────────

function SchemeForm({
  initial, onSubmit, loading,
}: {
  initial: Partial<FDScheme>;
  onSubmit: (data: Partial<FDScheme>) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<Partial<FDScheme>>(initial);
  const [tenureRows, setTenureRows] = useState(
    initial.tenureRates?.length
      ? initial.tenureRates
      : [{ tenureMonths: 12, tenureLabel: "12 Months", regularRate: 7.0, seniorRate: 7.5 }]
  );
  const [tagInput, setTagInput] = useState((initial.tags ?? []).join(", "));
  const [error, setError] = useState("");

  const set = (k: keyof FDScheme, v: unknown) => {
    setForm(f => {
      const next = { ...f, [k]: v };
      if (k === "schemeName" && !initial._id) next.slug = slugify(String(v));
      return next;
    });
  };

  function addTenureRow() {
    setTenureRows(r => [...r, { tenureMonths: 12, tenureLabel: "12 Months", regularRate: 7.0, seniorRate: 7.5 }]);
  }
  function removeTenureRow(i: number) {
    setTenureRows(r => r.filter((_, idx) => idx !== i));
  }
  function updateTenure(i: number, key: string, val: string | number) {
    setTenureRows(r => r.map((row, idx) => {
      if (idx !== i) return row;
      const next = { ...row, [key]: val };
      if (key === "tenureMonths") next.tenureLabel = `${val} Month${Number(val) !== 1 ? "s" : ""}`;
      return next;
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.bankName?.trim())  { setError("Bank / Institution name is required"); return; }
    if (!form.schemeName?.trim()){ setError("Scheme name is required"); return; }
    if (!form.slug?.trim())      { setError("Slug is required"); return; }
    if (!tenureRows.length)      { setError("Add at least one tenure rate"); return; }
    onSubmit({
      ...form,
      tenureRates: tenureRows.map(r => ({
        ...r,
        tenureMonths: Number(r.tenureMonths),
        regularRate:  Number(r.regularRate),
        seniorRate:   Number(r.seniorRate),
      })),
      tags: tagInput.split(",").map(t => t.trim()).filter(Boolean),
    });
  }

  const inp = "w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400";
  const style = { borderColor: "var(--border)" };
  const lbl = "text-xs font-medium mb-1 block text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={lbl}>Bank / Institution Name *</label>
          <input className={inp} style={style} value={form.bankName ?? ""} onChange={e => set("bankName", e.target.value)} placeholder="e.g. HDFC Bank" />
        </div>
        <div>
          <label className={lbl}>Scheme Name *</label>
          <input className={inp} style={style} value={form.schemeName ?? ""} onChange={e => set("schemeName", e.target.value)} placeholder="e.g. Regular FD" />
        </div>
        <div>
          <label className={lbl}>Slug *</label>
          <input className={inp} style={style} value={form.slug ?? ""} onChange={e => set("slug", e.target.value)} placeholder="hdfc-regular-fd" />
        </div>
        <div>
          <label className={lbl}>Bank Type</label>
          <select className={inp} style={style} value={form.bankType ?? "Bank"} onChange={e => set("bankType", e.target.value)}>
            {BANK_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Compounding Frequency</label>
          <select className={inp} style={style} value={form.compoundingFrequency ?? "Quarterly"} onChange={e => set("compoundingFrequency", e.target.value)}>
            {COMPOUNDING.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={lbl}>Min Amount (₹) *</label>
          <input type="number" className={inp} style={style} value={form.minAmount ?? ""} onChange={e => set("minAmount", Number(e.target.value))} />
        </div>
        <div>
          <label className={lbl}>Max Amount (₹)</label>
          <input type="number" className={inp} style={style} value={form.maxAmount ?? ""} onChange={e => set("maxAmount", e.target.value ? Number(e.target.value) : undefined)} placeholder="No limit" />
        </div>
      </div>

      {/* Rating */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Rating</label>
          <input className={inp} style={style} value={form.rating ?? ""} onChange={e => set("rating", e.target.value)} placeholder="e.g. AAA, AA+" />
        </div>
        <div>
          <label className={lbl}>Rating Agency</label>
          <select className={inp} style={style} value={form.ratingAgency ?? "CRISIL"} onChange={e => set("ratingAgency", e.target.value)}>
            {RATING_AGENCIES.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Tenure rates */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={lbl + " mb-0"}>Tenure & Interest Rates *</label>
          <button type="button" onClick={addTenureRow}
            className="text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            style={{ color: "var(--primary)" }}>
            <Plus className="h-3 w-3" /> Add Tenure
          </button>
        </div>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--bg-light)" }}>
                {["Months", "Label", "Regular Rate %", "Senior Rate %", ""].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {tenureRows.map((row, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-2 py-1.5">
                    <input type="number" value={row.tenureMonths} onChange={e => updateTenure(i, "tenureMonths", e.target.value)}
                      className="w-16 border rounded-lg px-2 py-1 text-xs outline-none" style={style} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input value={row.tenureLabel} onChange={e => updateTenure(i, "tenureLabel", e.target.value)}
                      className="w-28 border rounded-lg px-2 py-1 text-xs outline-none" style={style} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="number" step="0.01" value={row.regularRate} onChange={e => updateTenure(i, "regularRate", e.target.value)}
                      className="w-20 border rounded-lg px-2 py-1 text-xs outline-none" style={style} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="number" step="0.01" value={row.seniorRate} onChange={e => updateTenure(i, "seniorRate", e.target.value)}
                      className="w-20 border rounded-lg px-2 py-1 text-xs outline-none" style={style} />
                  </td>
                  <td className="px-2 py-1.5">
                    <button type="button" onClick={() => removeTenureRow(i)} className="text-red-400 hover:text-red-600 p-0.5">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {!tenureRows.length && (
                <tr><td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">No tenures added</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature flags */}
      <div>
        <label className={lbl}>Features</label>
        <div className="grid grid-cols-2 gap-2">
          {([
            ["prematureWithdrawal", "Premature Withdrawal"],
            ["loanAgainstFD",       "Loan Against FD"],
            ["autoRenewal",         "Auto Renewal"],
            ["taxSaverFD",          "Tax Saver FD (80C)"],
          ] as [keyof FDScheme, string][]).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: "var(--border)" }}>
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>{label}</span>
              <Toggle checked={!!form[k]} onChange={v => set(k, v)} />
            </div>
          ))}
        </div>
      </div>

      {/* Tags + order + active */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Tags (comma separated)</label>
          <input className={inp} style={style} value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="popular, senior, tax-saver" />
        </div>
        <div>
          <label className={lbl}>Featured Order</label>
          <input type="number" className={inp} style={style} value={form.featuredOrder ?? ""} onChange={e => set("featuredOrder", e.target.value ? Number(e.target.value) : undefined)} placeholder="1 = first" />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: "var(--border)" }}>
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Active (visible to users)</span>
        <Toggle checked={!!form.isActive} onChange={v => set("isActive", v)} />
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>}

      <div className="flex gap-3 pt-1">
        <Button type="submit" variant="primary" size="md" className="flex-1" disabled={loading}>
          {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> Saving…</> : initial._id ? "Update Scheme" : "Create Scheme"}
        </Button>
      </div>
    </form>
  );
}

// ─── delete confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ scheme, onConfirm, onCancel, loading }: {
  scheme: FDScheme; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
  return (
    <Modal title="Delete FD Scheme" onClose={onCancel}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">This action cannot be undone.</p>
            <p className="text-sm text-red-700 mt-1">
              Are you sure you want to delete <strong>{scheme.bankName} — {scheme.schemeName}</strong>?
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="danger" size="md" className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />Deleting…</> : "Yes, Delete"}
          </Button>
          <Button variant="neutral" size="md" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminFDSchemesPage() {
  const qc = useQueryClient();
  const { data: schemes = [], isLoading } = useFDSchemes({ all: "true" } as never);
  const createMut = useCreateFDScheme();
  const updateMut = useUpdateFDScheme();
  const deleteMut = useDeleteFDScheme();

  const [search,     setSearch]     = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterActive, setFilterActive] = useState("All");
  const [sortField,  setSortField]  = useState<"bankName" | "minAmount" | "rate">("bankName");
  const [sortDir,    setSortDir]    = useState<"asc" | "desc">("asc");
  const [modal,      setModal]      = useState<"add" | "edit" | "delete" | null>(null);
  const [selected,   setSelected]   = useState<FDScheme | null>(null);
  const [toast,      setToast]      = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function openEdit(s: FDScheme)   { setSelected(s); setModal("edit"); }
  function openDelete(s: FDScheme) { setSelected(s); setModal("delete"); }
  function closeModal()            { setModal(null); setSelected(null); }

  async function handleToggleActive(s: FDScheme) {
    await updateMut.mutateAsync({ id: s._id!, body: { isActive: !s.isActive } });
    showToast(`${s.bankName} ${!s.isActive ? "enabled" : "disabled"}`);
  }

  async function handleCreate(data: Partial<FDScheme>) {
    await createMut.mutateAsync(data);
    closeModal();
    showToast("Scheme created successfully");
  }

  async function handleUpdate(data: Partial<FDScheme>) {
    await updateMut.mutateAsync({ id: selected!._id!, body: data });
    closeModal();
    showToast("Scheme updated successfully");
  }

  async function handleDelete() {
    await deleteMut.mutateAsync(selected!._id!);
    closeModal();
    showToast("Scheme deleted");
  }

  // Filter + sort
  const filtered = schemes
    .filter(s => {
      const q = search.toLowerCase();
      if (q && !s.bankName.toLowerCase().includes(q) && !s.schemeName.toLowerCase().includes(q)) return false;
      if (filterType !== "All" && s.bankType !== filterType) return false;
      if (filterActive === "Active" && !s.isActive) return false;
      if (filterActive === "Inactive" && s.isActive) return false;
      return true;
    })
    .sort((a, b) => {
      let av: number | string, bv: number | string;
      if (sortField === "rate")      { av = getMaxRate(a); bv = getMaxRate(b); }
      else if (sortField === "minAmount") { av = a.minAmount; bv = b.minAmount; }
      else                           { av = a.bankName; bv = b.bankName; }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  function SortBtn({ field, label }: { field: typeof sortField; label: string }) {
    const active = sortField === field;
    return (
      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors"
        onClick={() => { if (active) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortField(field); setSortDir("asc"); } }}>
        {label}
        {active ? (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : null}
      </button>
    );
  }

  const stats = [
    { label: "Total Schemes",      value: schemes.length },
    { label: "Active",             value: schemes.filter(s => s.isActive).length },
    { label: "Tax Saver",          value: schemes.filter(s => s.taxSaverFD).length },
    { label: "Best Rate",          value: schemes.length ? `${Math.max(...schemes.map(s => getMaxRate(s))).toFixed(2)}%` : "—" },
  ];

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-white border shadow-lg text-sm font-medium" style={{ borderColor: "var(--border)" }}>
          <CheckCircle className="h-4 w-4 text-green-600" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>FD Schemes</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">Manage fixed deposit schemes from partner institutions</p>
        </div>
        <Button variant="primary" size="md" className="gap-2" onClick={() => setModal("add")}>
          <Plus className="h-4 w-4" /> Add Scheme
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="text-xl font-bold" style={{ color: "var(--primary)" }}>{s.value}</div>
            <div className="text-xs mt-0.5 text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-48 border rounded-xl px-3 py-2 bg-white" style={{ borderColor: "var(--border)" }}>
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by bank or scheme…" className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm outline-none bg-white" style={{ borderColor: "var(--border)" }}>
          <option value="All">All Types</option>
          {BANK_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterActive} onChange={e => setFilterActive(e.target.value)}
          className="border rounded-xl px-3 py-2 text-sm outline-none bg-white" style={{ borderColor: "var(--border)" }}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "var(--bg-light)" }} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {!filtered.length ? (
            <div className="py-16 text-center">
              <LayoutGrid className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-sm font-medium text-muted-foreground">No schemes found</p>
              <Button variant="primary" size="sm" className="mt-4 gap-1.5" onClick={() => setModal("add")}>
                <Plus className="h-3.5 w-3.5" /> Add First Scheme
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--bg-light)" }}>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <SortBtn field="bankName" label="Institution" />
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <SortBtn field="rate" label="Best Rate" />
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Senior Rate</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <SortBtn field="minAmount" label="Min Amount" />
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tenures</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {filtered.map(scheme => (
                    <tr key={scheme._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{scheme.bankName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{scheme.schemeName}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{scheme.bankType}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-green-600">{getMaxRate(scheme).toFixed(2)}%</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-amber-600">{getMaxRate(scheme, true).toFixed(2)}%</span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">₹{scheme.minAmount.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {scheme.tenureRates?.slice(0, 4).map(r => (
                            <span key={r.tenureMonths} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{r.tenureLabel}</span>
                          ))}
                          {(scheme.tenureRates?.length ?? 0) > 4 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">+{scheme.tenureRates.length - 4}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {scheme.rating ? (
                          <span className="font-semibold text-green-700">{scheme.rating}
                            <span className="font-normal text-muted-foreground text-xs ml-1">({scheme.ratingAgency})</span>
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {scheme.taxSaverFD && <span className="text-xs px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">Tax Saver</span>}
                          {scheme.loanAgainstFD && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">Loan</span>}
                          {scheme.prematureWithdrawal && <span className="text-xs px-1.5 py-0.5 rounded bg-orange-50 text-orange-700">Premature</span>}
                          {scheme.autoRenewal && <span className="text-xs px-1.5 py-0.5 rounded bg-teal-50 text-teal-700">Auto Renew</span>}
                        </div>
                      </td>
                      <td className="px-5 py-4"><Badge active={scheme.isActive} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Button variant="primaryOutline" size="sm" className="h-7 px-2.5" onClick={() => openEdit(scheme)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant={scheme.isActive ? "dangerOutline" : "success"}
                            size="sm" className="h-7 px-2.5 text-xs"
                            onClick={() => handleToggleActive(scheme)}
                            disabled={updateMut.isPending}
                          >
                            {scheme.isActive ? "Disable" : "Enable"}
                          </Button>
                          <Button variant="dangerOutline" size="sm" className="h-7 px-2.5" onClick={() => openDelete(scheme)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {modal === "add" && (
        <Modal title="Add FD Scheme" onClose={closeModal}>
          <SchemeForm initial={EMPTY_SCHEME} onSubmit={handleCreate} loading={createMut.isPending} />
        </Modal>
      )}
      {modal === "edit" && selected && (
        <Modal title={`Edit — ${selected.bankName}`} onClose={closeModal}>
          <SchemeForm initial={selected} onSubmit={handleUpdate} loading={updateMut.isPending} />
        </Modal>
      )}
      {modal === "delete" && selected && (
        <DeleteConfirm scheme={selected} onConfirm={handleDelete} onCancel={closeModal} loading={deleteMut.isPending} />
      )}
    </div>
  );
}
