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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/staff")({
  head: () => ({
    meta: [
      { title: "Manage Staff — New-Lights Learning Academy" },
      { name: "description", content: "Admin tools to record staff members, roles and employment details at New-Lights Learning Academy." },
      { property: "og:title", content: "Manage Staff — New-Lights Learning Academy" },
      { property: "og:description", content: "Record staff members, roles and employment details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StaffManager,
});

const ROLE_OPTIONS = ["teacher", "tutor", "accountant", "administrator", "support", "driver"];
const GENDERS = ["male", "female", "other", "prefer_not_say"];
const MARITAL = ["single", "married", "divorced", "widowed", "other"];

type StaffForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  marital_status: string;
  physical_address: string;
  roles: string[];
  specified_role: string;
  employment_type: string;
  active: boolean;
};

const emptyStaff: StaffForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  gender: "",
  marital_status: "",
  physical_address: "",
  roles: [],
  specified_role: "",
  employment_type: "full_time",
  active: true,
};

function label(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function StaffManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<StaffForm>(emptyStaff);
  const [editingId, setEditingId] = useState<string | null>(null);

  const staffQuery = useQuery({
    queryKey: ["admin-staff"],
    queryFn: async () => {
      const { data, error } = await supabase.from("staff").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: StaffForm) => {
      const payload = {
        first_name: values.first_name.trim() || null,
        last_name: values.last_name.trim() || null,
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        gender: values.gender || null,
        marital_status: values.marital_status || null,
        physical_address: values.physical_address.trim() || null,
        roles: values.roles,
        specified_role: values.specified_role.trim() || null,
        employment_type: values.employment_type,
        active: values.active,
      };
      if (!payload.first_name && !payload.last_name) {
        throw new Error("Please enter at least a first or last name");
      }
      if (editingId) {
        const { error } = await supabase.from("staff").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("staff").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast.success(editingId ? "Staff member updated" : "Staff member added");
      setForm(emptyStaff);
      setEditingId(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast.success("Staff member removed");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  function toggleRole(role: string) {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
    }));
  }

  return (
    <main className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate({ to: "/admin" })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to admin
        </Button>

        <h1 className="font-serif text-3xl font-bold">Staff</h1>
        <p className="mt-2 text-sm text-muted-foreground">Keep a record of staff members, their roles and employment type.</p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{editingId ? "Edit staff member" : "New staff member"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="s-first">First name</Label>
              <Input id="s-first" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="s-last">Last name</Label>
              <Input id="s-last" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="s-email">Email</Label>
              <Input id="s-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="s-phone">Phone</Label>
              <Input id="s-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {label(g)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Marital status</Label>
              <Select value={form.marital_status} onValueChange={(v) => setForm({ ...form, marital_status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {MARITAL.map((m) => (
                    <SelectItem key={m} value={m}>
                      {label(m)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Employment type</Label>
              <Select value={form.employment_type} onValueChange={(v) => setForm({ ...form, employment_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full time</SelectItem>
                  <SelectItem value="part_time">Part time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="s-specified">Other role (specify)</Label>
              <Input id="s-specified" value={form.specified_role} onChange={(e) => setForm({ ...form, specified_role: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="s-address">Physical address</Label>
              <Textarea id="s-address" value={form.physical_address} onChange={(e) => setForm({ ...form, physical_address: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Roles</Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {ROLE_OPTIONS.map((role) => (
                  <label key={role} className="flex items-center gap-2 rounded-md border bg-background p-2 text-sm">
                    <Checkbox checked={form.roles.includes(role)} onCheckedChange={() => toggleRole(role)} />
                    <span>{label(role)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="s-active" checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label htmlFor="s-active">Active</Label>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {editingId ? "Save changes" : "Add staff member"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); setForm(emptyStaff); }}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-3">
          {staffQuery.isLoading && <p className="text-sm text-muted-foreground">Loading staff…</p>}
          {staffQuery.data?.length === 0 && <p className="text-sm text-muted-foreground">No staff members yet.</p>}
          {staffQuery.data?.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <p className="font-medium">
                    {[member.first_name, member.last_name].filter(Boolean).join(" ") || member.email || "Unnamed"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[member.email, member.phone].filter(Boolean).join(" · ")}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant={member.active ? "default" : "secondary"}>{member.active ? "Active" : "Inactive"}</Badge>
                    <Badge variant="outline">{label(member.employment_type)}</Badge>
                    {(member.roles ?? []).map((r: string) => (
                      <Badge key={r} variant="outline">
                        {label(r)}
                      </Badge>
                    ))}
                    {member.specified_role && <Badge variant="outline">{member.specified_role}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(member.id);
                      setForm({
                        first_name: member.first_name ?? "",
                        last_name: member.last_name ?? "",
                        email: member.email ?? "",
                        phone: member.phone ?? "",
                        gender: member.gender ?? "",
                        marital_status: member.marital_status ?? "",
                        physical_address: member.physical_address ?? "",
                        roles: member.roles ?? [],
                        specified_role: member.specified_role ?? "",
                        employment_type: member.employment_type ?? "full_time",
                        active: !!member.active,
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Remove this staff member?")) deleteMutation.mutate(member.id);
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
