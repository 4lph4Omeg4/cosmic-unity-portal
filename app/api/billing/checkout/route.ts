// app/api/billing/checkout/route.ts
import Stripe from "stripe";

export const runtime = "nodejs"; // Stripe werkt niet op edge

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

// CORS headers (helpt tegen preflight/405 als er OPTIONS komt)
function headers() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: headers() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      price_id,
      mode = "subscription",
      success_url,
      cancel_url,
      metadata,
    } = body || {};

    if (!price_id) {
      return Response.json({ error: "Missing price_id" }, { status: 400, headers: headers() });
    }

    const origin =
      request.headers.get("origin") ??
      `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("x-forwarded-host")}`;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: success_url || `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${origin}/billing/cancel`,
      allow_promotion_codes: true,
      metadata: metadata ?? {},
    });

    return Response.json({ url: session.url }, { status: 200, headers: headers() });
  } catch (e) {
    console.error("checkout error", e);
    return Response.json({ error: "Checkout request failed" }, { status: 500, headers: headers() });
  }
}
