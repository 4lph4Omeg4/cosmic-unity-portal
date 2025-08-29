// Minimal fetch: géén Authorization/geén apikey -> veel minder CORS gedoe
const CHECKOUT_URL =
  "https://wdclgadjetxhcududipz.supabase.co/functions/v1/checkout";

export async function startCheckout(params: { org_id: string; price_id: string }) {
  const res = await fetch(CHECKOUT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // that's it
    body: JSON.stringify(params),
  });

  // Log wat er gebeurt (helpt zóveel bij foutzoeken)
  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { /* ignore */ }

  if (!res.ok) {
    console.error("Checkout failed (status, body):", res.status, text);
    throw new Error(data?.error || `Checkout failed (${res.status})`);
  }
  if (!data?.url) throw new Error("No checkout url");
  window.location.href = data.url;
}
