import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Supabase client
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Debug function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log("Testing Supabase connection...")
    console.log("URL:", SUPABASE_URL)
    console.log(
      "Key (first 20 chars):",
      SUPABASE_PUBLISHABLE_KEY.substring(0, 20) + "..."
    )

    const { data, error } = await supabase.auth.getSession()
    console.log("Session test result:", { data, error })

    if (error) {
      console.error("Supabase connection error:", error)
    } else {
      console.log("Supabase connection successful")
    }
  } catch (err) {
    console.error("Supabase connection test failed:", err)
  }
}

// Exports: default en named
export default supabase
export { supabase }
