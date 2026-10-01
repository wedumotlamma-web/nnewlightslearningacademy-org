import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FileText,
  Image as ImageIcon,
  Inbox,
  Package,
  Receipt,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSubjectLabel } from "@/lib/subjectGroups";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — New-Lights Learning Academy" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

type Row = { created_at: string; status: string | null; subjects: string[] | null };

const CHART_COLORS = ["#1e3a5f", "#c9a227", "#4f7396", "#8c6d1f", "#93a9c0", "#d9c26a"];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function lastSixMonths() {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: monthKey(d), label: d.toLocaleString("en", { month: "short" }) });
  }
  return months;
}

function useDashboardData() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [enquiries, registrations, fees, packages, staff] = await Promise.all([
        supabase.from("enquiries").select("created_at, status, subjects, archived"),
        supabase.from("registrations").select("created_at, status, subjects"),
        supabase.from("fees").select("name, amount, active"),
        supabase.from("packages").select("name, price, active"),
        supabase.from("staff").select("active"),
      ]);
      return {
        enquiries: (enquiries.data ?? []) as (Row & { archived: boolean })[],
        registrations: (registrations.data ?? []) as Row[],
        fees: fees.data ?? [],
        packages: packages.data ?? [],
        staff: staff.data ?? [],
        restricted: Boolean(enquiries.error || registrations.error),
      };
    },
  });
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Inbox;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-bold">{value}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const { data, isLoading } = useDashboardData();

  const enquiries = data?.enquiries ?? [];
  const registrations = data?.registrations ?? [];
  const fees = data?.fees ?? [];
  const packages = data?.packages ?? [];
  const staff = data?.staff ?? [];

  const months = lastSixMonths();
  const trend = months.map(({ key, label }) => ({
    month: label,
    Enquiries: enquiries.filter((r) => monthKey(new Date(r.created_at)) === key).length,
    Registrations: registrations.filter((r) => monthKey(new Date(r.created_at)) === key).length,
  }));

  const statusCounts = new Map<string, number>();
  enquiries.forEach((r) => {
    const key = r.status ?? "new";
    statusCounts.set(key, (statusCounts.get(key) ?? 0) + 1);
  });
  const statusData = Array.from(statusCounts, ([name, value]) => ({ name, value }));

  const subjectCounts = new Map<string, number>();
  [...enquiries, ...registrations].forEach((r) =>
    (r.subjects ?? []).forEach((s) => subjectCounts.set(s, (subjectCounts.get(s) ?? 0) + 1)),
  );
  const topSubjects = Array.from(subjectCounts, ([value, count]) => ({
    subject: formatSubjectLabel(value),
    count,
  }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const activeFees = fees.filter((f) => f.active);
  const feeChart = activeFees
    .slice(0, 8)
    .map((f) => ({ name: f.name, amount: Number(f.amount) }));
  const currentMonth = monthKey(new Date());
  const enquiriesThisMonth = enquiries.filter(
    (r) => monthKey(new Date(r.created_at)) === currentMonth,
  ).length;

  return (
    <main className="min-h-screen bg-secondary px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Admin dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An overview of enquiries, registrations, fees, packages and staff.
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading your numbers…</p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric
                icon={Inbox}
                label="Enquiries"
                value={enquiries.length}
                hint={`${enquiriesThisMonth} this month`}
              />
              <Metric
                icon={UserPlus}
                label="Registrations"
                value={registrations.length}
                hint={`${registrations.filter((r) => (r.status ?? "new") === "new").length} awaiting review`}
              />
              <Metric
                icon={Receipt}
                label="Active fees"
                value={activeFees.length}
                hint={
                  activeFees.length
                    ? `Average BWP ${Math.round(
                        activeFees.reduce((sum, f) => sum + Number(f.amount), 0) / activeFees.length,
                      ).toLocaleString()}`
                    : "No fees added yet"
                }
              />
              <Metric
                icon={Users}
                label="Staff"
                value={staff.filter((s) => s.active).length}
                hint={`${packages.filter((p) => p.active).length} active packages`}
              />
            </div>

            {data?.restricted ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Some enquiry and registration figures may be hidden because this account does not
                have staff access.
              </p>
            ) : null}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Enquiries &amp; registrations — last 6 months</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis allowDecimals={false} fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Enquiries" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Registrations" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enquiries by status</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  {statusData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No enquiries yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                          {statusData.map((entry, i) => (
                            <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most requested subjects</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {topSubjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No subject selections yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topSubjects} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" allowDecimals={false} fontSize={12} />
                        <YAxis type="category" dataKey="subject" width={140} fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="count" fill={CHART_COLORS[2]} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active fees (BWP)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {feeChart.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No fees added yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={feeChart} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" fontSize={12} />
                        <YAxis type="category" dataKey="name" width={140} fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="amount" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            <h2 className="mt-10 font-display text-xl font-bold">Manage</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  to: "/admin/homepage" as const,
                  icon: ImageIcon,
                  title: "Homepage content",
                  body: "About text, courses, gallery photos, contact form wording, fees and term dates",
                },
                {
                  to: "/admin/fees" as const,
                  icon: Receipt,
                  title: "Fees",
                  body: "Create and update tuition fees and tax settings",
                },
                {
                  to: "/admin/packages" as const,
                  icon: Package,
                  title: "Packages",
                  body: "Bundle fees into packages families can choose",
                },
                {
                  to: "/admin/staff" as const,
                  icon: Users,
                  title: "Staff",
                  body: "Manage staff records, roles and employment type",
                },
                {
                  to: "/admin/pages" as const,
                  icon: FileText,
                  title: "Pages",
                  body: "Manage website pages and content",
                },
                {
                  to: "/admin/settings" as const,
                  icon: Settings,
                  title: "Settings",
                  body: "Update site configuration and contact information",
                },
              ].map(({ to, icon: Icon, title, body }) => (
                <Link key={to} to={to}>
                  <Card className="h-full cursor-pointer transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{body}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
