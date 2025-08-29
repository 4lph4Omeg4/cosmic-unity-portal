// src/services/tlaData.ts
import { supabase } from "@/lib/supabaseClient";

export async function fetchTlaPosts({ search = "", limit = 20, offset = 0 } = {}) {
  let q = supabase.from("tla_posts_visible").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (search) q = q.ilike("title", `%${search}%`);
  return q; // { data, error, count }
}

export async function fetchTlaIdeas({ status, limit = 20, offset = 0 }: { status?: string; limit?: number; offset?: number } = {}) {
  let q = supabase.from("tla_ideas_visible").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (status) q = q.eq("status", status);
  return q; // { data, error, count }
}
