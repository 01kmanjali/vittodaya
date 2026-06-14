"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useFAQs, useCreateFAQ, useDeleteFAQ, type FAQ } from "@/lib/queries/useFAQs";
import { AccessDenied, ReadOnlyBanner, usePageRole } from "@/components/admin/RoleGuard";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, HelpCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

// ─── Update mutation (PUT /api/faqs/:id) ─────────────────────────────────────

async function updateFAQ({ id, ...body }: Partial<FAQ> & { id: string }) {
  const res = await fetch(`/api/faqs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to update FAQ");
  return data.faq as FAQ;
}

const EMPTY = { category: "", question: "", answer: "" };

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "fixed-deposits": { bg: "#ecfdf5", text: "#059669" },
  "loans":          { bg: "#eff6ff", text: "#1d4ed8" },
  "lap":            { bg: "#fff7ed", text: "#b45309" },
  "general":        { bg: "#f5f3ff", text: "#7c3aed" },
};

function categoryStyle(cat: string) {
  return CATEGORY_COLORS[cat.toLowerCase()] ?? { bg: "#f1f5f9", text: "#475569" };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminFAQsPage() {
  const { canView, canWrite } = usePageRole("faqs");
  const { data: faqs = [], isLoading } = useFAQs();
  const createFAQ = useCreateFAQ();
  const deleteFAQ = useDeleteFAQ();
  const qc = useQueryClient();

  const updateMut = useMutation({
    mutationFn: updateFAQ,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["faqs"] }); toast.success("FAQ updated."); },
    onError: () => toast.error("Failed to update FAQ."),
  });

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch]                 = useState("");
  const [expanded, setExpanded]             = useState<string | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState<FAQ | null>(null);
  const [form, setForm]                 = useState(EMPTY);

  // Delete dialog
  const [delTarget, setDelTarget]       = useState<FAQ | null>(null);

  const categories = Array.from(new Set(faqs.map(f => f.category)));

  const filtered = faqs.filter(f => {
    const matchCat    = activeCategory === "all" || f.category === activeCategory;
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY);
    setDialogOpen(true);
  }

  function openEdit(faq: FAQ) {
    setEditTarget(faq);
    setForm({ category: faq.category, question: faq.question, answer: faq.answer });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.category.trim() || !form.question.trim() || !form.answer.trim()) {
      toast.error("All fields are required.");
      return;
    }
    try {
      if (editTarget) {
        await updateMut.mutateAsync({ id: editTarget._id, ...form });
      } else {
        await createFAQ.mutateAsync(form);
        toast.success("FAQ created.");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong.");
    }
  }

  function handleDelete(faq: FAQ) {
    setDelTarget(faq);
  }

  function confirmDelete() {
    if (!delTarget) return;
    deleteFAQ.mutate(delTarget._id, {
      onSuccess: () => { toast.success("FAQ deleted."); setDelTarget(null); },
      onError:   () => toast.error("Failed to delete FAQ."),
    });
  }

  const busy = createFAQ.isPending || updateMut.isPending;

  if (!canView) return <AccessDenied page="FAQs" />;

  return (
    <div className=" mx-auto">
      {!canWrite && <ReadOnlyBanner />}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>FAQ Management</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {faqs.length} FAQs across {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>
        {canWrite && (
          <Button
            onClick={openCreate}
            className="gap-2 text-white"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)" }}
          >
            <Plus className="h-4 w-4" /> Add FAQ
          </Button>
        )}
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="bg-white rounded-2xl border p-4 mb-5 space-y-3 shadow-sm" style={{ borderColor: "var(--border)" }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search questions or answers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", ...categories] as string[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                activeCategory === cat
                  ? "text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={activeCategory === cat ? { background: "var(--primary)" } : {}}
            >
              {cat === "all" ? `All (${faqs.length})` : `${cat} (${faqs.filter(f => f.category === cat).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── FAQ List ── */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border shadow-sm" style={{ borderColor: "var(--border)" }}>
          <HelpCircle className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {search ? `No FAQs matching "${search}"` : 'No FAQs yet. Click Add FAQ to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((faq, idx) => {
            const style = categoryStyle(faq.category);
            const isOpen = expanded === faq._id;
            return (
              <div
                key={faq._id}
                className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Row header */}
                <div className="flex items-center gap-3 px-5 py-4">
                  {/* Index */}
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white" style={{ background: "var(--primary)" }}>
                    {idx + 1}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize"
                        style={{ background: style.bg, color: style.text }}
                      >
                        {faq.category}
                      </span>
                    </div>
                    <p className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
                      {faq.question}
                    </p>
                    {!isOpen && (
                      <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-secondary)" }}>
                        {faq.answer}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {canWrite && (
                      <>
                        <Button
                          size="icon" variant="ghost"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() => openEdit(faq)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon" variant="ghost"
                          className="h-8 w-8 text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(faq)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="icon" variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setExpanded(isOpen ? null : faq._id)}
                    >
                      {isOpen
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded answer */}
                {isOpen && (
                  <div
                    className="px-5 pb-4 pt-0 border-t text-sm leading-relaxed"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                  >
                    <div className="pt-3">{faq.answer}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Category *</Label>
              <Input
                placeholder="e.g. loans, fixed-deposits, general"
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Question *</Label>
              <Input
                placeholder="Enter the FAQ question…"
                value={form.question}
                onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Answer *</Label>
              <Textarea
                rows={5}
                placeholder="Enter a clear, detailed answer…"
                value={form.answer}
                onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={busy}
              className="text-white"
              style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)" }}
            >
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editTarget ? "Save Changes" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!delTarget} onOpenChange={(open: boolean) => { if (!open) setDelTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete FAQ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            This will permanently delete:{" "}
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>&quot;{delTarget?.question}&quot;</span>
          </p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDelTarget(null)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
              disabled={deleteFAQ.isPending}
            >
              {deleteFAQ.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
