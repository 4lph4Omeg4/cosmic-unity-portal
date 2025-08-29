// FRONTEND-VEILIGE VERSIE — GEEN Stripe secret in de browser
// Vervangt je oude server-side implementatie.

// Optioneel: zet VITE_CHECKOUT_FUNCTION_URL in .env voor makkelijke swaps.
// Valt anders terug op je huidige function-URL.
const FUNCTION_URL =
  import.meta.env.VITE_CHECKOUT_FUNCTION_URL ||
  'https://wdclgadjetxhcududipz.supabase.co/functions/v1/swift-task';

export interface CheckoutRequest {
  org_id: string;
  price_id?: string; // mag leeg; je function heeft een fallback
}

export interface CheckoutResponse {
  url: string;
}

export class StripeService {
  static async createCheckoutSession(data: CheckoutRequest): Promise<CheckoutResponse> {
    if (!data?.org_id) throw new Error('org_id ontbreekt');

    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || 'Checkout mislukt');
    if (!json?.url) throw new Error('Geen checkout URL ontvangen van server');

    return { url: json.url };
  }

  // Deze twee zijn front-end niet veilig/zinvol zonder backend.
  // We geven een duidelijke fout terug totdat we een server endpoint/webhook hebben.
  static async getSubscription(_subscriptionId: string) {
    throw new Error('Niet beschikbaar in frontend. Gebruik een server/edge function of webhook.');
  }

  static async cancelSubscription(_subscriptionId: string) {
    throw new Error('Niet beschikbaar in frontend. Gebruik een server/edge function.');
  }
}
