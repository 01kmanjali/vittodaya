"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, PackageOpen, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { AccessDenied, ReadOnlyBanner, usePageRole } from "@/components/admin/RoleGuard";
import Image from "next/image";

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

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchProducts(): Promise<HomeProduct[]> {
  const res = await fetch("/api/home-products");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function createProduct(data: Omit<HomeProduct, "_id">) {
  const res = await fetch("/api/home-products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create");
  return res.json();
}

async function updateProduct({ id, ...data }: Partial<HomeProduct> & { id: string }) {
  const res = await fetch(`/api/home-products/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
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

  const { data: products = [], isLoading } = useQuery<HomeProduct[]>({
    queryKey: ["home-products"],
    queryFn: fetchProducts,
  });

  const createMut = useMutation({ mutationFn: createProduct, onSuccess: () => { qc.invalidateQueries({ queryKey: ["home-products"] }); toast.success("Product created"); setOpen(false); } });
  const updateMut = useMutation({ mutationFn: updateProduct, onSuccess: () => { qc.invalidateQueries({ queryKey: ["home-products"] }); toast.success("Product updated"); setOpen(false); } });
  const deleteMut = useMutation({ mutationFn: deleteProduct, onSuccess: () => { qc.invalidateQueries({ queryKey: ["home-products"] }); toast.success("Product deleted"); setDelTarget(null); } });

  const [open, setOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HomeProduct | null>(null);
  const [form, setForm] = useState<Omit<HomeProduct, "_id">>(EMPTY);
  const [delTarget, setDelTarget] = useState<HomeProduct | null>(null);

  function openCreate() { setEditTarget(null); setForm(EMPTY); setOpen(true); }
  function openEdit(p: HomeProduct) { setEditTarget(p); setForm({ title: p.title, description: p.description, image: p.image, order: p.order, isActive: p.isActive }); setOpen(true); }

  function set(field: keyof typeof form, value: string | number | boolean) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleSubmit() {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (editTarget) updateMut.mutate({ id: editTarget._id, ...form });
    else createMut.mutate(form);
  }

  const busy = createMut.isPending || updateMut.isPending;

  if (roleLoading) return null;
  if (!canWrite && role === "") return null;
  if (!canWrite) return <AccessDenied page="home-products" />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {!canWrite && <ReadOnlyBanner />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Home Products</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage the product cards shown on the homepage "Our Products" section.
          </p>
        </div>
        {canWrite && (
          <Button onClick={openCreate} className="text-white gap-2" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)" }}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <PackageOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No products yet. Click "Add Product" to get started.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {products.map(p => (
            <Card key={p._id} className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image preview */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center border">
                    {p.image ? (
                      <Image src={p.image} alt={p.title} width={80} height={80} className="object-cover w-full h-full" />
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
                    <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--text-secondary)" }}>{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Order: {p.order}</span>
                      {canWrite && (
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(p)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setDelTarget(p)}>
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

      {/* Create / Edit modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">{editTarget ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Title *</Label>
                <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Loan Against Property" />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Description *</Label>
                <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Detailed description of the product..." rows={5} />
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Image URL</Label>
                <Input value={form.image} onChange={e => set("image", e.target.value)} placeholder="/images/product.png or https://..." />
                {form.image && (
                  <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100 border">
                    <Image src={form.image} alt="preview" width={400} height={128} className="object-cover w-full h-full" />
                  </div>
                )}
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Display Order</Label>
                <Input type="number" value={form.order} onChange={e => set("order", Number(e.target.value))} placeholder="0" min={0} />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.isActive} onCheckedChange={v => set("isActive", v)} id="isActive" />
                <Label htmlFor="isActive" className="text-sm">Show on homepage</Label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={busy} className="text-white" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)" }}>
                {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editTarget ? "Save Changes" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h2 className="font-bold text-lg mb-2">Delete Product?</h2>
            <p className="text-sm text-gray-500 mb-5">
              "<span className="font-medium text-gray-700">{delTarget.title}</span>" will be permanently removed from the homepage.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDelTarget(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => deleteMut.mutate(delTarget._id)} disabled={deleteMut.isPending}>
                {deleteMut.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
