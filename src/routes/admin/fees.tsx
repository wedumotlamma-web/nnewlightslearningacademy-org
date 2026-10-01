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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/fees")({
  head: () => ({
    meta: [
      { title: "Manage Fees — New-Lights Learning Academy" },
      { name: "description", content: "Admin tools to create and update tuition fees for New-Lights Learning Academy." },
      { property: "og:title", content: "Manage Fees — New-Lights Learning Academy" },
      { property: "og:description", content: "Admin tools to create and update tuition fees." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FeesManager,
});

type FeeForm = {
  name: string;
  amount: string;
  currency: string;
  description: string;
  tax_rate_percent: string;
  tax_included: boolean;
  effective_from: string;
  active: boolean;
};

const emptyFee: FeeForm = {
  name: "",
  amount: "",
  currency: "BWP",
  description: "",
  tax_rate_percent: "0",
  tax_included: false,
  effective_from: "",
  active: true,
};

function FeesManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FeeForm>(emptyFee);
  const [editingId, setEditingId] = useState<string | null>(null);

  const feesQuery = useQuery({
    queryKey: ["admin-fees"],
    queryFn: async () => {
      const { data, error } = await supabase.from("fees").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FeeForm) => {
      const payload = {
        name: values.name.trim(),
        amount: Number(values.amount),
        currency: values.currency.trim().toUpperCase() || "BWP",
        description: values.description.trim() || null,
        tax_rate_percent: Number(values.tax_rate_percent || 0),
        tax_included: values.tax_included,
        effective_from: values.effective_from || null,
        active: values.active,
      };
      if (!payload.name || Number.isNaN(payload.amount)) {
        throw new Error("Name and a valid amount are required");
      }
      if (editingId) {
        const { error } = await supabase.from("fees").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("fees").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fees"] });
      toast.success(editingId ? "Fee updated" : "Fee created");
      setForm(emptyFee);
      setEditingId(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fees"] });
      toast.success("Fee deleted");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <main className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate({ to: "/admin" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to admin
        </Button>

        <h1 className="font-serif text-3xl font-bold">Fees</h1>
        <p className="mt-2 text-sm text-muted-foreground">Create and manage the fees shown on the website.</p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit fee" : "New fee"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fee-name">Name</Label>
              <Input id="fee-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="fee-amount">Amount</Label>
              <Input id="fee-amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="fee-currency">Currency</Label>
              <Input id="fee-currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="fee-tax">Tax rate (%)</Label>
              <Input id="fee-tax" type="number" step="0.01" value={form.tax_rate_percent} onChange={(e) => setForm({ ...form, tax_rate_percent: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="fee-date">Effective from</Label>
              <Input id="fee-date" type="date" value={form.effective_from} onChange={(e) => setForm({ ...form, effective_from: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="fee-desc">Description</Label>
              <Textarea id="fee-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="fee-tax-inc" checked={form.tax_included} onCheckedChange={(v) => setForm({ ...form, tax_included: v })} />
              <Label htmlFor="fee-tax-inc">Tax included in amount</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="fee-active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label htmlFor="fee-active">Active</Label>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingId ? "Save changes" : "Add fee"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); setForm(emptyFee); }}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-3">
          {feesQuery.isLoading && <p className="text-sm text-muted-foreground">Loading fees…</p>}
          {feesQuery.data?.length === 0 && <p className="text-sm text-muted-foreground">No fees yet.</p>}
          {feesQuery.data?.map((fee) => (
            <Card key={fee.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-medium">
                    {fee.name}{" "}
                    <span className="text-muted-foreground">
                      — {fee.currency} {Number(fee.amount).toFixed(2)}
                    </span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant={fee.active ? "default" : "secondary"}>{fee.active ? "Active" : "Inactive"}</Badge>
                    {Number(fee.tax_rate_percent) > 0 && (
                      <Badge variant="outline">
                        Tax {Number(fee.tax_rate_percent)}% {fee.tax_included ? "incl." : "excl."}
                      </Badge>
                    )}
                    {fee.effective_from && <Badge variant="outline">From {fee.effective_from}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(fee.id);
                      setForm({
                        name: fee.name,
                        amount: String(fee.amount),
                        currency: fee.currency,
                        description: fee.description ?? "",
                        tax_rate_percent: String(fee.tax_rate_percent ?? 0),
                        tax_included: !!fee.tax_included,
                        effective_from: fee.effective_from ?? "",
                        active: !!fee.active,
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Delete "${fee.name}"?`)) deleteMutation.mutate(fee.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
