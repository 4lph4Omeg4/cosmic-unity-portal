// src/services/checkout.ts
export async function startCheckout(params: { org_id: string; price_id: string }) {
  const url = import.meta.env.VITE_CHECKOUT_FUNCTION_URL!;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data === "object" ? (data.error || "failed") : "failed");
  if (!data?.url) throw new Error("No checkout url");
  window.location.href = data.url;
}
