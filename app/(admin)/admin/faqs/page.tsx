"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFAQs, useCreateFAQ, useDeleteFAQ } from "@/lib/queries/useFAQs";
import { toast } from "sonner";

export default function AdminFAQsPage() {
  const { data: faqs = [], isLoading } = useFAQs();
  const createFAQ = useCreateFAQ();
  const deleteFAQ = useDeleteFAQ();

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "", question: "", answer: "" });

  const categories = Array.from(new Set(faqs.map(f => f.category)));
  const filtered = faqs.filter(f => {
    const matchCat = activeCategory === "all" || f.category === activeCategory;
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  async function handleSave() {
    if (!form.category || !form.question || !form.answer) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await createFAQ.mutateAsync(form);
      setForm({ category: "", question: "", answer: "" });
      setShowForm(false);
      toast.success("FAQ created successfully.");
    } catch {
      toast.error("Failed to create FAQ.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>FAQ Management</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{faqs.length} FAQs across {categories.length} categories</p>
        </div>
        <Button type="button" variant="gold" size="md" onClick={() => setShowForm(!showForm)}>
          + Add FAQ
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Add New FAQ</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Category</label>
              <input
                type="text"
                placeholder="e.g. fixed-deposits"
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Question</label>
              <input
                type="text"
                placeholder="Enter FAQ question..."
                value={form.question}
                onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-secondary)" }}>Answer</label>
              <textarea
                rows={4}
                placeholder="Enter detailed answer..."
                value={form.answer}
                onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="primary" size="md" onClick={handleSave} disabled={createFAQ.isPending}>
                {createFAQ.isPending ? "Saving…" : "Save FAQ"}
              </Button>
              <Button type="button" variant="neutral" size="md" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-5 flex flex-wrap gap-3" style={{ borderColor: "var(--border)" }}>
        <input type="text" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} className="border rounded-xl px-4 py-2 text-sm outline-none flex-1 min-w-48" style={{ borderColor: "var(--border)" }} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant={activeCategory === "all" ? "primary" : "neutral"} className="rounded-full" onClick={() => setActiveCategory("all")}>All</Button>
          {categories.map(cat => (
            <Button type="button" key={cat} size="sm" variant={activeCategory === cat ? "primary" : "neutral"} className="rounded-full capitalize" onClick={() => setActiveCategory(cat)}>
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="px-5 py-3 border-b text-sm" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
          {isLoading ? "Loading…" : <><strong>{filtered.length}</strong> FAQs</>}
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {filtered.map(faq => (
            <div key={faq._id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium" style={{ background: "#eff6ff", color: "#1d4ed8" }}>{faq.category}</span>
                  </div>
                  <p className="font-medium text-sm mb-1" style={{ color: "var(--text-primary)" }}>{faq.question}</p>
                  <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{faq.answer}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button type="button" variant="primaryOutline" size="sm">Edit</Button>
                  <Button type="button" variant="dangerOutline" size="sm" onClick={() => { deleteFAQ.mutate(faq._id, { onSuccess: () => toast.success("FAQ deleted."), onError: () => toast.error("Failed to delete FAQ.") }); }} disabled={deleteFAQ.isPending}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
