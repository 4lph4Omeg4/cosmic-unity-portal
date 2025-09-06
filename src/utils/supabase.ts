// src/utils/supabase.ts
// Laat dit bestand NIETS zelf aanmaken; gebruik 1 bron: integrations/client

import supabaseClient from "@/integrations/supabase/client";

// Exporteer zowel default als named, zodat
// - import supabase from "@/utils/supabase"
// - import { supabase } from "@/utils/supabase"
// allebei werken.
const supabase = supabaseClient;

export default supabase;
export { supabase };
