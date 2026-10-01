import { allSubjects, groupSelectedSubjects } from '@/lib/subjectGroups';
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUSES = ["new", "contacted", "booked", "enrolled", "closed"] as const;

export const Route = createFileRoute("/_authenticated/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries Dashboard — New-Lights Learning Academy" },
      {
        name: "description",
        content: "Staff dashboard for reviewing and managing parent enquiries.",
      },
      { property: "og:title", content: "Enquiries Dashboard — New-Lights Learning Academy" },
      { property: "og:description", content: "Review and manage parent enquiries." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EnquiriesPage,
});

function EnquiriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [view, setView] = useState<"active" | "archived" | "all">("active");


  const rolesQuery = useQuery({
    queryKey: ["my-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role");
      if (error) throw error;
      return data.map((r) => r.role as string);
    },
  });

  const isStaff = (rolesQuery.data ?? []).some((r) => r === "staff" || r === "admin");

  const enquiriesQuery = useQuery({
    queryKey: ["enquiries"],
    enabled: isStaff,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: { status?: string; staff_notes?: string; archived?: boolean };
    }) => {
      const { error } = await supabase.from("enquiries").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Enquiry updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("enquiries").delete().in("id", ids);
      if (error) throw error;
      return ids.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success(count === 1 ? "Enquiry deleted" : `${count} enquiries deleted`);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const all = enquiriesQuery.data ?? [];
  const archivedCount = all.filter((e) => (e as { archived?: boolean }).archived).length;

  const rows = all.filter((e) => {
    const archived = Boolean((e as { archived?: boolean }).archived);
    if (view === "active" && archived) return false;
    if (view === "archived" && !archived) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (subjectFilter !== "all") {
      const subjects = Array.isArray(e.subjects) ? e.subjects : [];
      if (!subjects.includes(subjectFilter)) return false;
    }
    if (classFilter !== "all") {
      if ((e.grade ?? "") !== classFilter) return false;
    }
    return true;
  });


  return (
    <main className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Enquiries</h1>
            <p className="text-sm text-muted-foreground">
              Manage parent enquiries submitted from the website.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">View site</Link>
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </header>

        {rolesQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Checking your access…</p>
        ) : !isStaff ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">Access restricted</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Your account does not have staff access. Ask an administrator to grant you the staff
              role.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">Filter</span>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {allSubjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All classes</SelectItem>
                  {[
                    "Nursery",
                    "Reception",
                    "Year 1",
                    "Year 2",
                    "Year 3",
                    "Year 4",
                    "Year 5",
                    "Year 6",
                    "Year 7",
                    "Year 8",
                  ].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={view} onValueChange={(v) => setView(v as typeof view)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived ({archivedCount})</SelectItem>
                  <SelectItem value="all">Active + archived</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                onClick={() => {
                  setStatusFilter("all");
                  setSubjectFilter("all");
                  setClassFilter("all");
                  setView("active");
                }}
              >
                Clear
              </Button>

              {view === "archived" && archivedCount > 0 && (
                <Button
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    const ids = all
                      .filter((e) => (e as { archived?: boolean }).archived)
                      .map((e) => e.id);
                    if (
                      window.confirm(
                        `Permanently delete all ${ids.length} archived enquiries? This cannot be undone.`,
                      )
                    ) {
                      deleteMutation.mutate(ids);
                    }
                  }}
                >
                  Delete all archived
                </Button>
              )}
            </div>


            {enquiriesQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading enquiries…</p>
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No enquiries yet.</p>
            ) : (
              <div className="space-y-4">
                {rows.map((e) => (
                  <Card key={e.id}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                      <div>
                        <CardTitle className="font-serif text-lg">{e.full_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(e.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary">{e.status}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="grid gap-1 sm:grid-cols-2">
                        <p>
                          <span className="text-muted-foreground">Email: </span>
                          <a className="underline" href={`mailto:${e.email}`}>
                            {e.email}
                          </a>
                        </p>
                        {e.phone && (
                          <p>
                            <span className="text-muted-foreground">Phone: </span>
                            <a className="underline" href={`tel:${e.phone}`}>
                              {e.phone}
                            </a>
                          </p>
                        )}
                        {e.grade && (
                          <p>
                            <span className="text-muted-foreground">Grade: </span>
                            {e.grade}
                          </p>
                        )}
                        {e.programme && (
                          <p>
                            <span className="text-muted-foreground">Programme: </span>
                            {e.programme}
                          </p>
                        )}
                        {e.preferred_date && (
                          <p>
                            <span className="text-muted-foreground">Preferred date: </span>
                            {e.preferred_date}
                          </p>
                        )}
                      </div>

                      {(() => {
                        const grouped = groupSelectedSubjects(
                          (e as { subjects?: unknown }).subjects,
                        );
                        if (!grouped.length) return null;
                        const total = grouped.reduce((n, g) => n + g.subjects.length, 0);
                        return (
                          <div>
                            <p className="text-muted-foreground">
                              Subjects selected ({total})
                            </p>
                            <div className="mt-2 space-y-2">
                              {grouped.map(({ group, subjects }) => (
                                <div key={group} className="mb-1">
                                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    {group}
                                  </div>
                                  <div className="mt-1 flex flex-wrap gap-1.5">
                                    {subjects.map((s) => (
                                      <Badge key={s} variant="outline">
                                        {s}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}


                      {e.message && <p className="rounded-md bg-muted p-3">{e.message}</p>}


                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Select
                          value={e.status}
                          onValueChange={(status) =>
                            updateMutation.mutate({ id: e.id, values: { status } })
                          }
                        >
                          <SelectTrigger className="w-44">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateMutation.mutate({
                              id: e.id,
                              values: { archived: !(e as { archived?: boolean }).archived },
                            })
                          }
                        >
                          {(e as { archived?: boolean }).archived ? "Restore" : "Archive"}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={deleteMutation.isPending}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Permanently delete the enquiry from ${e.full_name}? This cannot be undone.`,
                              )
                            ) {
                              deleteMutation.mutate([e.id]);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>


                      <NotesEditor
                        initial={e.staff_notes ?? ""}
                        onSave={(staff_notes) =>
                          updateMutation.mutate({ id: e.id, values: { staff_notes } })
                        }
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function NotesEditor({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        placeholder="Staff notes…"
        onChange={(ev) => setValue(ev.target.value)}
      />
      <Button size="sm" variant="secondary" onClick={() => onSave(value)}>
        Save notes
      </Button>
    </div>
  );
}
