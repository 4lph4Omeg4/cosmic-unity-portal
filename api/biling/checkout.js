// api/billing/checkout.js
function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function getStripe() {
  // Werkt in zowel CommonJS als ESM projecten
  try {
    // CommonJS
    // eslint-disable-next-line global-require
    const Stripe = require("stripe");
    return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  } catch {
    // ESM
    const mod = await import("stripe");
    const Stripe = mod.default || mod;
    return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
  }
}

module.exports = async (req, res) => {
  cors(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.error("[checkout] Missing STRIPE_SECRET_KEY env");
      return res.status(500).json({ error: "Server misconfigured (missing STRIPE_SECRET_KEY)" });
    }

    // Body veilig parse’en (soms is req.body een string)
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body || "{}"); } catch (e) { body = {}; }
    }
    body = body || {};

    const { price_id, mode = "subscription", success_url, cancel_url, metadata } = body;
    if (!price_id) return res.status(400).json({ error: "Missing price_id" });

    const stripe = await getStripe();

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
    // Geef tijdelijk extra context terug om te debuggen (haal weg in productie)
    console.error("[checkout] error", e?.message, e);
    const msg = e?.raw?.message || e?.message || "A server error has occurred";
    const code = e?.statusCode || 500;
    return res.status(500).json({ error: "Checkout failed", detail: msg, code });
  }
};
