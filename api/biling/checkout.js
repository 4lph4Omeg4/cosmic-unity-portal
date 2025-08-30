// api/billing/checkout.js
const Stripe = require("stripe");

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return res.status(500).json({ error: "Server misconfigured: STRIPE_SECRET_KEY missing" });
    const StripeSDK = require("stripe");
    const stripe = new StripeSDK(key, { apiVersion: "2024-06-20" });

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { price_id, mode = "subscription", success_url, cancel_url, metadata } = body;
    if (!price_id) return res.status(400).json({ error: "Missing price_id" });

    const origin = req.headers.origin ||
      `${req.headers["x-forwarded-proto"] || "https"}://${req.headers["x-forwarded-host"]}`;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: success_url || `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${origin}/billing/cancel`,
      allow_promotion_codes: true,
      metadata: metadata || {},
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("[checkout] error", e?.message);
    return res.status(500).json({ error: "Checkout failed", detail: e?.raw?.message || e?.message });
  }
};
