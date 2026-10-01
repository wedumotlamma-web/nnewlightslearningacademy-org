import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export const listEnquiries = defineTool({
  name: "list_enquiries",
  title: "List enquiries",
  description: "List recent parent enquiries (staff only), optionally filtered by status.",
  inputSchema: {
    status: z.string().optional().describe("Filter by status, e.g. new, contacted, enrolled."),
    include_archived: z.boolean().optional().describe("Include archived enquiries."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows (default 25)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async ({ status, include_archived, limit }, ctx) => {
    const sb = supabaseForUser(ctx);
    let q = sb
      .from("enquiries")
      .select("id,created_at,full_name,email,phone,programme,grade,subjects,status,message,staff_notes,archived")
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);
    if (status) q = q.eq("status", status);
    if (!include_archived) q = q.eq("archived", false);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = (data ?? []).map((r) => ({
      id: String(r.id),
      created_at: String(r.created_at),
      full_name: String(r.full_name),
      email: String(r.email),
      phone: r.phone ? String(r.phone) : null,
      programme: r.programme ? String(r.programme) : null,
      grade: r.grade ? String(r.grade) : null,
      subjects: ((r.subjects as string[] | null) ?? []).map(String),
      status: String(r.status),
      message: r.message ? String(r.message) : null,
      staff_notes: r.staff_notes ? String(r.staff_notes) : null,
    }));
    return {
      content: [{ type: "text", text: rows.length ? JSON.stringify(rows) : "No enquiries visible to this account." }],
      structuredContent: { enquiries: rows },
    };
  },
});

export const updateEnquiry = defineTool({
  name: "update_enquiry",
  title: "Update enquiry",
  description: "Change an enquiry's status and/or staff notes (staff only).",
  inputSchema: {
    id: z.string().uuid().describe("Enquiry id."),
    status: z.string().min(1).optional().describe("New status."),
    staff_notes: z.string().optional().describe("Replacement staff notes."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  handler: async ({ id, status, staff_notes }, ctx) => {
    const patch: { status?: string; staff_notes?: string } = {};
    if (status) patch.status = status;
    if (staff_notes !== undefined) patch.staff_notes = staff_notes;
    if (!Object.keys(patch).length)
      return { content: [{ type: "text", text: "Nothing to update." }], isError: true };
    const { data, error } = await supabaseForUser(ctx).from("enquiries").update(patch).eq("id", id).select("id");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length)
      return { content: [{ type: "text", text: "Enquiry not found or not permitted." }], isError: true };
    return { content: [{ type: "text", text: "Enquiry updated." }] };
  },
});

export const getMyRegistration = defineTool({
  name: "get_my_registration",
  title: "Get my registration",
  description: "Show the signed-in learner's registration: subjects, class level and attendance mode.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: async (_a, ctx) => {
    const email = ctx.getUserEmail();
    const { data, error } = await supabaseForUser(ctx)
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length)
      return { content: [{ type: "text", text: `No registration found for ${email ?? "this account"}.` }] };
    return { content: [{ type: "text", text: JSON.stringify(data) }] };
  },
});
