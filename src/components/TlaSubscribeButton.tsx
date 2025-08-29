import React from 'react';
import { StripeService } from '@/services/stripeService';

interface Props {
  orgId: string;
  priceId: string;
}

export const TlaSubscribeButton: React.FC<Props> = ({ orgId, priceId }) => {
  const handleClick = async () => {
    try {
      const session = await StripeService.createCheckoutSession({
        org_id: orgId,
        price_id: priceId,
      });
      // 🔀 Redirect naar Stripe
      window.location.href = session.url;
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Kon checkout niet starten. Check console voor details.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
    >
      Abonneer op Timeline Alchemy
    </button>
  );
};
