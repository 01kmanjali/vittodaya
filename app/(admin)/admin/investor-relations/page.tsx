"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  useInvestorRecords, useCreateInvestorRecord, useUpdateInvestorRecord, useDeleteInvestorRecord,
  type InvestorRecord, type IRType,
} from "@/lib/queries/useInvestorRelations";
import { Button } from "@/components/ui/button";
import {
  Plus, Pencil, Trash2, X, Loader2, Search,
  TrendingUp, FileText, Users, PieChart, Newspaper,
  ChevronUp, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { AccessDenied, ReadOnlyBanner, usePageRole } from "@/components/admin/RoleGuard";

// ─── constants ────────────────────────────────────────────────────────────────

const IR_TYPES = [
  { value: "financial_result",  label: "Financial Results", Icon: TrendingUp,  color: "#1d4ed8", bg: "#eff6ff" },
  { value: "annual_report",     label: "Annual Reports",    Icon: FileText,    color: "#059669", bg: "#f0fdf4" },
  { value: "board_member",      label: "Board of Directors",Icon: Users,       color: "#7c3aed", bg: "#fdf4ff" },
  { value: "shareholding",      label: "Shareholding",      Icon: PieChart,    color: "#b45309", bg: "#fef9c3" },
  { value: "press_release",     label: "Press Releases",    Icon: Newspaper,   color: "#0891b2", bg: "#ecfeff" },
] as const;

type TabKey = "all" | IRType;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",               label: "All Records"       },
  { key: "financial_result",  label: "Financial Results" },
  { key: "annual_report",     label: "Annual Reports"    },
  { key: "board_member",      label: "Board Members"     },
  { key: "shareholding",      label: "Shareholding"      },
  { key: "press_release",     label: "Press Releases"    },
];

const QUARTERS = ["Q1 (Apr–Jun)", "Q2 (Jul–Sep)", "Q3 (Oct–Dec)", "Q4 (Jan–Mar)"];

const TYPE_MAP = Object.fromEntries(IR_TYPES.map(t => [t.value, t]));

function fmtDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function currFY() {
  const y = new Date().getFullYear();
  return `FY ${y}-${String(y + 1).slice(2)}`;
}

// ─── sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const t = TYPE_MAP[type];
  if (!t) return null;
  const { Icon } = t;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: t.bg, color: t.color }}>
      <Icon className="h-3 w-3" />
      {t.label}
    </span>
  );
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-40 ${checked ? "bg-blue-600" : "bg-gray-200"}`}>
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 pb-8 px-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[82vh]">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ─── shared field components ──────────────────────────────────────────────────

function FieldInput({ label, value, onChange, placeholder, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
        style={{ borderColor: "var(--border)" }} />
    </div>
  );
}

function FieldSelect({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400"
        style={{ borderColor: "var(--border)" }}>
        <option value="">— Select —</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function FieldTextarea({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>{label}</label>
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400 resize-none"
        style={{ borderColor: "var(--border)" }} />
    </div>
  );
}

// ─── dynamic form by type ─────────────────────────────────────────────────────

type FormState = Omit<InvestorRecord, "_id">;

function buildEmpty(type: IRType): FormState {
  return {
    type,
    title: "",
    publishedDate: new Date().toISOString().slice(0, 10),
    year: currFY(),
    quarter: "",
    period: "",
    revenue: "",
    netProfit: "",
    npa: "",
    fileSize: "",
    resultType: "quarterly",
    name: "",
    designation: "",
    experience: "",
    qualification: "",
    bio: "",
    imageInitial: "",
    isActive: true,
    order: 0,
  };
}

function RecordFormModal({ initial, defaultType, onClose, onSave, saving }: {
  initial?: InvestorRecord;
  defaultType: IRType;
  onClose: () => void;
  onSave: (data: FormState, id?: string) => void;
  saving: boolean;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<FormState>(
    initial
      ? { ...buildEmpty(initial.type), ...initial }
      : buildEmpty(defaultType)
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(p => ({ ...p, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.publishedDate) { toast.error("Published date is required."); return; }
    if (form.type === "board_member" && !form.designation) { toast.error("Designation is required."); return; }
    onSave(form, initial?._id);
  }

  const typeInfo = TYPE_MAP[form.type];
  const { Icon } = typeInfo;

  return (
    <Modal title={isEdit ? `Edit — ${typeInfo.label}` : `Add ${typeInfo.label}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* type selector — only shown for new records */}
        {!isEdit && (
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>Record Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {IR_TYPES.map(t => {
                const TIcon = t.Icon;
                const active = form.type === t.value;
                return (
                  <button key={t.value} type="button"
                    onClick={() => setForm(buildEmpty(t.value as IRType))}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${active ? "border-blue-500" : "hover:bg-gray-50"}`}
                    style={active ? { borderColor: t.color, background: t.bg, color: t.color } : { borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    <TIcon className="h-3.5 w-3.5 shrink-0" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Financial Result fields ── */}
        {form.type === "financial_result" && (<>
          <FieldInput label="Title" value={form.title} onChange={v => set("title", v)} placeholder="e.g. Q2 FY2024-25 Results" required />
          <div className="grid grid-cols-2 gap-4">
            <FieldSelect label="Result Type" value={form.resultType ?? ""} onChange={v => set("resultType", v as "quarterly" | "annual")}
              options={[{ value: "quarterly", label: "Quarterly" }, { value: "annual", label: "Annual" }]} />
            <FieldInput label="Year" value={form.year ?? ""} onChange={v => set("year", v)} placeholder="FY 2024-25" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldSelect label="Quarter" value={form.quarter ?? ""} onChange={v => set("quarter", v)}
              options={QUARTERS.map(q => ({ value: q, label: q }))} />
            <FieldInput label="Period" value={form.period ?? ""} onChange={v => set("period", v)} placeholder="Apr–Jun 2024" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FieldInput label="Revenue" value={form.revenue ?? ""} onChange={v => set("revenue", v)} placeholder="₹ 1,234 Cr" />
            <FieldInput label="Net Profit" value={form.netProfit ?? ""} onChange={v => set("netProfit", v)} placeholder="₹ 123 Cr" />
            <FieldInput label="NPA %" value={form.npa ?? ""} onChange={v => set("npa", v)} placeholder="1.23%" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Published Date" type="date" value={form.publishedDate} onChange={v => set("publishedDate", v)} required />
            <FieldInput label="File Size" value={form.fileSize ?? ""} onChange={v => set("fileSize", v)} placeholder="2.4 MB" />
          </div>
        </>)}

        {/* ── Annual Report fields ── */}
        {form.type === "annual_report" && (<>
          <FieldInput label="Title" value={form.title} onChange={v => set("title", v)} placeholder="e.g. Annual Report 2024-25" required />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Year" value={form.year ?? ""} onChange={v => set("year", v)} placeholder="FY 2024-25" />
            <FieldInput label="Published Date" type="date" value={form.publishedDate} onChange={v => set("publishedDate", v)} required />
          </div>
          <FieldInput label="File Size" value={form.fileSize ?? ""} onChange={v => set("fileSize", v)} placeholder="e.g. 4.2 MB" />
        </>)}

        {/* ── Board Member fields ── */}
        {form.type === "board_member" && (<>
          <FieldInput label="Full Name" value={form.title} onChange={v => set("title", v)} placeholder="e.g. Mr. Rajesh Kumar" required />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Designation" value={form.designation ?? ""} onChange={v => set("designation", v)} placeholder="Managing Director" required />
            <FieldInput label="Avatar Initial" value={form.imageInitial ?? ""} onChange={v => set("imageInitial", v.slice(0, 2).toUpperCase())} placeholder="RK" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Experience" value={form.experience ?? ""} onChange={v => set("experience", v)} placeholder="25+ years" />
            <FieldInput label="Qualification" value={form.qualification ?? ""} onChange={v => set("qualification", v)} placeholder="MBA, CA" />
          </div>
          <FieldTextarea label="Bio / Profile" value={form.bio ?? ""} onChange={v => set("bio", v)} placeholder="Brief professional background…" rows={4} />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Published / Joined Date" type="date" value={form.publishedDate} onChange={v => set("publishedDate", v)} required />
            <FieldInput label="Display Order" type="number" value={String(form.order ?? 0)} onChange={v => set("order", Number(v))} />
          </div>
        </>)}

        {/* ── Shareholding fields ── */}
        {form.type === "shareholding" && (<>
          <FieldInput label="Title" value={form.title} onChange={v => set("title", v)} placeholder="e.g. Shareholding Pattern Q2 FY25" required />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Year" value={form.year ?? ""} onChange={v => set("year", v)} placeholder="FY 2024-25" />
            <FieldSelect label="Quarter" value={form.quarter ?? ""} onChange={v => set("quarter", v)}
              options={QUARTERS.map(q => ({ value: q, label: q }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Published Date" type="date" value={form.publishedDate} onChange={v => set("publishedDate", v)} required />
            <FieldInput label="File Size" value={form.fileSize ?? ""} onChange={v => set("fileSize", v)} placeholder="1.2 MB" />
          </div>
        </>)}

        {/* ── Press Release fields ── */}
        {form.type === "press_release" && (<>
          <FieldInput label="Title" value={form.title} onChange={v => set("title", v)} placeholder="e.g. Vittodaya raises ₹500Cr…" required />
          <div className="grid grid-cols-2 gap-4">
            <FieldInput label="Published Date" type="date" value={form.publishedDate} onChange={v => set("publishedDate", v)} required />
            <FieldInput label="File Size" value={form.fileSize ?? ""} onChange={v => set("fileSize", v)} placeholder="0.8 MB" />
          </div>
        </>)}

        {/* common active toggle */}
        <div className="flex items-center gap-3 pt-1">
          <Toggle checked={!!form.isActive} onChange={v => set("isActive", v)} />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Active (visible on site)</span>
        </div>

        {/* preview pill */}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs" style={{ background: "var(--bg-light)", color: "var(--text-secondary)" }}>
          <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: typeInfo.color }} />
          <span><strong style={{ color: typeInfo.color }}>{typeInfo.label}</strong>
            {form.year ? ` · ${form.year}` : ""}
            {form.quarter ? ` · ${form.quarter}` : ""}
            {!form.isActive && <span className="ml-2 text-red-500 font-semibold">● Inactive</span>}
          </span>
        </div>

        <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
          <Button type="submit" variant="primary" size="md" disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isEdit ? "Save Changes" : "Add Record"}
          </Button>
          <Button type="button" variant="neutral" size="md" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────

function DeleteModal({ record, onClose, onConfirm, deleting }: {
  record: InvestorRecord; onClose: () => void; onConfirm: () => void; deleting: boolean;
}) {
  return (
    <Modal title="Delete Record" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Delete <strong style={{ color: "var(--text-primary)" }}>&ldquo;{record.title}&rdquo;</strong>?
          This cannot be undone.
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

// ─── Section renderers ────────────────────────────────────────────────────────

function ActionButtons({ record, canWrite, onEdit, onDelete, onToggle, busy }: {
  record: InvestorRecord; canWrite: boolean;
  onEdit: () => void; onDelete: () => void;
  onToggle: () => void; busy: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Toggle checked={!!record.isActive} onChange={onToggle} disabled={!canWrite || busy} />
      <Button type="button" variant="primaryOutline" size="sm" disabled={!canWrite} onClick={onEdit}>
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button type="button" variant="dangerOutline" size="sm" disabled={!canWrite} onClick={onDelete}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// Financial results table
function FinancialTable({ records, canWrite, onEdit, onDelete, onToggle, busy }: {
  records: InvestorRecord[]; canWrite: boolean;
  onEdit: (r: InvestorRecord) => void; onDelete: (r: InvestorRecord) => void;
  onToggle: (r: InvestorRecord) => void; busy: boolean;
}) {
  if (!records.length) return <EmptyState label="No financial results yet." />;
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--bg-light)" }}>
              {["Title", "Type", "Year", "Quarter", "Revenue", "Net Profit", "NPA%", "Date", "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: "var(--text-secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {records.map(r => (
              <tr key={r._id} className={`hover:bg-gray-50 transition-colors ${!r.isActive ? "opacity-60" : ""}`}>
                <td className="px-4 py-3 font-medium max-w-xs" style={{ color: "var(--text-primary)" }}>
                  <p className="line-clamp-1">{r.title}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.resultType === "annual" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                    {r.resultType === "annual" ? "Annual" : "Quarterly"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{r.year || "—"}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{r.quarter || "—"}</td>
                <td className="px-4 py-3 text-xs font-medium whitespace-nowrap text-green-700">{r.revenue || "—"}</td>
                <td className="px-4 py-3 text-xs font-medium whitespace-nowrap text-blue-700">{r.netProfit || "—"}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap text-amber-700">{r.npa || "—"}</td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{fmtDate(r.publishedDate)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`text-xs font-medium ${r.isActive ? "text-green-700" : "text-red-500"}`}>
                    {r.isActive ? "Live" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ActionButtons record={r} canWrite={canWrite} onEdit={() => onEdit(r)} onDelete={() => onDelete(r)} onToggle={() => onToggle(r)} busy={busy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Annual reports grid
function AnnualReportsGrid({ records, canWrite, onEdit, onDelete, onToggle, busy }: {
  records: InvestorRecord[]; canWrite: boolean;
  onEdit: (r: InvestorRecord) => void; onDelete: (r: InvestorRecord) => void;
  onToggle: (r: InvestorRecord) => void; busy: boolean;
}) {
  if (!records.length) return <EmptyState label="No annual reports yet." />;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {records.map(r => (
        <div key={r._id} className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col ${!r.isActive ? "opacity-60" : ""}`}
          style={{ borderColor: "var(--border)" }}>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <p className="font-bold text-base mb-0.5" style={{ color: "var(--primary)" }}>{r.year || r.title}</p>
          <p className="text-xs mb-1 line-clamp-2 flex-1" style={{ color: "var(--text-secondary)" }}>{r.title}</p>
          {r.fileSize && (
            <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>📎 {r.fileSize}</p>
          )}
          <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>{fmtDate(r.publishedDate)}</p>
          <ActionButtons record={r} canWrite={canWrite} onEdit={() => onEdit(r)} onDelete={() => onDelete(r)} onToggle={() => onToggle(r)} busy={busy} />
        </div>
      ))}
    </div>
  );
}

// Board members grid
function BoardMembersGrid({ records, canWrite, onEdit, onDelete, onToggle, busy }: {
  records: InvestorRecord[]; canWrite: boolean;
  onEdit: (r: InvestorRecord) => void; onDelete: (r: InvestorRecord) => void;
  onToggle: (r: InvestorRecord) => void; busy: boolean;
}) {
  if (!records.length) return <EmptyState label="No board members yet." />;
  const COLORS = ["#1d4ed8","#059669","#7c3aed","#b45309","#0891b2","#be185d","#dc2626","#1e293b"];
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {records.map((m, i) => {
        const initials = m.imageInitial || m.title.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
        const color = COLORS[i % COLORS.length];
        return (
          <div key={m._id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!m.isActive ? "opacity-60" : ""}`}
            style={{ borderColor: "var(--border)" }}>
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 select-none"
                style={{ background: color }}>{initials}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{m.title}</p>
                {m.designation && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--primary)" }}>{m.designation}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                  {m.experience && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{m.experience}</span>
                  )}
                  {m.qualification && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{m.qualification}</span>
                  )}
                </div>
              </div>
            </div>
            {m.bio && (
              <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: "var(--text-secondary)" }}>{m.bio}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Since {fmtDate(m.publishedDate)}</p>
              <ActionButtons record={m} canWrite={canWrite} onEdit={() => onEdit(m)} onDelete={() => onDelete(m)} onToggle={() => onToggle(m)} busy={busy} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Generic table for shareholding & press releases
function GenericTable({ records, canWrite, onEdit, onDelete, onToggle, busy, columns }: {
  records: InvestorRecord[]; canWrite: boolean;
  onEdit: (r: InvestorRecord) => void; onDelete: (r: InvestorRecord) => void;
  onToggle: (r: InvestorRecord) => void; busy: boolean;
  columns: { label: string; render: (r: InvestorRecord) => React.ReactNode }[];
}) {
  if (!records.length) return <EmptyState label="No records yet." />;
  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--bg-light)" }}>
              {[...columns.map(c => c.label), "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{ color: "var(--text-secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {records.map(r => (
              <tr key={r._id} className={`hover:bg-gray-50 transition-colors ${!r.isActive ? "opacity-60" : ""}`}>
                {columns.map(c => (
                  <td key={c.label} className="px-4 py-3">{c.render(r)}</td>
                ))}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`text-xs font-medium ${r.isActive ? "text-green-700" : "text-red-500"}`}>
                    {r.isActive ? "Live" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ActionButtons record={r} canWrite={canWrite} onEdit={() => onEdit(r)} onDelete={() => onDelete(r)} onToggle={() => onToggle(r)} busy={busy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-12 text-center" style={{ borderColor: "var(--border)" }}>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminInvestorRelationsPage() {
  const { canView, canWrite } = usePageRole("investor-relations");

  const { data: records = [], isLoading } = useInvestorRecords({ showAll: "true" });
  const createMut  = useCreateInvestorRecord();
  const updateMut  = useUpdateInvestorRecord();
  const deleteMut  = useDeleteInvestorRecord();

  const [tab,    setTab]    = useState<TabKey>("all");
  const [search, setSearch] = useState("");

  const [formOpen,     setFormOpen]     = useState(false);
  const [formType,     setFormType]     = useState<IRType>("financial_result");
  const [editTarget,   setEditTarget]   = useState<InvestorRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InvestorRecord | null>(null);

  if (!canView) return <AccessDenied page="Investor Relations" />;

  const byType = (t: IRType) => records.filter(r => r.type === t);
  const financialResults = byType("financial_result");
  const annualReports    = byType("annual_report");
  const boardMembers     = byType("board_member");
  const shareholding     = byType("shareholding");
  const pressReleases    = byType("press_release");

  const filtered = records.filter(r => {
    const matchTab = tab === "all" || r.type === tab;
    const matchSearch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.year ?? "").includes(search) ||
      (r.designation ?? "").toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabCounts: Record<string, number> = {
    all: records.length,
    financial_result: financialResults.length,
    annual_report:    annualReports.length,
    board_member:     boardMembers.length,
    shareholding:     shareholding.length,
    press_release:    pressReleases.length,
  };

  function openAdd(type: IRType) {
    setFormType(type);
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(record: InvestorRecord) {
    setEditTarget(record);
    setFormOpen(true);
  }

  async function handleSave(data: FormState, id?: string) {
    try {
      if (id) {
        await updateMut.mutateAsync({ id, body: data });
        toast.success("Record updated.");
      } else {
        await createMut.mutateAsync(data);
        toast.success("Record added.");
      }
      setFormOpen(false);
      setEditTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save record.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget._id);
      toast.success("Record deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete.");
    }
  }

  async function handleToggle(record: InvestorRecord) {
    try {
      await updateMut.mutateAsync({ id: record._id, body: { isActive: !record.isActive } });
      toast.success(record.isActive ? "Record hidden." : "Record activated.");
    } catch { toast.error("Failed to update."); }
  }

  const saving = createMut.isPending || updateMut.isPending;
  const busy   = updateMut.isPending;

  const sectionProps = { canWrite, onEdit: openEdit, onDelete: setDeleteTarget, onToggle: handleToggle, busy };

  return (
    <div>
      {!canWrite && <ReadOnlyBanner />}

      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Investor Relations</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage financial disclosures, annual reports, board & shareholding data — {records.length} records
          </p>
        </div>
        {canWrite && (
          <div className="flex flex-wrap gap-2">
            {IR_TYPES.map(t => {
              const { Icon } = t;
              return (
                <Button key={t.value} type="button" size="sm" variant="neutral"
                  className="gap-1.5 rounded-full"
                  onClick={() => openAdd(t.value as IRType)}>
                  <Icon className="h-3.5 w-3.5" style={{ color: t.color }} />
                  {t.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {IR_TYPES.map(t => {
          const { Icon } = t;
          return (
            <div key={t.value} className="bg-white rounded-xl border p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              style={{ borderColor: "var(--border)" }}
              onClick={() => setTab(t.value as IRType)}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4 shrink-0" style={{ color: t.color }} />
                <span className="text-xl font-bold" style={{ color: t.color }}>{byType(t.value as IRType).length}</span>
              </div>
              <div className="text-xs leading-tight" style={{ color: "var(--text-secondary)" }}>{t.label}</div>
            </div>
          );
        })}
      </div>

      {/* search + tabs */}
      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-5" style={{ borderColor: "var(--border)" }}>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search records…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-8 pr-4 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border)" }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {TABS.map(t => {
            const active = tab === t.key;
            return (
              <button key={t.key} type="button" onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  active ? "text-white border-transparent shadow-sm" : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                style={active ? { background: "var(--primary)", borderColor: "var(--primary)" } : { color: "var(--text-secondary)" }}>
                {t.label}
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {tabCounts[t.key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* loading */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "var(--bg-light)" }} />
          ))}
        </div>
      )}

      {/* empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl border shadow-sm p-16 text-center" style={{ borderColor: "var(--border)" }}>
          <TrendingUp className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>No records found</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {search || tab !== "all" ? "Try adjusting your filters." : "Add your first investor relations record."}
          </p>
        </div>
      )}

      {/* content per tab */}
      {!isLoading && (
        <div className="space-y-8">

          {(tab === "all" || tab === "financial_result") && financialResults.length > 0 && (
            <Section
              title="Financial Results"
              Icon={TrendingUp}
              color="#1d4ed8"
              count={financialResults.length}
              onAdd={canWrite ? () => openAdd("financial_result") : undefined}
            >
              <FinancialTable records={tab === "all" ? financialResults : filtered.filter(r => r.type === "financial_result")} {...sectionProps} />
            </Section>
          )}

          {(tab === "all" || tab === "annual_report") && annualReports.length > 0 && (
            <Section
              title="Annual Reports"
              Icon={FileText}
              color="#059669"
              count={annualReports.length}
              onAdd={canWrite ? () => openAdd("annual_report") : undefined}
            >
              <AnnualReportsGrid records={tab === "all" ? annualReports : filtered.filter(r => r.type === "annual_report")} {...sectionProps} />
            </Section>
          )}

          {(tab === "all" || tab === "board_member") && boardMembers.length > 0 && (
            <Section
              title="Board of Directors"
              Icon={Users}
              color="#7c3aed"
              count={boardMembers.length}
              onAdd={canWrite ? () => openAdd("board_member") : undefined}
            >
              <BoardMembersGrid records={tab === "all" ? boardMembers : filtered.filter(r => r.type === "board_member")} {...sectionProps} />
            </Section>
          )}

          {(tab === "all" || tab === "shareholding") && shareholding.length > 0 && (
            <Section
              title="Shareholding Pattern"
              Icon={PieChart}
              color="#b45309"
              count={shareholding.length}
              onAdd={canWrite ? () => openAdd("shareholding") : undefined}
            >
              <GenericTable
                records={tab === "all" ? shareholding : filtered.filter(r => r.type === "shareholding")}
                {...sectionProps}
                columns={[
                  { label: "Title", render: r => <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{r.title}</span> },
                  { label: "Year",    render: r => <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.year || "—"}</span> },
                  { label: "Quarter", render: r => <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.quarter || "—"}</span> },
                  { label: "Size",    render: r => <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.fileSize || "—"}</span> },
                  { label: "Date",    render: r => <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{fmtDate(r.publishedDate)}</span> },
                ]}
              />
            </Section>
          )}

          {(tab === "all" || tab === "press_release") && pressReleases.length > 0 && (
            <Section
              title="Press Releases"
              Icon={Newspaper}
              color="#0891b2"
              count={pressReleases.length}
              onAdd={canWrite ? () => openAdd("press_release") : undefined}
            >
              <GenericTable
                records={tab === "all" ? pressReleases : filtered.filter(r => r.type === "press_release")}
                {...sectionProps}
                columns={[
                  { label: "Title", render: r => <span className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{r.title}</span> },
                  { label: "Size",  render: r => <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{r.fileSize || "—"}</span> },
                  { label: "Date",  render: r => <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{fmtDate(r.publishedDate)}</span> },
                ]}
              />
            </Section>
          )}

          {/* tab-specific empty states (tab selected but no data) */}
          {!isLoading && tab !== "all" && filtered.filter(r => r.type === tab).length === 0 && records.length > 0 && (
            <EmptyState label={`No ${TABS.find(t => t.key === tab)?.label ?? "records"} yet.`} />
          )}
        </div>
      )}

      {/* modals */}
      {(formOpen || editTarget) && (
        <RecordFormModal
          initial={editTarget ?? undefined}
          defaultType={formType}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
          onSave={handleSave}
          saving={saving}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          record={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleteMut.isPending}
        />
      )}
    </div>
  );
}

// ─── collapsible section wrapper ──────────────────────────────────────────────

function Section({ title, Icon, color, count, onAdd, children }: {
  title: string;
  Icon: React.ElementType;
  color: string;
  count: number;
  onAdd?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: color + "20" }}>
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{title}</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: color + "15", color }}>{count}</span>
          {open
            ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
        {onAdd && (
          <Button type="button" size="sm" variant="neutral" className="gap-1.5 rounded-full" onClick={onAdd}>
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        )}
      </div>
      {open && children}
    </div>
  );
}
