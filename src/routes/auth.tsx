import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { lovable } from "@/integrations/lovable";
import "@lovable.dev/cloud-auth-js/styles.css";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff Login — New-Lights Learning Academy" },
      {
        name: "description",
        content:
          "Secure staff sign-in for New-Lights Learning Academy to review and manage parent enquiries.",
      },
      { property: "og:title", content: "Staff Login — New-Lights Learning Academy" },
      {
        property: "og:description",
        content: "Secure staff sign-in to review and manage parent enquiries.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

/** Staff land on the enquiries dashboard; everyone else lands in the student portal. */
async function destinationForCurrentUser(): Promise<"/enquiries" | "/portal"> {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return "/portal";
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const isStaff = (roles ?? []).some((r) => r.role === "staff" || r.role === "admin");
  return isStaff ? "/enquiries" : "/portal";
}

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) navigate({ to: await destinationForCurrentUser(), replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        navigate({ to: await destinationForCurrentUser(), replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/portal` },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Account created");
          navigate({ to: await destinationForCurrentUser(), replace: true });
        } else {
          toast.success("Check your email to confirm your account.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      toast.success("Signed in with Google");
      navigate({ to: await destinationForCurrentUser(), replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLovableSignIn() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("lovable", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      toast.success("Signed in with Lovable");
      navigate({ to: await destinationForCurrentUser(), replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lovable sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleMicrosoftSignIn() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("microsoft", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      toast.success("Signed in with Microsoft");
      navigate({ to: await destinationForCurrentUser(), replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Microsoft sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAppleSignIn() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      toast.success("Signed in with Apple");
      navigate({ to: await destinationForCurrentUser(), replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Apple sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Sign in</CardTitle>
          <CardDescription>
            Registered learners see their subjects, class and dates; staff go to the enquiries
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={handleGoogleSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1H12v2.9h5.35c-.25 1.3-1.5 3.8-5.35 3.8-3.22 0-5.85-2.67-5.85-5.95S8.78 5.9 12 5.9c1.84 0 3.07.78 3.78 1.45l2.57-2.47C16.72 3.36 14.6 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.85S6.9 21.3 12 21.3c5.4 0 8.98-3.8 8.98-9.1 0-.3-.03-.75-.08-1.1z"
              />
            </svg>
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="mt-2 w-full"
            disabled={loading}
            onClick={handleAppleSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.98-.2 1.92-.86 3.24-.77 1.58.13 2.77.75 3.55 1.9-3.27 1.96-2.5 6.27.53 7.5-.6 1.57-1.37 3.13-2.4 3.54zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
              />
            </svg>
            Continue with Apple
          </Button>
          <Button
            type="button"
            variant="outline"
            className="mt-2 w-full"
            disabled={loading}
            onClick={handleMicrosoftSignIn}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M13 1h10v10H13z" />
              <path fill="#05a6f0" d="M1 13h10v10H1z" />
              <path fill="#ffba08" d="M13 13h10v10H13z" />
            </svg>
            Continue with Microsoft
          </Button>
          <button
            type="button"
            className="lovable-auth-button mt-2 w-full"
            disabled={loading}
            onClick={handleLovableSignIn}
          >
            Continue with Lovable
          </button>
          <button
            type="button"
            className="mt-4 w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "New here? Create an account with the email you registered with"
              : "Already have an account? Sign in"}
          </button>
          <div className="mt-6 text-center text-sm">
            <Link to="/" className="text-primary underline-offset-4 hover:underline">
              Back to website
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
