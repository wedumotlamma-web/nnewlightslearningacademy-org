# Feature: Admin fees, packages, and staff fields

This branch implements the first, non-destructive migration and documentation for adding admin-manageable fees and packages, and expanding the staff/account schema to capture additional required fields.

Summary of what I added in this first change (safe, non-destructive migration):

- migrations/20260824_add_staff_fees_packages.sql
  - Creates `fees`, `packages`, and `package_fees` tables (if missing).
  - Adds non-destructive ALTERs to `staff` table to add: first_name, last_name, gender, marital_status, physical_address, phone, roles (JSONB array), specified_role, employment_type, created_by_name.
  - Adds tax support: tax_rate_percent and tax_included on fees and packages.
  - Uses currency default 'BWP' (Botswana Pula).
  - Uses default created_by_name = 'Botlhe Wedu Motlamma' when a creator id is not available.

Why this is split into a dedicated migration PR
- Keeps schema changes reviewable and small.
- Adds columns as nullable/defaulted to avoid breaking existing data.

Next planned PRs (separate, smaller PRs)
1) Models/ORM layer updates (add Fee and Package models, add staff fields to Staff model) — includes migration-aware model code and unit tests.
2) Admin API endpoints for CRUD on fees and packages with permission checks (admin-only). Includes created_by/updated_by handling and validation.
3) Admin UI pages and forms for staff create/edit (roles checkboxes + specify role), fees & packages CRUD screens, and package builder UI.
4) Tests and end-to-end verification, plus small UX polish PRs.

Notes & implementation decisions
- Roles are stored as a JSONB array on staff (e.g., `["teacher","admin"]`) for flexibility. If strict referential integrity is required later, we can convert to a roles table and a join table in a follow-up PR.
- Currency is fixed to BWP by default; price fields include a currency column if multi-currency support is needed later.
- Tax fields added: tax_rate_percent (numeric) and tax_included (boolean) so the system can represent prices that either include tax or need tax added on top.
- created_by and created_by_name are included; created_by_name defaults to 'Botlhe Wedu Motlamma' per your request.

How to apply the migration
- This is plain SQL; run it against your Postgres database using your normal migration tooling.
- If you use a framework migration system (e.g., Prisma, TypeORM, Django migrations), port the SQL changes to the framework's migration format instead of running raw SQL.

If you'd like, I can now open a Pull Request with this migration and the docs (recommended). After that I will implement PR #2 (models/ORM changes).