// supabase/functions/checkout/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.19.0?target=deno";

serve(async (req) => {
  try {
    const key = Deno.env.get("STRIPE_SECRET_KEY");
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), { status: 500 });
    }

    const stripe = new Stripe(key, { apiVersion: "2024-06-20" });
    const { price_id, org_id } = await req.json();

    if (!price_id) {
      return new Response(JSON.stringify({ error: "Missing price_id" }), { status: 400 });
    }

    const origin = req.headers.get("origin")
      || Deno.env.get("PUBLIC_SITE_URL")
      || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing/cancel`,
      allow_promotion_codes: true,
      metadata: { org_id: org_id ?? "unknown" }, // << belangrijk
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[checkout] error", err);
    return new Response(JSON.stringify({ error: "Checkout failed" }), { status: 500 });
  }
});
