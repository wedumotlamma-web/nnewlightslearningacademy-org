import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/packages")({
  head: () => ({
    meta: [
      { title: "Manage Packages — New-Lights Learning Academy" },
      { name: "description", content: "Admin tools to build tuition packages and bundle fees for New-Lights Learning Academy." },
      { property: "og:title", content: "Manage Packages — New-Lights Learning Academy" },
      { property: "og:description", content: "Build tuition packages and bundle fees." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PackagesManager,
});

type PackageForm = {
  name: string;
  price: string;
  currency: string;
  duration_days: string;
  tax_rate_percent: string;
  tax_included: boolean;
  active: boolean;
  feeIds: string[];
};

const emptyPackage: PackageForm = {
  name: "",
  price: "",
  currency: "BWP",
  duration_days: "",
  tax_rate_percent: "0",
  tax_included: false,
  active: true,
  feeIds: [],
};

function PackagesManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PackageForm>(emptyPackage);
  const [editingId, setEditingId] = useState<string | null>(null);

  const feesQuery = useQuery({
    queryKey: ["admin-fees"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fees").select("id,name,amount,currency").order("name");
      if (error) throw error;
      return data;
    },
  });

  const packagesQuery = useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*, package_fees(fee_id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: PackageForm) => {
      const payload = {
        name: values.name.trim(),
        price: Number(values.price),
        currency: values.currency.trim().toUpperCase() || "BWP",
        duration_days: values.duration_days ? Number(values.duration_days) : null,
        tax_rate_percent: Number(values.tax_rate_percent || 0),
        tax_included: values.tax_included,
        active: values.active,
      };
      if (!payload.name || Number.isNaN(payload.price)) {
        throw new Error("Name and a valid price are required");
      }

      let packageId = editingId;
      if (packageId) {
        const { error } = await supabase.from("packages").update(payload).eq("id", packageId);
        if (error) throw error;
        const { error: delError } = await supabase.from("package_fees").delete().eq("package_id", packageId);
        if (delError) throw delError;
      } else {
        const { data, error } = await supabase.from("packages").insert(payload).select("id").single();
        if (error) throw error;
        packageId = data.id;
      }

      if (values.feeIds.length && packageId) {
        const { error } = await supabase
          .from("package_fees")
          .insert(values.feeIds.map((fee_id) => ({ package_id: packageId as string, fee_id })));
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      toast.success(editingId ? "Package updated" : "Package created");
      setForm(emptyPackage);
      setEditingId(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("packages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-packages"] });
      toast.success("Package deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  function toggleFee(id: string) {
    setForm((prev) => ({
      ...prev,
      feeIds: prev.feeIds.includes(id) ? prev.feeIds.filter((f) => f !== id) : [...prev.feeIds, id],
    }));
  }

  return (
    <main className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate({ to: "/admin" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to admin
        </Button>

        <h1 className="font-serif text-3xl font-bold">Packages</h1>
        <p className="mt-2 text-sm text-muted-foreground">Bundle fees into packages families can choose from.</p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit package" : "New package"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="pkg-name">Name</Label>
              <Input id="pkg-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="pkg-price">Price</Label>
              <Input id="pkg-price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="pkg-currency">Currency</Label>
              <Input id="pkg-currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="pkg-duration">Duration (days)</Label>
              <Input id="pkg-duration" type="number" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="pkg-tax">Tax rate (%)</Label>
              <Input id="pkg-tax" type="number" step="0.01" value={form.tax_rate_percent} onChange={(e) => setForm({ ...form, tax_rate_percent: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="pkg-tax-inc" checked={form.tax_included} onCheckedChange={(v) => setForm({ ...form, tax_included: v })} />
              <Label htmlFor="pkg-tax-inc">Tax included in price</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="pkg-active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label htmlFor="pkg-active">Active</Label>
            </div>
            <div className="sm:col-span-2">
              <Label>Included fees</Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {feesQuery.data?.map((fee) => (
                  <label key={fee.id} className="flex items-center gap-2 rounded-md border bg-background p-2 text-sm">
                    <Checkbox checked={form.feeIds.includes(fee.id)} onCheckedChange={() => toggleFee(fee.id)} />
                    <span>
                      {fee.name} ({fee.currency} {Number(fee.amount).toFixed(2)})
                    </span>
                  </label>
                ))}
                {feesQuery.data?.length === 0 && (
                  <p className="text-sm text-muted-foreground">Add fees first to bundle them here.</p>
                )}
              </div>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingId ? "Save changes" : "Add package"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); setForm(emptyPackage); }}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-3">
          {packagesQuery.isLoading && <p className="text-sm text-muted-foreground">Loading packages…</p>}
          {packagesQuery.data?.length === 0 && <p className="text-sm text-muted-foreground">No packages yet.</p>}
          {packagesQuery.data?.map((pkg) => {
            const feeIds = (pkg.package_fees ?? []).map((pf: { fee_id: string }) => pf.fee_id);
            return (
              <Card key={pkg.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-medium">
                      {pkg.name}{" "}
                      <span className="text-muted-foreground">
                        — {pkg.currency} {Number(pkg.price).toFixed(2)}
                      </span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant={pkg.active ? "default" : "secondary"}>{pkg.active ? "Active" : "Inactive"}</Badge>
                      {pkg.duration_days && <Badge variant="outline">{pkg.duration_days} days</Badge>}
                      <Badge variant="outline">{feeIds.length} fee(s)</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(pkg.id);
                        setForm({
                          name: pkg.name,
                          price: String(pkg.price),
                          currency: pkg.currency,
                          duration_days: pkg.duration_days ? String(pkg.duration_days) : "",
                          tax_rate_percent: String(pkg.tax_rate_percent ?? 0),
                          tax_included: !!pkg.tax_included,
                          active: !!pkg.active,
                          feeIds,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete "${pkg.name}"?`)) deleteMutation.mutate(pkg.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
