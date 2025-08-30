import React from 'react';
import { StripeService } from '@/services/stripeService';

import * as React from 'react';
import { useState } from 'react';

interface Props {
  orgId: string;
  priceId: string; // bv. 'price_12345'
}

type TlaSubscribeButtonVariant = 'default' | 'hero' | 'trust';

type TlaSubscribeButtonProps = Props & {
  children?: React.ReactNode;
  className?: string;
  variant?: TlaSubscribeButtonVariant;
};

export function TlaSubscribeButton({
  orgId,
  priceId,
  children,
  className,
  variant = 'default',
}: TlaSubscribeButtonProps) {
  const [loading, setLoading] = useState(false);

async function startCheckout(priceId: string) {
  const res = await fetch('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price_id: priceId,
      mode: 'subscription',
    }),
  });
  if (!res.ok) throw new Error('Checkout request failed');
  const { url } = await res.json();
  if (url) window.location.href = url;
}

  const base =
    'inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition';
  const styles: Record<TlaSubscribeButtonVariant, string> = {
    default: `${base} bg-black text-white hover:opacity-90`,
    hero: `${base} bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg hover:brightness-110`,
    trust: `${base} border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50`,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[styles[variant], className].filter(Boolean).join(' ')}
      disabled={loading}
      data-org={orgId}
      data-price={priceId}
    >
      {loading ? 'Even de stroom openen…' : children ?? 'Activeer Timeline Alchemy'}
    </button>
  );
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

  // Default styling per variant
  const getDefaultClassName = () => {
    switch (variant) {
      case 'hero':
        return "px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50";
      case 'trust':
        return "px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50";
      default:
        return "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200";
    }
  }

  const buttonClassName = className || getDefaultClassName();

// bovenin in je component:
const baseBtn =
  "px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed";

// als je al een startCheckout() had, koppel 'm dan:
async function handleClick() {
  if (typeof startCheckout === "function") {
    await startCheckout();
  } else {
    // fallback: voeg hier je fetch naar de edge function toe
    // await startCheckout({ orgId, priceId })
  }
}

return (
  <button
    onClick={handleClick}
    disabled={loading}
    className={[baseBtn, buttonClassName, className].filter(Boolean).join(" ")}
  >
    {loading ? "Even geduld…" : (children ?? "Abonneer op Timeline Alchemy")}
  </button>
);
    </button>
  );
};
