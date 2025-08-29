// supabase/functions/stripe-webhook/index.ts
import Stripe from "https://esm.sh/stripe@15.4.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
    if (!WEBHOOK_SECRET) throw new Error("STRIPE_WEBHOOK_SECRET not set");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase service secrets missing");

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    const sig = req.headers.get("stripe-signature") ?? "";
    const raw = await req.text();
    const event = stripe.webhooks.constructEvent(raw, sig, WEBHOOK_SECRET);

    // Helper: Supabase client (simple fetch)
    const sb = async (path: string, method: string, body: any) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
        method,
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Supabase error: ${res.status} ${t}`);
      }
      return res.json();
    };

    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as any;
        const org_id = s.client_reference_id as string | null;
        const subId = s.subscription as string | null;

        if (org_id && subId) {
          // pull sub details for price/status/period
          const sub = await stripe.subscriptions.retrieve(subId);
          const priceId = (sub.items.data[0]?.price?.id ?? "") as string;
          const status = sub.status;
          const current_period_end = new Date(sub.current_period_end * 1000).toISOString();
          const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

          await sb("subscriptions", "POST", {
            org_id,
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            stripe_price_id: priceId,
            status,
            current_period_end,
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const subId = sub.id as string;
        const status = sub.status as string;
        const current_period_end = new Date(sub.current_period_end * 1000).toISOString();

        await sb("subscriptions?stripe_subscription_id=eq." + subId, "PATCH", {
          status,
          current_period_end,
        });
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "unknown" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
