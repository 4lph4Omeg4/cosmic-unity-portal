import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@15.4.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!webhookSecret || !stripeKey || !url || !serviceRole) {
    console.error("[webhook] missing envs", { hasWebhook: !!webhookSecret, hasKey: !!stripeKey, hasUrl: !!url, hasSrv: !!serviceRole });
    return new Response("Missing envs", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
  const raw = await req.text();

  let event: any;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig!, webhookSecret);
  } catch (err) {
    console.error("[webhook] bad signature", err);
    return new Response("Bad signature", { status: 400 });
  }

  const sb = createClient(url, serviceRole);

  async function upsertSub(org_id: string, customer_id: string, sub_id: string | null, status: string, cpe?: number) {
    try {
      await sb.from("orgs").upsert({ id: org_id });
      const current_period_end = cpe ? new Date(cpe * 1000).toISOString() : null;

      const { error } = await sb.from("org_subscriptions").upsert(
        {
          org_id,
          stripe_customer_id: customer_id,
          stripe_subscription_id: sub_id ?? undefined,
          status,
          current_period_end,
        },
        { onConflict: "stripe_subscription_id" }
      );
      if (error) console.error("[webhook] upsert error", error);
      else console.log("[webhook] upsert ok", { org_id, customer_id, sub_id, status });
    } catch (e) {
      console.error("[webhook] upsert exception", e);
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as any;
        const org_id = s?.metadata?.org_id ?? s?.client_reference_id ?? null;
        const customer_id = (s?.customer as string) ?? null;
        const sub_id = (s?.subscription as string) ?? null;
        console.log("[webhook] checkout.session.completed", { org_id, customer_id, sub_id });
        if (org_id && customer_id) await upsertSub(org_id, customer_id, sub_id, "active");
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const customer_id = sub.customer as string;
        const status = sub.status as string;
        const cpe = sub.current_period_end as number;

        // org_id zoeken via eerdere row
        let org_id: string | null = null;
        const { data: existing } = await sb
          .from("org_subscriptions")
          .select("org_id")
          .eq("stripe_customer_id", customer_id)
          .maybeSingle();
        org_id = existing?.org_id ?? org_id;

        // fallback: probeer via price/product metadata (als je daar org_id opslaat)
        if (!org_id) {
          const price = sub.items?.data?.[0]?.price;
          org_id = price?.metadata?.org_id ?? null;
        }

        // laatste fallback: klant zelf als tijdelijke key
        if (!org_id) org_id = customer_id;

        console.log("[webhook] subscription.upsert", { org_id, customer_id, sub_id: sub.id, status });
        await upsertSub(org_id, customer_id, sub.id, status, cpe);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        console.log("[webhook] subscription.deleted", { sub_id: sub.id });
        await sb.from("org_subscriptions").update({ status: "canceled" }).eq("stripe_subscription_id", sub.id);
        break;
      }

      default:
        console.log("[webhook] ignored", event.type);
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("[webhook] handler error", e);
    return new Response("Webhook handler error", { status: 500 });
  }
});
