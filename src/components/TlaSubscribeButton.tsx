import React, { useState } from "react";

type Variant = "default" | "hero" | "trust";

type Props = {
  orgId: string;
  priceId: string;
  className?: string;
  variant?: Variant;
  children?: React.ReactNode;
  /** Optioneel: eigen klikhandler. Als je deze meegeeft, wordt de interne checkout-call niet gebruikt. */
  onClick?: () => void | Promise<void>;
};

export function TlaSubscribeButton({
  orgId,
  priceId,
  className,
  variant = "default",
  children,
  onClick,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      // Als de caller zelf iets wil doen, laat die winnen
      if (onClick) {
        await onClick();
        return;
      }

      // Default: maak Stripe Checkout Session via je serverroute
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price_id: priceId,
          mode: "subscription",
          metadata: { org_id: orgId },
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Checkout request failed: ${res.status} ${txt}`);
      }

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Checkout faalde — check console/logs.");
    } finally {
      setLoading(false);
    }
  }

  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed";
  const styles: Record<Variant, string> = {
    default: `${base} bg-black text-white hover:opacity-90`,
    hero: `${base} bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg hover:brightness-110`,
    trust: `${base} border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50`,
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={[styles[variant], className].filter(Boolean).join(" ")}
      data-org={orgId}
      data-price={priceId}
    >
      {loading ? "Even de stroom openen…" : children ?? "Abonneer op Timeline Alchemy"}
    </button>
  );
}
