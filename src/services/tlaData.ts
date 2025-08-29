// src/services/tlaData.ts
import { supabase } from "@/lib/supabaseClient";

/** Haal posts op via de view die RLS-safe is. */
export async function fetchTlaPosts(opts?: { search?: string; limit?: number; offset?: number }) {
  const { search = "", limit = 20, offset = 0 } = opts ?? {};
  let q = supabase
    .from("tla_posts_visible")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) q = q.ilike("title", `%${search}%`);
  const { data, error, count } = await q;
  return { data: data ?? [], error, count: count ?? 0 };
}

/** Haal ideas op via de view die RLS-safe is. */
export async function fetchTlaIdeas(opts?: { status?: string; limit?: number; offset?: number }) {
  const { status, limit = 20, offset = 0 } = opts ?? {};
  let q = supabase
    .from("tla_ideas_visible")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) q = q.eq("status", status);
  const { data, error, count } = await q;
  return { data: data ?? [], error, count: count ?? 0 };
}
