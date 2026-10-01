import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/pages")( {
  head: () => ({
    meta: [
      { title: "Manage Pages — New-Lights Learning Academy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PagesManager,
});

function PagesManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", meta_description: "" });

  const pagesQuery = useQuery({
    queryKey: ["admin-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("*").order("created_at");
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
      values: { title: string; content: string; meta_description: string };
    }) => {
      const { error } = await supabase
        .from("pages")
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
      toast.success("Page updated successfully");
      setEditingId(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const handleEdit = (page: any) => {
    setEditingId(page.id);
    setEditForm({
      title: page.title,
      content: page.content || "",
      meta_description: page.meta_description || "",
    });
  };

  const handleSave = () => {
    if (!editingId) return;
    updateMutation.mutate({ id: editingId, values: editForm });
  };

  return (
    <main className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/admin" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-serif text-3xl font-bold">Manage Pages</h1>
        </div>

        {/* Pages List */}
        {pagesQuery.isLoading && (
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Loading pages...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {pagesQuery.data && (
          <div className="space-y-4">
            {pagesQuery.data.map((page: any) => (
              <Card key={page.id}>
                {editingId === page.id ? (
                  /* Edit Mode */
                  <CardHeader>
                    <CardTitle className="text-lg">{page.slug}</CardTitle>
                  </CardHeader>
                ) : null}
                <CardContent className={editingId === page.id ? "space-y-4" : "space-y-4 pt-6"}>
                  {editingId === page.id ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="meta">Meta Description</Label>
                        <Input
                          id="meta"
                          value={editForm.meta_description}
                          onChange={(e) =>
                            setEditForm({ ...editForm, meta_description: e.target.value })
                          }
                          placeholder="Description for search engines"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Content (JSON)</Label>
                        <Textarea
                          id="content"
                          value={editForm.content}
                          onChange={(e) =>
                            setEditForm({ ...editForm, content: e.target.value })
                          }
                          className="font-mono text-xs"
                          rows={8}
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-muted-foreground">Slug</p>
                        <p className="font-mono">{page.slug}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Title</p>
                        <p>{page.title}</p>
                      </div>
                      {page.meta_description && (
                        <div>
                          <p className="text-xs text-muted-foreground">Meta Description</p>
                          <p className="text-sm">{page.meta_description}</p>
                        </div>
                      )}
                      {page.content && (
                        <div>
                          <p className="text-xs text-muted-foreground">Content Preview</p>
                          <p className="max-h-20 overflow-auto rounded bg-muted p-2 font-mono text-xs">
                            {page.content.substring(0, 200)}...
                          </p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(page)}
                        >
                          Edit
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
