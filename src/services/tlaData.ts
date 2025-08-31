// src/services/tlaData.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export async function fetchTlaPosts() {
  // Als user-auth beschikbaar is: injecteer access token in supabase client
  // (afhankelijk van jouw auth-setup; dit is de basis-variant)
  const { data, error } = await supabase
    .from("tla_posts_visible")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 19);
  return { data, error };
}
