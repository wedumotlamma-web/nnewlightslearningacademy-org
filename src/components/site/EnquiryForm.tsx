import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { subjectGroups } from "@/lib/site";

const enquirySchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  grade: z.string().trim().max(50).optional().or(z.literal("")),
  programme: z.string().trim().max(100).optional().or(z.literal("")),
  preferred_date: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

const programmes = [
  "After-school tuition",
  "Cambridge IGCSE",
  "Full homeschooling",
  "Exam preparation",
  "Holiday programme",
  "Not sure yet",
];

export function EnquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subjects, setSubjects] = useState<string[]>([]);

  function toggleSubject(subject: string, checked: boolean) {
    setSubjects((prev) =>
      checked ? [...prev, subject] : prev.filter((s) => s !== subject),
    );
  }


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = enquirySchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const values = parsed.data;
    const { error } = await supabase.from("enquiries").insert({
      full_name: values.full_name,
      email: values.email,
      phone: values.phone || null,
      grade: values.grade || null,
      programme: values.programme || null,
      preferred_date: values.preferred_date ? values.preferred_date : null,
      message: values.message || null,
      subjects,
    });

    setSubmitting(false);

    if (error) {
      toast.error("We couldn't send your enquiry. Please try again or WhatsApp us.");
      return;
    }

    toast.success("Thank you! We'll contact you within one working day.");
    form.reset();
    setSubjects([]);
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Parent / guardian name</Label>
          <Input id="full_name" name="full_name" maxLength={100} placeholder="Neo Modise" />
          {errors["full_name"] && (
            <p className="text-sm text-destructive">{errors["full_name"]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" maxLength={255} placeholder="you@email.com" />
          {errors["email"] && <p className="text-sm text-destructive">{errors["email"]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone / WhatsApp</Label>
          <Input id="phone" name="phone" maxLength={30} placeholder="+267 71 000 000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grade">Learner's grade</Label>
          <Input id="grade" name="grade" maxLength={50} placeholder="Grade 8" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="programme">Programme of interest</Label>
          <select
            id="programme"
            name="programme"
            defaultValue=""
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <option value="">Select a programme</option>
            {programmes.map((programme) => (
              <option key={programme} value={programme}>
                {programme}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferred_date">Preferred free assessment date</Label>
          <Input id="preferred_date" name="preferred_date" type="date" />
        </div>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-foreground">Subjects of interest</legend>
        <p className="text-sm text-muted-foreground">
          Select all the subjects your child needs support with.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {subjectGroups.map((group) => (
            <div key={group.group} className="space-y-2">
              <p className="text-sm font-semibold text-foreground">{group.group}</p>
              <div className="space-y-2">
                {group.options.map((option) => {
                  const id = `subject-${option.replace(/\s+/g, "-").toLowerCase()}`;
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
        <Label htmlFor="message">How can we help?</Label>
        <Textarea

          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          placeholder="Tell us about your child's subjects and goals."
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending..." : "Book my free assessment"}
      </Button>
    </form>
  );
}
