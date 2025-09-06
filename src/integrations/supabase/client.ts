// src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { storage: localStorage },
})

export default supabase
export { supabase } // <-- named export erbij, zodat { supabase } ook werkt
