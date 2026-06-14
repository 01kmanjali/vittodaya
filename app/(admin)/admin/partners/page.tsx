"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AccessDenied, usePageRole } from "@/components/admin/RoleGuard";
import { Trash2, Phone, Mail, MapPin, MessageSquare, ChevronDown } from "lucide-react";

type PartnerInquiry = {
  _id: string;
  name: string;
  mobile: string;
  email?: string;
  city?: string;
  profile: string;
  message?: string;
  status: "new" | "contacted" | "converted" | "rejected";
  notes?: string;
  createdAt: string;
};

const STATUS_OPTIONS = ["new", "contacted", "converted", "rejected"] as const;
const PROFILE_LABELS: Record<string, string> = {
  dsa:        "DSA",
  advisor:    "Financial Advisor",
  realestate: "Real Estate",
  channel:    "Channel Partner",
  other:      "Other",
};
const STATUS_STYLES: Record<string, string> = {
  new:       "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  converted: "bg-green-100 text-green-700",
  rejected:  "bg-red-100 text-red-700",
};

async function fetchInquiries(status: string): Promise<PartnerInquiry[]> {
  const qs = status !== "all" ? `?status=${status}` : "";
  const res = await fetch(`/api/partner${qs}`);
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.inquiries;
}

async function updateInquiry(id: string, patch: Partial<PartnerInquiry>) {
  const res = await fetch(`/api/partner/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

async function deleteInquiry(id: string) {
  const res = await fetch(`/api/partner/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}

export default function AdminPartnersPage() {
  const { canView, canWrite } = usePageRole("partners");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const qc = useQueryClient();
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["partner-inquiries", statusFilter],
    queryFn: () => fetchInquiries(statusFilter),
    enabled: canView,
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<PartnerInquiry> }) =>
      updateInquiry(id, patch),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["partner-inquiries"] }); toast.success("Updated."); },
    onError: () => toast.error("Update failed."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInquiry,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["partner-inquiries"] }); toast.success("Deleted."); },
    onError: () => toast.error("Delete failed."),
  });

  if (!canView) return <AccessDenied page="Partner Inquiries" />;

  const counts = STATUS_OPTIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s] = inquiries.filter(i => i.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Partner Inquiries</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {inquiries.length} inquiries · {counts.new ?? 0} new
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(["all", ...STATUS_OPTIONS] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              statusFilter === s
                ? "text-white"
                : "bg-white border text-gray-600 hover:bg-gray-50"
            }`}
            style={statusFilter === s ? { background: "var(--primary)" } : {}}
          >
            {s === "all" ? `All (${inquiries.length})` : `${s} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-center py-16 text-sm" style={{ color: "var(--text-secondary)" }}>Loading…</div>
      )}

      {!isLoading && inquiries.length === 0 && (
        <div className="text-center py-16 rounded-2xl bg-white border" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No partner inquiries found.</p>
        </div>
      )}

      <div className="space-y-3">
        {inquiries.map(inq => (
          <div key={inq._id} className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
            {/* Card header */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0"
                  style={{ background: "linear-gradient(135deg, #0a3460, #1e3a8a)" }}
                >
                  {inq.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{inq.name}</span>
                    <Badge className={`text-[10px] px-1.5 py-0 ${STATUS_STYLES[inq.status]}`}>
                      {inq.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-blue-200 text-blue-700">
                      {PROFILE_LABELS[inq.profile] ?? inq.profile}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                      <Phone className="h-3 w-3" />{inq.mobile}
                    </span>
                    {inq.email && (
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                        <Mail className="h-3 w-3" />{inq.email}
                      </span>
                    )}
                    {inq.city && (
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                        <MapPin className="h-3 w-3" />{inq.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                {canWrite && (
                  <select
                    value={inq.status}
                    onChange={e => patchMutation.mutate({ id: inq._id, patch: { status: e.target.value as PartnerInquiry["status"] } })}
                    className="text-xs border rounded-lg px-2 py-1.5 outline-none"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setExpanded(expanded === inq._id ? null : inq._id)}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${expanded === inq._id ? "rotate-180" : ""}`} />
                </Button>
                {canWrite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteMutation.mutate(inq._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Expanded panel */}
            {expanded === inq._id && (
              <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: "var(--border)" }}>
                {inq.message && (
                  <div>
                    <p className="text-xs font-medium mb-1 flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                      <MessageSquare className="h-3.5 w-3.5" /> Message
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{inq.message}</p>
                  </div>
                )}
                {canWrite && (
                  <div>
                    <Separator className="mb-4" />
                    <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>Internal Notes</p>
                    <textarea
                      rows={3}
                      placeholder="Add internal notes about this partner…"
                      defaultValue={inq.notes ?? ""}
                      onChange={e => setNotes(prev => ({ ...prev, [inq._id]: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <Button
                      size="sm"
                      className="mt-2 text-white"
                      style={{ background: "var(--primary)" }}
                      onClick={() => patchMutation.mutate({ id: inq._id, patch: { notes: notes[inq._id] ?? inq.notes } })}
                    >
                      Save Notes
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
