import { createFileRoute, Outlet, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldAlert, LogOut } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin-login" });
    return { user: data.user };
  },
  component: AdminGate,
});

function AdminGate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const adminQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { email: null as string | null, isAdmin: false };
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (error) throw error;
      return { email: user.email ?? null, isAdmin: data.some((r) => r.role === "admin") };
    },
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin-login", replace: true });
  }

  if (adminQuery.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!adminQuery.data?.isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mb-2 flex items-center gap-2 text-destructive">
              <ShieldAlert className="h-5 w-5" />
              <CardTitle className="font-display text-2xl">Administrators only</CardTitle>
            </div>
            <CardDescription>
              {adminQuery.data?.email
                ? `You are signed in as ${adminQuery.data.email}, which does not have administrator access.`
                : "You need to sign in with an administrator account."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign in with another account
            </Button>
            <div className="text-center text-sm">
              <Link to="/" className="text-primary underline-offset-4 hover:underline">
                Back to website
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <Outlet />;
}
