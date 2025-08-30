// api/billing/checkout.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { price_id, mode = 'subscription', success_url, cancel_url, metadata } = req.body ?? {};

    if (!price_id) return res.status(400).json({ error: 'Missing price_id' });

    // Bepaal origin voor fallback URL's
    const origin =
      (req.headers.origin as string) ||
      `${req.headers['x-forwarded-proto'] ?? 'https'}://${req.headers['x-forwarded-host']}`;

    const session = await stripe.checkout.sessions.create({
      mode: mode as 'subscription' | 'payment',
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: success_url || `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${origin}/billing/cancel`,
      allow_promotion_codes: true,
      metadata: metadata ?? {},
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('checkout error', err);
    return res.status(500).json({ error: 'Checkout request failed' });
  }
}
