export function resolveSupabaseUrl(url: unknown, projectId: unknown): string | undefined {
  if (typeof url === 'string') {
    const trimmed = url.trim();
    if (trimmed) return trimmed;
  }

  if (typeof projectId === 'string') {
    const trimmedProjectId = projectId.trim();
    if (trimmedProjectId && /^[a-z0-9-]+$/.test(trimmedProjectId)) {
      return `https://${trimmedProjectId}.supabase.co`;
    }
  }

  return undefined;
}
