import Stripe from "stripe";
export const runtime = "nodejs"; // belangrijk: geen edge runtime

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { price_id, mode = "subscription", success_url, cancel_url, metadata } = body || {};
    if (!price_id) return Response.json({ error: "Missing price_id" }, { status: 400 });

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

    return Response.json({ url: session.url }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Checkout request failed" }, { status: 500 });
  }
}
