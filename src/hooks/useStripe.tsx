import { useState } from 'react';
import { StripeService, CheckoutRequest } from '../services/stripeService';

export const useStripe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (data: CheckoutRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const session = await StripeService.createCheckoutSession(data);
      
      // Redirect to Stripe checkout
      if (session.url) {
        window.location.href = session.url;
      }
      
      return session;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = async (data: CheckoutRequest) => {
    try {
      const result = await createCheckoutSession(data);
      return result;
    } catch (err) {
      console.error('Checkout error:', err);
      throw err;
    }
  };

  return {
    createCheckoutSession,
    redirectToCheckout,
    loading,
    error,
  };
};
