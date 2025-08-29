// supabase/functions/stripe-webhook/index.ts
// Stripe → Supabase subscriptions sync (Edge Function - Deno)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@15.4.0";

// ---- CORS (Stripe stuurt geen browser-requests, maar is handig bij testen)
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, stripe-signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
    if (!STRIPE_WEBHOOK_SECRET) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
      throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    // ⚠️ Belangrijk: raw body gebruiken voor signature verification
    const sig = req.headers.get("stripe-signature") ?? "";
    const raw = await req.text();
    const event = stripe.webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET);

    // helper: simpele Supabase fetch client met service_role (om RLS te omzeilen)
    const sb = async (path: string, method: "POST" | "PATCH", body: unknown) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        method,
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates", // upsert gedrag bij POST met on-conflict
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Supabase error ${res.status}: ${t}`);
      }
      return res.json().catch(() => ({}));
    };

    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as any;
        const org_id = s.client_reference_id as string | null;
        const subscriptionId = s.subscription as string | null;
        const customerId =
          typeof s.customer === "string" ? s.customer : s.customer?.id;

        if (!org_id || !subscriptionId)
          break; // geen org of sub → niets te doen

        // Haal de subscription details (status, price, period-end)
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = (sub.items.data[0]?.price?.id ?? "") as string;
        const status = sub.status;
        const current_period_end = new Date(sub.current_period_end * 1000).toISOString();

        // Upsert in public.subscriptions op basis van stripe_subscription_id
        // NB: vergt een UNIQUE constraint op stripe_subscription_id (die heb je)
        await sb(
          "subscriptions?on_conflict=stripe_subscription_id",
          "POST",
          {
            org_id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: priceId,
            status,
            current_period_end,
          }
        );
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const subscriptionId = sub.id as string;
        const status = sub.status as string;
        const current_period_end = new Date(sub.current_period_end * 1000).toISOString();
        const priceId = sub.items?.data?.[0]?.price?.id ?? undefined;

        // Update op bestaande rij
        await sb(
          `subscriptions?stripe_subscription_id=eq.${subscriptionId}`,
          "PATCH",
          {
            status,
            current_period_end,
            ...(priceId ? { stripe_price_id: priceId } : {}),
          }
        );
        break;
      }

      default:
        // Ongebruikt event → ok
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("Webhook error:", e?.message || e);
    return new Response(JSON.stringify({ error: e?.message || "unknown" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
