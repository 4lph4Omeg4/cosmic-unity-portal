// supabase/functions/checkout/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.24.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});

// ——— CORS helpers ———
function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "*"; // wil je strakker? zet hier je domein
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "content-type,authorization",
    "Vary": "Origin",
    "Content-Type": "application/json",
  };
}

type Payload = { org_id?: string; price_id?: string };

const DEFAULT_PRICE_ID = "price_1S1VMWFlYXjX03EzHKNwtkWW"; // jouw prijs fallback

Deno.serve(async (req: Request) => {
  const headers = corsHeaders(req);

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  try {
    const { org_id, price_id }: Payload = await req.json().catch(() => ({}));

    if (!org_id) {
      return new Response(JSON.stringify({ error: "Missing org_id" }), { status: 400, headers });
    }

    // Gebruik body.price_id of val terug op je default price
    const price = (price_id && price_id.trim()) || DEFAULT_PRICE_ID;

    const appUrl = Deno.env.get("NEXT_PUBLIC_APP_URL");
    if (!appUrl) {
      return new Response(JSON.stringify({ error: "NEXT_PUBLIC_APP_URL not set" }), { status: 500, headers });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url: `${appUrl}/tla?session=success`,
      cancel_url: `${appUrl}/tla?session=cancel`,
      client_reference_id: org_id,                       // koppelt sessie aan jouw org
      subscription_data: { metadata: { org_id } },       // org_id ook in subscription voor webhooks
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers });
  } catch (err: any) {
    console.error("checkout error:", err);
    return new Response(JSON.stringify({ error: err?.message ?? "Unknown error" }), { status: 500, headers });
  }
});
