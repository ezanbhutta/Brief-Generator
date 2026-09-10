import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client. Never import this from a client component.
//
// Config resolution: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars win
// when they point at a live project. The original Supabase project
// (itrbscrleqetbcaagsuc) was deleted, which took the whole app down while
// Vercel's env vars still pointed at it — so any env value referencing that
// dead project is ignored and the fallback below is used instead.
//
// The fallback needs no API key: it talks to the `pgrst` edge function on
// the replacement Supabase project, a proxy that only exposes the brief
// generator's four tables (briefs, designers, assignments,
// pending_industries) and holds its own credentials server-side. That
// mirrors the app's existing posture — these API routes are public and
// unauthenticated anyway. To move databases later, set the env vars in
// Vercel; they take precedence as long as they don't reference the dead
// project.

const DEAD_PROJECT_REF = "itrbscrleqetbcaagsuc";

const FALLBACK_URL = "https://aeytsgipuuyjlbvebhez.supabase.co/functions/v1/pgrst";
// supabase-js requires a non-empty key; the proxy ignores it entirely.
const FALLBACK_KEY = "public-proxy";

function resolveConfig(): { url: string; key: string } {
  const envUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (envUrl && envKey && !envUrl.includes(DEAD_PROJECT_REF)) {
    return { url: envUrl, key: envKey };
  }
  return { url: FALLBACK_URL, key: FALLBACK_KEY };
}

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;
  const { url, key } = resolveConfig();
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

export function supabaseIsConfigured(): boolean {
  return true; // The built-in fallback means the app is always configured.
}
