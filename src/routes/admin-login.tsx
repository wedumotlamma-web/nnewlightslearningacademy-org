import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import "@lovable.dev/cloud-auth-js/styles.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import sealLogo from "@/assets/logo-seal.png";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Administrator Login — New-Lights Learning Academy" },
      {
        name: "description",
        content:
          "Secure administrator sign-in for New-Lights Learning Academy to manage fees, packages, staff and website content.",
      },
      { property: "og:title", content: "Administrator Login — New-Lights Learning Academy" },
      {
        property: "og:description",
        content: "Secure administrator sign-in to manage fees, packages, staff and site content.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

async function currentUserIsAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  return (data ?? []).some((r) => r.role === "admin");
}

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    currentUserIsAdmin()
      .then((isAdmin) => {
        if (isAdmin) navigate({ to: "/admin", replace: true });
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw new Error("Incorrect email or password.");

      if (!(await currentUserIsAdmin())) {
        await supabase.auth.signOut();
        throw new Error("This account does not have administrator access.");
      }

      toast.success("Welcome back");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      if (!(await currentUserIsAdmin())) {
        await supabase.auth.signOut();
        throw new Error("This account does not have administrator access.");
      }
      toast.success("Welcome back");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLovableSignIn() {
    setLoading(true);
    setError(null);
    try {
      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("lovable", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      if (!(await currentUserIsAdmin())) {
        await supabase.auth.signOut();
        throw new Error("This account does not have administrator access.");
      }
      toast.success("Welcome back");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lovable sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleMicrosoftSignIn() {
    setLoading(true);
    setError(null);
    try {
      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("microsoft", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      if (!(await currentUserIsAdmin())) {
        await supabase.auth.signOut();
        throw new Error("This account does not have administrator access.");
      }
      toast.success("Welcome back");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Microsoft sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAppleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      if (!(await currentUserIsAdmin())) {
        await supabase.auth.signOut();
        throw new Error("This account does not have administrator access.");
      }
      toast.success("Welcome back");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apple sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email address first, then tap “Forgot password?”.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (resetError) setError(resetError.message);
    else toast.success("Password reset link sent. Check your inbox.");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-secondary">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src={sealLogo}
            alt="New-Lights Learning Academy crest"
            className="mx-auto h-20 w-20 object-contain"
          />
          <CardTitle className="mt-4 flex items-center justify-center gap-2 font-display text-2xl">
            <ShieldCheck className="h-5 w-5 text-gold" aria-hidden="true" />
            Administrator login
          </CardTitle>
          <CardDescription>
            Sign in to manage fees, packages, staff and homepage content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email address</Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in
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
            onClick={handleForgotPassword}
            className="mt-4 w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Forgot password?
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
