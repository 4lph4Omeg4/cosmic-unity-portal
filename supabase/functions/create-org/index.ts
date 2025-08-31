// supabase/functions/create-org/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { name } = await req.json();

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: "Missing or empty name" }), { status: 400 });
    }

    // Generate a unique TLA org ID for this client
    const tlaOrgId = `tla_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the TLA organization for this client
    const { data, error } = await supabase
      .from("orgs")
      .insert({
        id: tlaOrgId,
        name: name.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[create-org] error", error);
      return new Response(JSON.stringify({ error: "Failed to create organization" }), { status: 500 });
    }

    console.log("[create-org] created", { tlaOrgId, name });

    return new Response(JSON.stringify({ org_id: tlaOrgId, name: name.trim() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[create-org] error", err);
    return new Response(JSON.stringify({ error: "Organization creation failed" }), { status: 500 });
  }
});
