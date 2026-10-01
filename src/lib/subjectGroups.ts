import { subjectGroups as siteSubjectGroups } from "@/lib/site";

export const subjectGroups: Record<string, string[]> = Object.fromEntries(
  siteSubjectGroups.map((group) => [group.group, group.options]),
);

export const allSubjects = Object.values(subjectGroups).flat();

/** Turn a stored value like "core-math" or "core_mathematics" into "Core Mathematics". */
export function formatSubjectLabel(value: string): string {
  const known = allSubjects.find(
    (s) => s.toLowerCase() === value.toLowerCase().replace(/[-_]+/g, " ").trim(),
  );
  if (known) return known;
  return value
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export type GroupedSubjects = { group: string; subjects: string[] }[];

/** Group a selection into the site's categories, in canonical order, with leftovers under "Other". */
export function groupSelectedSubjects(selected: unknown): GroupedSubjects {
  const values = Array.isArray(selected) ? selected.filter((v): v is string => typeof v === "string") : [];
  if (values.length === 0) return [];

  const labels = values.map(formatSubjectLabel);
  const remaining = new Set(labels);
  const result: GroupedSubjects = [];

  for (const { group, options } of siteSubjectGroups) {
    const matched = options.filter((option) => remaining.has(option));
    if (matched.length) {
      matched.forEach((m) => remaining.delete(m));
      result.push({ group, subjects: matched });
    }
  }

  if (remaining.size) {
    result.push({ group: "Other", subjects: [...remaining] });
  }

  return result;
}
