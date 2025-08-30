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

      // 1. Hier staat de endpoint URL van je Edge Function
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Als je checkout function met jwt verify deployt:
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            price_id: priceId, // jouw Stripe price id
            org_id: orgId,     // jouw org id
          }),
        }
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Checkout request failed: ${res.status} ${txt}`);
      }

      // 2. Hier haal je de "url" op die Stripe terugstuurt
      const { url } = await res.json();

      // 3. En hier redirect je naar die url
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
      {loading ? "Bezig…" : children ?? "Abonneer op Timeline Alchemy"}
    </button>
  );
}
