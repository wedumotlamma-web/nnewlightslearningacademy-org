import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { subjectGroups, ADDRESS_LINES, EMAIL, PHONE, PHONE_TEL } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [
      { title: "Online Registration | New-Lights Learning Academy" },
      {
        name: "description",
        content:
          "Register your child online at New-Lights Learning Academy in Tlokweng — student details, subject choices, guardian information and consent in one form.",
      },
      { property: "og:title", content: "Online Registration | New-Lights Learning Academy" },
      {
        property: "og:description",
        content:
          "Complete the New-Lights Learning Academy registration form online: student details, subjects, guardian information and consent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const registrationSchema = z.object({
  student_name: z.string().trim().min(2, "Enter the student's full name").max(120),
  date_of_birth: z.string().trim().max(20).optional().or(z.literal("")),
  id_number: z.string().trim().max(40).optional().or(z.literal("")),
  grade_level: z.string().trim().max(50).optional().or(z.literal("")),
  student_email: z.string().trim().max(255).optional().or(z.literal("")),
  student_phone: z.string().trim().max(30).optional().or(z.literal("")),
  special_needs: z.string().trim().max(1000).optional().or(z.literal("")),
  guardian1_name: z.string().trim().min(2, "Enter the parent/guardian name").max(120),
  guardian1_id: z.string().trim().max(40).optional().or(z.literal("")),
  guardian1_relationship: z.string().trim().max(50).optional().or(z.literal("")),
  guardian1_address: z.string().trim().max(300).optional().or(z.literal("")),
  guardian1_phone: z.string().trim().min(5, "Enter a contact number").max(30),
  guardian1_work_phone: z.string().trim().max(30).optional().or(z.literal("")),
  guardian1_email: z.string().trim().email("Enter a valid email address").max(255),
  guardian2_name: z.string().trim().max(120).optional().or(z.literal("")),
  guardian2_id: z.string().trim().max(40).optional().or(z.literal("")),
  guardian2_relationship: z.string().trim().max(50).optional().or(z.literal("")),
  guardian2_address: z.string().trim().max(300).optional().or(z.literal("")),
  guardian2_phone: z.string().trim().max(30).optional().or(z.literal("")),
  guardian2_work_phone: z.string().trim().max(30).optional().or(z.literal("")),
  guardian2_email: z.string().trim().max(255).optional().or(z.literal("")),
  emergency_name: z.string().trim().max(120).optional().or(z.literal("")),
  emergency_relationship: z.string().trim().max(50).optional().or(z.literal("")),
  emergency_phone: z.string().trim().max(30).optional().or(z.literal("")),
});

const attendanceModes = ["Full-Time", "Part-Time", "Online"];

const gradeLevels = [
  "Nursery",
  "Reception",
  "Standard 1",
  "Standard 2",
  "Standard 3",
  "Standard 4",
  "Standard 5",
  "Standard 6",
  "Standard 7",
  "Form 1",
  "Form 2",
  "Form 3",
  "Form 4",
  "Form 5",
  "IGCSE",
];

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subjects, setSubjects] = useState<string[]>([]);
  const [attendanceMode, setAttendanceMode] = useState("");
  const [photoConsent, setPhotoConsent] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function toggleSubject(subject: string, checked: boolean) {
    setSubjects((prev) => (checked ? [...prev, subject] : prev.filter((s) => s !== subject)));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = registrationSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Please check the highlighted fields.");
      return;
    }
    if (!agreedTerms) {
      toast.error("Please accept the code of conduct and payment agreement to continue.");
      return;
    }
    setErrors({});
    setSubmitting(true);

    const v = parsed.data;
    const { error } = await supabase.from("registrations").insert({
      student_name: v.student_name,
      date_of_birth: v.date_of_birth || null,
      id_number: v.id_number || null,
      grade_level: v.grade_level || null,
      student_email: v.student_email || null,
      student_phone: v.student_phone || null,
      subjects,
      special_needs: v.special_needs || null,
      attendance_mode: attendanceMode || null,
      guardian1_name: v.guardian1_name,
      guardian1_id: v.guardian1_id || null,
      guardian1_relationship: v.guardian1_relationship || null,
      guardian1_address: v.guardian1_address || null,
      guardian1_phone: v.guardian1_phone,
      guardian1_work_phone: v.guardian1_work_phone || null,
      guardian1_email: v.guardian1_email,
      guardian2_name: v.guardian2_name || null,
      guardian2_id: v.guardian2_id || null,
      guardian2_relationship: v.guardian2_relationship || null,
      guardian2_address: v.guardian2_address || null,
      guardian2_phone: v.guardian2_phone || null,
      guardian2_work_phone: v.guardian2_work_phone || null,
      guardian2_email: v.guardian2_email || null,
      emergency_name: v.emergency_name || null,
      emergency_relationship: v.emergency_relationship || null,
      emergency_phone: v.emergency_phone || null,
      photo_consent: photoConsent,
      agreed_terms: agreedTerms,
    });

    setSubmitting(false);

    if (error) {
      toast.error("We couldn't submit your registration. Please try again or WhatsApp us.");
      return;
    }

    toast.success("Registration received! Our office will contact you shortly.");
    form.reset();
    setSubjects([]);
    setAttendanceMode("");
    setPhotoConsent(false);
    setAgreedTerms(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function Field({
    name,
    label,
    type = "text",
    placeholder,
    maxLength,
  }: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    maxLength?: number;
  }) {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input id={name} name={name} type={type} placeholder={placeholder} maxLength={maxLength} />
        {errors[name] && <p className="text-sm text-destructive">{errors[name]}</p>}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-14">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            New-Lights Learning Academy
          </p>
          <h1 className="font-serif text-3xl text-foreground sm:text-4xl">Online Registration Form</h1>
          <p className="text-muted-foreground">
            Dream It — Believe It — Achieve It. Complete the form below and our office will confirm
            your child's placement.
          </p>
          <Link to="/" className="inline-block text-sm text-primary underline">
            Back to the website
          </Link>
        </header>

        {submitted && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
            Thank you — your registration has been received. We'll be in touch on the contact details
            you provided.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10" noValidate>
          <section className="space-y-5">
            <h2 className="font-serif text-xl text-foreground">1. Student information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="student_name" label="Student name" maxLength={120} placeholder="Full name" />
              <Field name="date_of_birth" label="Date of birth" type="date" />
              <Field name="id_number" label="ID / birth certificate number" maxLength={40} />
              <div className="space-y-2">
                <Label htmlFor="grade_level">Grade / Form level</Label>
                <select id="grade_level" name="grade_level" defaultValue="" className={selectClass}>
                  <option value="">Select level</option>
                  {gradeLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <Field name="student_email" label="Student email (optional)" type="email" maxLength={255} />
              <Field name="student_phone" label="Student contact number (optional)" maxLength={30} />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-serif text-xl text-foreground">2. Academic information</h2>
            <fieldset className="space-y-4">
              <legend className="text-sm font-medium text-foreground">Subjects</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                {subjectGroups.map((group) => (
                  <div key={group.group} className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">{group.group}</p>
                    <div className="space-y-2">
                      {group.options.map((option) => {
                        const id = `reg-subject-${option.replace(/\s+/g, "-").toLowerCase()}`;
                        return (
                          <div key={option} className="flex items-center gap-2">
                            <Checkbox
                              id={id}
                              checked={subjects.includes(option)}
                              onCheckedChange={(checked) => toggleSubject(option, checked === true)}
                            />
                            <Label htmlFor={id} className="text-sm font-normal">
                              {option}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor="special_needs">Special academic needs</Label>
              <Textarea id="special_needs" name="special_needs" rows={3} maxLength={1000} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendance_mode">Attendance</Label>
              <select
                id="attendance_mode"
                value={attendanceMode}
                onChange={(e) => setAttendanceMode(e.target.value)}
                className={selectClass}
              >
                <option value="">Select an option</option>
                {attendanceModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-serif text-xl text-foreground">3. Parent / guardian 1</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="guardian1_name" label="Full name" maxLength={120} />
              <Field name="guardian1_id" label="ID number" maxLength={40} />
              <Field name="guardian1_relationship" label="Relationship to student" maxLength={50} />
              <Field name="guardian1_phone" label="Contact number" maxLength={30} placeholder="+267 71 000 000" />
              <Field name="guardian1_work_phone" label="Work telephone" maxLength={30} />
              <Field name="guardian1_email" label="Email" type="email" maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian1_address">Physical address</Label>
              <Textarea id="guardian1_address" name="guardian1_address" rows={2} maxLength={300} />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-serif text-xl text-foreground">4. Parent / guardian 2 (optional)</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="guardian2_name" label="Full name" maxLength={120} />
              <Field name="guardian2_id" label="ID number" maxLength={40} />
              <Field name="guardian2_relationship" label="Relationship to student" maxLength={50} />
              <Field name="guardian2_phone" label="Contact number" maxLength={30} />
              <Field name="guardian2_work_phone" label="Work telephone" maxLength={30} />
              <Field name="guardian2_email" label="Email" type="email" maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian2_address">Physical address</Label>
              <Textarea id="guardian2_address" name="guardian2_address" rows={2} maxLength={300} />
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="font-serif text-xl text-foreground">5. Emergency contact</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field name="emergency_name" label="Full name" maxLength={120} />
              <Field name="emergency_relationship" label="Relationship" maxLength={50} />
              <Field name="emergency_phone" label="Contact number" maxLength={30} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-foreground">6. Consent & agreement</h2>
            <div className="space-y-3 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              <p>
                Fees are payable termly or monthly in advance, on or before the first day of each term
                or month. A P100 penalty applies to late payments, and learners with outstanding fees
                may not be permitted in class. The registration fee is non-refundable; tuition may be
                refunded within 7 days if no classes were attended. A full term's or month's written
                notice is required for withdrawal or transfer.
              </p>
              <p>
                By registering, the parent/guardian agrees to cooperate with the school's code of
                conduct and confirms the student will abide by the tuition centre rules and
                regulations.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="photo_consent"
                checked={photoConsent}
                onCheckedChange={(checked) => setPhotoConsent(checked === true)}
              />
              <Label htmlFor="photo_consent" className="text-sm font-normal">
                I agree that my child's photograph may be used by the school in print and electronic
                media.
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="agreed_terms"
                checked={agreedTerms}
                onCheckedChange={(checked) => setAgreedTerms(checked === true)}
              />
              <Label htmlFor="agreed_terms" className="text-sm font-normal">
                I accept the code of conduct, payment agreement, refund and withdrawal policies.
              </Label>
            </div>
          </section>

          <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? "Submitting..." : "Submit registration"}
          </Button>
        </form>

        <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
          <p>{ADDRESS_LINES.join(" ")}</p>
          <p>
            Tel <a className="underline" href={`tel:${PHONE_TEL}`}>{PHONE}</a> ·{" "}
            <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
