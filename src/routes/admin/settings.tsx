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

export const Route = createFileRoute("/admin/settings")( {
  head: () => ({
    meta: [
      { title: "Site Settings — New-Lights Learning Academy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsManager,
});

function SettingsManager() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const settingsQuery = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("key");
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      key,
      value,
    }: {
      key: string;
      value: string;
    }) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Setting updated successfully");
      setEditingKey(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const handleEdit = (setting: any) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
  };

  const handleSave = () => {
    if (!editingKey) return;
    updateMutation.mutate({ key: editingKey, value: editValue });
  };

  return (
    <main className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/admin" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-serif text-3xl font-bold">Site Settings</h1>
        </div>

        {/* Settings List */}
        {settingsQuery.isLoading && (
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p>Loading settings...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {settingsQuery.data && (
          <div className="space-y-4">
            {settingsQuery.data.map((setting: any) => (
              <Card key={setting.key}>
                <CardContent className="space-y-4 pt-6">
                  {editingKey === setting.key ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="key">Key (cannot be changed)</Label>
                        <Input
                          id="key"
                          value={setting.key}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="value">Value</Label>
                        <Textarea
                          id="value"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      </div>
                      {setting.description && (
                        <div>
                          <p className="text-xs text-muted-foreground">{setting.description}</p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingKey(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">{setting.key}</p>
                        {setting.description && (
                          <p className="text-xs text-muted-foreground">{setting.description}</p>
                        )}
                      </div>
                      <div className="rounded bg-muted p-2">
                        <p className="break-all font-mono text-sm">{setting.value}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(setting)}
                      >
                        Edit
                      </Button>
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
