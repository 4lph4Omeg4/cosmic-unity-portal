import client from "@/integrations/supabase/client";
const supabase = client;
export default supabase;
export { supabase };
// src/lib/supabase.ts (of /utils)
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!, // gebruik de public/publishable/anon key
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // <- belangrijk
    },
  }
);
