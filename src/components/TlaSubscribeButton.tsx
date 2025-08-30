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

      // ✅ Je Supabase Edge Function endpoint
      const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/checkout`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_id: priceId,
          org_id: orgId,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Checkout request failed: ${res.status} ${txt}`);
      }

      const { url } = await res.json();

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
