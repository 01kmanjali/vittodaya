"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  useNews, useCreateNews, useUpdateNews, useDeleteNews,
  type NewsArticle,
} from "@/lib/queries/useNews";
import { Button } from "@/components/ui/button";
import {
  Plus, Pencil, Trash2, X, Loader2, Search, Star, StarOff,
  Newspaper, Trophy, Radio, Megaphone, Eye, EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { AccessDenied, ReadOnlyBanner, usePageRole } from "@/components/admin/RoleGuard";

// ─── constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "press-release",  label: "Press Release",  Icon: Newspaper,  color: "#1d4ed8", bg: "#eff6ff" },
  { value: "media-coverage", label: "Media Coverage", Icon: Radio,      color: "#15803d", bg: "#f0fdf4" },
  { value: "awards",         label: "Award",          Icon: Trophy,     color: "#b45309", bg: "#fef9c3" },
  { value: "announcement",   label: "Announcement",   Icon: Megaphone,  color: "#7e22ce", bg: "#fdf4ff" },
] as const;

type Category = typeof CATEGORIES[number]["value"];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.value, c]));

const COLOR_PRESETS = [
  "#1d4ed8", "#059669", "#d97706", "#dc2626",
  "#7c3aed", "#0891b2", "#be185d", "#1e293b",
];

const EMPTY: Omit<NewsArticle, "_id"> = {
  title: "",
  excerpt: "",
  source: "",
  publishedDate: "",
  readTime: "",
  category: "press-release",
  imageInitial: "",
  imageColor: "#1d4ed8",
  isFeatured: false,
  isActive: true,
};

function fmtDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_MAP[category];
  if (!c) return <span className="text-xs text-muted-foreground capitalize">{category}</span>;
  const { Icon } = c;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.color }}>
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${checked ? "bg-blue-600" : "bg-gray-200"}`}>
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

// ─── Article form ─────────────────────────────────────────────────────────────

type ArticleFormData = Omit<NewsArticle, "_id">;

function ArticleForm({
  initial, onClose, onSave, saving,
}: {
  initial?: NewsArticle;
  onClose: () => void;
  onSave: (data: ArticleFormData, id?: string) => void;
  saving: boolean;
}) {
  const isEdit = !!initial;
  const [form, setForm] = useState<ArticleFormData>({
    title:         initial?.title         ?? EMPTY.title,
    excerpt:       initial?.excerpt       ?? EMPTY.excerpt,
    source:        initial?.source        ?? EMPTY.source,
    publishedDate: initial?.publishedDate ?? EMPTY.publishedDate,
    readTime:      initial?.readTime      ?? EMPTY.readTime,
    category:      (initial?.category     ?? EMPTY.category) as Category,
    imageInitial:  initial?.imageInitial  ?? EMPTY.imageInitial,
    imageColor:    initial?.imageColor    ?? EMPTY.imageColor,
    isFeatured:    initial?.isFeatured    ?? EMPTY.isFeatured,
    isActive:      initial?.isActive      ?? EMPTY.isActive,
  });

  function set<K extends keyof ArticleFormData>(key: K, value: ArticleFormData[K]) {
    setForm(p => ({ ...p, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.category) { toast.error("Category is required."); return; }
    onSave(form, initial?._id);
  }

  const inputCls = "w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-400";
  const inputStyle = { borderColor: "var(--border)" };
  const labelCls = "text-xs font-medium mb-1 block";
  const labelStyle = { color: "var(--text-secondary)" };

  const selectedCat = CATEGORIES.find(c => c.value === form.category);
  const initials = form.title.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "N";

  return (
    <Modal title={isEdit ? "Edit Article" : "Add Article / Announcement"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Category picker */}
        <div>
          <label className={labelCls} style={labelStyle}>Category *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map(c => {
              const { Icon } = c;
              const active = form.category === c.value;
              return (
                <button key={c.value} type="button"
                  onClick={() => set("category", c.value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${active ? "border-blue-500" : "hover:bg-gray-50"}`}
                  style={active ? { borderColor: c.color, background: c.bg, color: c.color } : { borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                  <Icon className="h-4 w-4" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className={labelCls} style={labelStyle}>Title *</label>
          <input className={inputCls} style={inputStyle} value={form.title}
            onChange={e => set("title", e.target.value)} placeholder="Article headline…" />
        </div>

        {/* Excerpt */}
        <div>
          <label className={labelCls} style={labelStyle}>Excerpt / Summary</label>
          <textarea rows={3} className={`${inputCls} resize-none`} style={inputStyle}
            value={form.excerpt ?? ""} onChange={e => set("excerpt", e.target.value)}
            placeholder="Short description shown in listings…" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Source / Publication</label>
            <input className={inputCls} style={inputStyle} value={form.source ?? ""}
              onChange={e => set("source", e.target.value)} placeholder="e.g. Economic Times" />
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Read Time</label>
            <input className={inputCls} style={inputStyle} value={form.readTime ?? ""}
              onChange={e => set("readTime", e.target.value)} placeholder="e.g. 3 min read" />
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Published Date</label>
          <input type="date" className={inputCls} style={inputStyle}
            value={form.publishedDate ?? ""}
            onChange={e => set("publishedDate", e.target.value)} />
        </div>

        {/* Image / Avatar */}
        <div>
          <label className={labelCls} style={labelStyle}>Card Avatar</label>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0 select-none"
              style={{ background: form.imageColor ?? "#1d4ed8" }}>
              {form.imageInitial?.trim() || initials}
            </div>
            <div className="flex-1 space-y-2">
              <input className={inputCls} style={inputStyle}
                value={form.imageInitial ?? ""}
                onChange={e => set("imageInitial", e.target.value.slice(0, 2).toUpperCase())}
                placeholder="Initials (auto from title)" maxLength={2} />
              <div className="flex gap-1.5 flex-wrap">
                {COLOR_PRESETS.map(c => (
                  <button key={c} type="button"
                    onClick={() => set("imageColor", c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${form.imageColor === c ? "border-gray-900 scale-110" : "border-transparent"}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <Toggle checked={!!form.isFeatured} onChange={v => set("isFeatured", v)} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Toggle checked={!!form.isActive} onChange={v => set("isActive", v)} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Active (visible on site)</span>
          </label>
        </div>

        {/* Preview pill */}
        {selectedCat && (
          <div className="rounded-xl p-3 text-xs" style={{ background: "var(--bg-light)", color: "var(--text-secondary)" }}>
            <strong>Preview:</strong> <CategoryBadge category={form.category} />
            {form.isFeatured && <span className="ml-2 text-amber-600 font-semibold">★ Featured</span>}
            {!form.isActive && <span className="ml-2 text-red-500 font-semibold">● Inactive</span>}
          </div>
        )}

        <div className="flex gap-3 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
          <Button type="submit" variant="primary" size="md" disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isEdit ? "Save Changes" : "Publish Article"}
          </Button>
          <Button type="button" variant="neutral" size="md" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────

function DeleteModal({ article, onClose, onConfirm, deleting }: {
  article: NewsArticle; onClose: () => void; onConfirm: () => void; deleting: boolean;
}) {
  return (
    <Modal title="Delete Article" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "var(--text-primary)" }}>&ldquo;{article.title}&rdquo;</strong>?
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

// ─── Main page ────────────────────────────────────────────────────────────────

type TabKey = "all" | Category;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",            label: "All"           },
  { key: "press-release",  label: "Press Releases" },
  { key: "media-coverage", label: "Media Coverage" },
  { key: "awards",         label: "Awards"         },
  { key: "announcement",   label: "Announcements"  },
];

export default function AdminNewsMediaPage() {
  const { canView, canWrite } = usePageRole("news-media");

  const { data: articles = [], isLoading } = useNews({ showAll: "true" });
  const createMut = useCreateNews();
  const updateMut = useUpdateNews();
  const deleteMut = useDeleteNews();

  const [tab,    setTab]    = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState(false);

  const [formOpen,    setFormOpen]    = useState(false);
  const [editTarget,  setEditTarget]  = useState<NewsArticle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);

  if (!canView) return <AccessDenied page="News & Media" />;

  const filtered = articles.filter(a => {
    const matchTab = tab === "all" || a.category === tab;
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.source ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFeatured = !featuredFilter || !!a.isFeatured;
    return matchTab && matchSearch && matchFeatured;
  });

  const stats = CATEGORIES.map(c => ({
    label: c.label,
    value: articles.filter(a => a.category === c.value).length,
    color: c.color,
    bg: c.bg,
  }));

  async function handleSave(data: ArticleFormData, id?: string) {
    try {
      if (id) {
        await updateMut.mutateAsync({ id, body: data });
        toast.success("Article updated.");
      } else {
        await createMut.mutateAsync(data);
        toast.success("Article published.");
      }
      setFormOpen(false);
      setEditTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save article.");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMut.mutateAsync(deleteTarget._id);
      toast.success("Article deleted.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete article.");
    }
  }

  async function handleToggleFeatured(a: NewsArticle) {
    try {
      await updateMut.mutateAsync({ id: a._id, body: { isFeatured: !a.isFeatured } });
      toast.success(a.isFeatured ? "Removed from featured." : "Marked as featured.");
    } catch { toast.error("Failed to update."); }
  }

  async function handleToggleActive(a: NewsArticle) {
    try {
      await updateMut.mutateAsync({ id: a._id, body: { isActive: !a.isActive } });
      toast.success(a.isActive ? "Article hidden from site." : "Article activated.");
    } catch { toast.error("Failed to update."); }
  }

  const saving = createMut.isPending || updateMut.isPending;

  return (
    <div>
      {!canWrite && <ReadOnlyBanner />}

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>News & Media</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage articles, press releases, awards and announcements — {articles.length} total
          </p>
        </div>
        <Button variant="primary" size="md" className="gap-2" disabled={!canWrite}
          onClick={() => { setEditTarget(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Article
        </Button>
      </div>

      {/* stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: "var(--border)" }}>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* search + filters */}
      <div className="bg-white rounded-2xl border shadow-sm p-4 mb-5 flex flex-wrap items-center gap-3" style={{ borderColor: "var(--border)" }}>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search title or source…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-xl pl-8 pr-4 py-2 text-sm outline-none"
            style={{ borderColor: "var(--border)" }} />
        </div>
        <button type="button"
          onClick={() => setFeaturedFilter(v => !v)}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition-colors ${featuredFilter ? "bg-amber-50 border-amber-300 text-amber-700" : "border-gray-200 text-muted-foreground hover:bg-gray-50"}`}>
          <Star className="h-3.5 w-3.5" />
          Featured only
        </button>
      </div>

      {/* category tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map(t => {
          const count = t.key === "all" ? articles.length : articles.filter(a => a.category === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                active
                  ? "text-white border-transparent shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              style={active ? { background: "var(--primary)", borderColor: "var(--primary)", color: "white" } : { color: "var(--text-secondary)" }}
            >
              {t.label}
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* skeleton */}
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
          <Newspaper className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="font-medium" style={{ color: "var(--text-primary)" }}>No articles found</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {search || featuredFilter || tab !== "all" ? "Try adjusting your filters." : "Publish your first article."}
          </p>
          {canWrite && tab === "all" && !search && !featuredFilter && (
            <Button variant="primary" size="sm" className="mt-4 gap-1.5"
              onClick={() => { setEditTarget(null); setFormOpen(true); }}>
              <Plus className="h-3.5 w-3.5" /> Add First Article
            </Button>
          )}
        </div>
      )}

      {/* table */}
      {!isLoading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: "var(--border)" }}>
          <div className="px-5 py-3 border-b text-sm" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
            <strong>{filtered.length}</strong> article{filtered.length !== 1 ? "s" : ""}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg-light)" }}>
                  {["", "Title", "Category", "Source", "Published", "Read Time", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                      style={{ color: "var(--text-secondary)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                {filtered.map(a => {
                  const initials = a.imageInitial || a.title.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <tr key={a._id} className={`hover:bg-gray-50 transition-colors ${!a.isActive ? "opacity-60" : ""}`}>
                      {/* avatar */}
                      <td className="px-4 py-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 select-none"
                          style={{ background: a.imageColor ?? "#1d4ed8" }}>
                          {initials}
                        </div>
                      </td>
                      {/* title */}
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          {a.isFeatured && <Star className="h-3 w-3 text-amber-500 shrink-0 fill-amber-400" />}
                          <p className="font-medium text-sm line-clamp-2" style={{ color: "var(--text-primary)" }}>{a.title}</p>
                        </div>
                        {a.excerpt && (
                          <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--text-secondary)" }}>{a.excerpt}</p>
                        )}
                      </td>
                      {/* category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <CategoryBadge category={a.category} />
                      </td>
                      {/* source */}
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                        {a.source || "—"}
                      </td>
                      {/* date */}
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                        {fmtDate(a.publishedDate)}
                      </td>
                      {/* read time */}
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                        {a.readTime || "—"}
                      </td>
                      {/* status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Toggle checked={!!a.isActive} onChange={() => handleToggleActive(a)} disabled={!canWrite || updateMut.isPending} />
                          <span className={`text-xs font-medium ${a.isActive ? "text-green-700" : "text-red-600"}`}>
                            {a.isActive ? "Live" : "Hidden"}
                          </span>
                        </div>
                      </td>
                      {/* actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Button type="button" size="sm" variant="neutral"
                            disabled={!canWrite || updateMut.isPending}
                            onClick={() => handleToggleFeatured(a)}
                            title={a.isFeatured ? "Unfeature" : "Feature"}>
                            {a.isFeatured
                              ? <StarOff className="h-3.5 w-3.5 text-amber-500" />
                              : <Star className="h-3.5 w-3.5 text-muted-foreground" />}
                          </Button>
                          <Button type="button" size="sm" variant="primaryOutline"
                            disabled={!canWrite}
                            onClick={() => { setEditTarget(a); setFormOpen(false); }}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" size="sm" variant="dangerOutline"
                            disabled={!canWrite}
                            onClick={() => setDeleteTarget(a)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* modals */}
      {(formOpen || editTarget) && (
        <ArticleForm
          initial={editTarget ?? undefined}
          onClose={() => { setFormOpen(false); setEditTarget(null); }}
          onSave={handleSave}
          saving={saving}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          article={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleteMut.isPending}
        />
      )}
    </div>
  );
}
