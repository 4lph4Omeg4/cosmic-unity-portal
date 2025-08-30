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

  // --- sanity log (alleen server logs; niet naar client) ---
  const hasKey = !!process.env.STRIPE_SECRET_KEY;
  if (!hasKey) {
    console.error("[checkout] Missing STRIPE_SECRET_KEY env");
    return res.status(500).json({ error: "Server misconfigured: STRIPE_SECRET_KEY missing" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    // body kan string of object zijn
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body || "{}"); } catch { body = {}; }
    }
    body = body || {};

    const { price_id, mode = "subscription", success_url, cancel_url, metadata } = body;
    if (!price_id) return res.status(400).json({ error: "Missing price_id" });

    const origin =
      req.headers.origin ||
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
    // Geef NU (tijdelijk) bruikbare uitleg terug
    const detail = e?.raw?.message || e?.message || "Unknown error";
    const type = e?.raw?.type || e?.type || "server_error";
    console.error("[checkout] stripe error:", type, detail);
    return res.status(500).json({ error: "Checkout failed", type, detail });
  }
};
