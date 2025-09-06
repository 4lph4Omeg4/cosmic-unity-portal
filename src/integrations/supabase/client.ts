// src/integrations/supabase/client.ts

import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Haal de env vars uit Vite (altijd VITE_* voor frontend)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Maak de client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
  },
})

// Alleen default export
export default supabase
