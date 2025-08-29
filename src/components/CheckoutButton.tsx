import React from 'react';
import { Button } from './ui/button';
import { StripeService, CheckoutRequest } from '../services/stripeService';

interface CheckoutButtonProps {
  orgId: string;
  priceId: string;
  children?: React.ReactNode;
  className?: string;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  orgId,
  priceId,
  children = 'Subscribe Now',
  className
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const session = await StripeService.createCheckoutSession({
        org_id: orgId,
        price_id: priceId,
      });
      
      // Redirect to Stripe checkout
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
      console.error('Checkout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className={className}
      >
        {loading ? 'Processing...' : children}
      </Button>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};
