# Stripe Integration for Timeline Alchemy

This project includes a complete Stripe integration for handling subscription checkouts.

## Setup

### 1. Install Dependencies
Stripe is already installed in this project:
```bash
npm install stripe
```

### 2. Environment Variables
Add the following to your `.env` file:
```env
VITE_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_APP_URL=http://localhost:8080
```

### 3. Stripe Dashboard Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create a product with subscription pricing
3. Copy the Price ID (starts with `price_`)
4. Use the Price ID in your checkout calls

## Usage

### Basic Checkout Button
```tsx
import { CheckoutButton } from './components/CheckoutButton';

<CheckoutButton 
  orgId="your_org_id" 
  priceId="price_your_stripe_price_id"
>
  Subscribe to Premium
</CheckoutButton>
```

### TlaSubscribeButton (Eenvoudige implementatie)
```tsx
import { TlaSubscribeButton } from './components/TlaSubscribeButton';

<TlaSubscribeButton 
  orgId="your_org_id" 
  priceId="price_your_stripe_price_id"
/>
```

### Using the Hook Directly
```tsx
import { useStripe } from './hooks/useStripe';

const { redirectToCheckout, loading, error } = useStripe();

const handleSubscribe = async () => {
  try {
    await redirectToCheckout({
      org_id: 'your_org_id',
      price_id: 'price_your_stripe_price_id'
    });
  } catch (err) {
    console.error('Checkout failed:', err);
  }
};
```

### Using the Service Directly
```tsx
import { StripeService } from './services/stripeService';

const session = await StripeService.createCheckoutSession({
  org_id: 'your_org_id',
  price_id: 'price_your_stripe_price_id'
});

// Redirect to checkout
window.location.href = session.url;
```

## API Endpoints

### Create Checkout Session
**POST** `/api/billing/checkout`

**Request Body:**
```json
{
  "org_id": "your_org_id",
  "price_id": "price_your_stripe_price_id"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

## Features

- ✅ Subscription checkout
- ✅ Success/cancel URL handling
- ✅ Organization linking via `client_reference_id`
- ✅ Error handling
- ✅ Loading states
- ✅ TypeScript support
- ✅ Multiple button implementations (TlaSubscribeButton & CheckoutButton)
- ✅ Direct Stripe service integration

## Important Notes

1. **Environment Variables**: Make sure to use `VITE_` prefix for client-side variables
2. **Price IDs**: Always use the Price ID from Stripe, not the Product ID
3. **Test Mode**: Use test keys during development
4. **Webhooks**: Consider implementing webhooks for subscription status updates

## Next Steps

1. Implement webhook handling for subscription events
2. Add subscription management UI
3. Implement usage-based billing if needed
4. Add payment method management
5. Implement invoice handling
