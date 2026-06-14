"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, PackageOpen, ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AccessDenied, ReadOnlyBanner, usePageRole } from "@/components/admin/RoleGuard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HomeProduct {
  _id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

const EMPTY: Omit<HomeProduct, "_id"> = {
  title: "",
  description: "",
  image: "",
  order: 0,
  isActive: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function fetchProducts(): Promise<HomeProduct[]> {
  const res = await fetch("/api/home-products");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function createProduct(data: Omit<HomeProduct, "_id">) {
  const res = await fetch("/api/home-products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

async function updateProduct({ id, ...data }: Partial<HomeProduct> & { id: string }) {
  const res = await fetch(`/api/home-products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}

async function deleteProduct(id: string) {
  const res = await fetch(`/api/home-products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete");
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomeProductsPage() {
  const { canWrite, isLoading: roleLoading, role } = usePageRole("home-products");
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products = [], isLoading } = useQuery<HomeProduct[]>({
    queryKey: ["home-products"],
    queryFn: fetchProducts,
  });

  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["home-products"] }); toast.success("Product created"); setOpen(false); },
  });
  const updateMut = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["home-products"] }); toast.success("Product updated"); setOpen(false); },
  });
  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["home-products"] }); toast.success("Product deleted"); setDelTarget(null); },
  });

  const [open, setOpen]             = useState(false);
  const [editTarget, setEditTarget] = useState<HomeProduct | null>(null);
  const [form, setForm]             = useState<Omit<HomeProduct, "_id">>(EMPTY);
  const [delTarget, setDelTarget]   = useState<HomeProduct | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  function openCreate() { setEditTarget(null); setForm(EMPTY); setOpen(true); }
  function openEdit(p: HomeProduct) {
    setEditTarget(p);
    setForm({ title: p.title, description: p.description, image: p.image, order: p.order, isActive: p.isActive });
    setOpen(true);
  }

  function set(field: keyof typeof form, value: string | number | boolean) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX = 2 * 1024 * 1024; // 2 MB
    if (file.size > MAX) {
      toast.error("Image must be smaller than 2 MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setImageLoading(true);
    try {
      const base64 = await fileToBase64(file);
      set("image", base64);
    } catch {
      toast.error("Failed to read image.");
    } finally {
      setImageLoading(false);
    }
  }

  function handleSubmit() {
    if (!form.title.trim())       return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (editTarget) updateMut.mutate({ id: editTarget._id, ...form });
    else            createMut.mutate(form);
  }

  const busy = createMut.isPending || updateMut.isPending;

  if (roleLoading) return null;
  if (!canWrite && role === "") return null;
  if (!canWrite) return <AccessDenied page="home-products" />;

  return (
    <div className="max-w-5xl mx-auto">
      {!canWrite && <ReadOnlyBanner />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Home Products</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage the product cards shown on the homepage &quot;Our Products&quot; section.
          </p>
        </div>
        {canWrite && (
          <Button
            onClick={openCreate}
            className="text-white gap-2"
            style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)" }}
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <PackageOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No products yet. Click &quot;Add Product&quot; to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {products.map(p => (
            <Card key={p._id} className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center border">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-sm leading-tight" style={{ color: "var(--text-primary)" }}>{p.title}</h3>
                      <Badge variant={p.isActive ? "default" : "secondary"} className="text-xs shrink-0">
                        {p.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--text-secondary)" }}>
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Order: {p.order}</span>
                      {canWrite && (
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(p)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon" variant="ghost"
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDelTarget(p)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Title *</Label>
              <Input
                value={form.title}
                onChange={e => set("title", e.target.value)}
                placeholder="e.g. Loan Against Property"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Description *</Label>
              <Textarea
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Detailed description of the product..."
                rows={4}
              />
            </div>

            {/* Image upload */}
            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Product Image</Label>

              {form.image ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image} alt="preview" className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => { set("image", ""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                  className="w-full h-36 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
                  style={{ borderColor: "var(--border)" }}
                >
                  {imageLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500">Click to upload image</span>
                      <span className="text-[10px] text-gray-400">PNG, JPG, WebP — max 2 MB</span>
                    </>
                  )}
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold mb-1.5 block">Display Order</Label>
              <Input
                type="number"
                value={form.order}
                onChange={e => set("order", Number(e.target.value))}
                placeholder="0"
                min={0}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Switch checked={form.isActive} onCheckedChange={v => set("isActive", v)} id="isActive" />
              <Label htmlFor="isActive" className="text-sm cursor-pointer">Show on homepage</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={busy || imageLoading}
              className="text-white"
              style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)" }}
            >
              {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editTarget ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!delTarget} onOpenChange={(open: boolean) => { if (!open) setDelTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">&quot;{delTarget?.title}&quot;</span> will be permanently removed from the homepage. This action cannot be undone.
          </p>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDelTarget(null)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => delTarget && deleteMut.mutate(delTarget._id)}
              disabled={deleteMut.isPending}
            >
              {deleteMut.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
