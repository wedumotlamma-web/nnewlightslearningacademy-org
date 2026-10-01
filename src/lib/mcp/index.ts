import { auth, defineMcp } from "@lovable.dev/mcp-js";
import { getMyRegistration, listEnquiries, updateEnquiry } from "./tools/enquiries";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "new-lights-learning-academy",
  title: "New-Lights Learning Academy",
  version: "0.1.0",
  instructions:
    "Tools for New-Lights Learning Academy. Staff can list and update parent enquiries; learners can view their own registration.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listEnquiries, updateEnquiry, getMyRegistration],
});
