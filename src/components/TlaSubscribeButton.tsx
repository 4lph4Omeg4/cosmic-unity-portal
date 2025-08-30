import React, { useState } from "react";

type Props = {
  orgId: string;
  priceId: string;
  className?: string;
  children?: React.ReactNode;
};

export function TlaSubscribeButton({ orgId, priceId, className, children }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      // ✅ Supabase Edge Function URL (checkout)
      const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // ⚠️ Als je je checkout function met JWT-verificatie deployt, laat deze header staan:
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: priceId, // bv. "price_1S1VMWFlYXjX03EzHKNwtkWW"
          org_id: orgId,     // bv. "timeline-alchemy"
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Checkout request failed: ${res.status} ${txt}`);
      }

      // ✅ Stripe geeft ons de checkout URL terug
      const { url } = await res.json();

      // ✅ Redirect gebruiker naar Stripe
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("[TlaSubscribeButton] error", err);
      alert("Kon checkout niet starten");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? "Even geduld…" : children ?? "Abonneer op Timeline Alchemy"}
    </button>
  );
}
