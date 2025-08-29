// supabase/functions/checkout/index.ts
// Stripe Checkout (subscription) met strakke CORS + OPTIONS

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@15.4.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Preflight
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  // Alleen POST
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: CORS });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const APP_URL = Deno.env.get("APP_URL") || "http://localhost:8080";
    if (!STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");

    const { org_id, price_id } = await req.json();
    if (!org_id || !price_id) throw new Error("org_id and price_id are required");

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${APP_URL}/timeline-alchemy?session=success`,
      cancel_url: `${APP_URL}/timeline-alchemy?session=cancel`,
      client_reference_id: org_id,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "failed" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
