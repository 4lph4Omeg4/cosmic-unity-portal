import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY!, { 
  apiVersion: '2024-06-20' 
});

export interface CheckoutRequest {
  org_id: string;
  price_id: string;
}

export interface CheckoutResponse {
  url: string;
}

export class StripeService {
  static async createCheckoutSession(data: CheckoutRequest): Promise<CheckoutResponse> {
    try {
      if (!data.org_id || !data.price_id) {
        throw new Error('Missing org_id or price_id');
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: data.price_id, quantity: 1 }],
        success_url: `${process.env.VITE_APP_URL || 'http://localhost:8080'}/tla?session=success`,
        cancel_url: `${process.env.VITE_APP_URL || 'http://localhost:8080'}/tla?session=cancel`,
        client_reference_id: data.org_id, // 🔗 koppelen aan jouw org
      });

      return { url: session.url! };
    } catch (error: any) {
      console.error('checkout error', error);
      throw new Error(error.message || 'Failed to create checkout session');
    }
  }

  static async getSubscription(subscriptionId: string) {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error: any) {
      console.error('Error retrieving subscription:', error);
      throw new Error(error.message || 'Failed to retrieve subscription');
    }
  }

  static async cancelSubscription(subscriptionId: string) {
    try {
      return await stripe.subscriptions.cancel(subscriptionId);
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      throw new Error(error.message || 'Failed to cancel subscription');
    }
  }
}
