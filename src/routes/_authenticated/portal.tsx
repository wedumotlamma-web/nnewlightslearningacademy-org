import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { groupSelectedSubjects, formatSubjectLabel } from "@/lib/subjectGroups";
import { termDates, classOptions } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Student Portal — New-Lights Learning Academy" },
      {
        name: "description",
        content:
          "Registered learners can view their selected subjects, class option and upcoming term dates.",
      },
      { property: "og:title", content: "Student Portal — New-Lights Learning Academy" },
      {
        property: "og:description",
        content: "View your subjects, class option and upcoming term dates.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StudentPortal,
});

type Registration = {
  id: string;
  created_at: string;
  status: string;
  student_name: string;
  grade_level: string | null;
  student_email: string | null;
  attendance_mode: string | null;
  subjects: string[] | null;
  guardian1_name: string | null;
  guardian1_email: string | null;
};

function StudentPortal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select(
          "id, created_at, status, student_name, grade_level, student_email, attendance_mode, subjects, guardian1_name, guardian1_email",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Registration[];
    },
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Student portal</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {email ? `Signed in as ${email}` : "Your registration details"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Back to site</Link>
            </Button>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </header>

        {isLoading && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Loading your details…
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-destructive">
              We couldn't load your details. Please try again later.
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl">No registration found</CardTitle>
              <CardDescription>
                We could not match a registration to {email ?? "this email address"}. Register with
                the same email address you sign in with, or contact the office and we will link your
                record.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/register">Complete a registration</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {data?.map((reg) => {
          const grouped = groupSelectedSubjects(reg.subjects);
          const subjectCount = (reg.subjects ?? []).length;
          return (
            <Card key={reg.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="font-serif text-2xl">{reg.student_name}</CardTitle>
                    <CardDescription>
                      Registered {new Date(reg.created_at).toLocaleDateString()}
                      {reg.grade_level ? ` • ${reg.grade_level}` : ""}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {reg.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Class option
                  </h2>
                  <p className="mt-1 text-foreground">
                    {reg.attendance_mode
                      ? formatSubjectLabel(reg.attendance_mode)
                      : "To be confirmed with the office"}
                  </p>
                </section>

                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Selected subjects ({subjectCount})
                  </h2>
                  {grouped.length === 0 ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      No subjects recorded yet. Contact the office to add them.
                    </p>
                  ) : (
                    <div className="mt-2 space-y-3">
                      {grouped.map((group) => (
                        <div key={group.group}>
                          <p className="text-xs font-medium text-muted-foreground">
                            {group.group}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {group.subjects.map((subject) => (
                              <Badge key={subject} variant="outline">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Upcoming dates</CardTitle>
            <CardDescription>Key dates for the academic calendar.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {termDates.map((term) => (
                <li key={term.term} className="flex flex-wrap justify-between gap-2 py-3">
                  <span className="font-medium text-foreground">{term.term}</span>
                  <span className="text-sm text-muted-foreground">{term.dates}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">Class options we run</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {classOptions.map((option) => (
              <div key={option.title}>
                <p className="font-medium text-foreground">{option.title}</p>
                <p className="text-sm text-muted-foreground">{option.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
