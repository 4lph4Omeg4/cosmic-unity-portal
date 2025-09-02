// supabase/functions/checkout/index.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@15.4.0";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, apikey',
  };

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    return new Response("Missing STRIPE_SECRET_KEY", { 
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  try {
    const { price_id, org_id } = await req.json();
    if (!price_id || !org_id) {
      return new Response("Missing price_id or org_id", { 
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }

    const origin = req.headers.get("origin")
      || Deno.env.get("PUBLIC_SITE_URL")
      || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${origin}/onboarding-redirect?session=success&org_id=${org_id}`,
      cancel_url: `${origin}/timeline-alchemy?session=cancel`,

      // belangrijk:
      client_reference_id: org_id,
      metadata: { org_id },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: "Checkout failed" }), { 
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
});
