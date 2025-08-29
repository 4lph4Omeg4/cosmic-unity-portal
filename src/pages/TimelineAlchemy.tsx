import React from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTlaPosts } from "@/services/tlaData";

/**
 * TimelineAlchemy (minimal + stabiel)
 * - Toont statusbanner op ?session=success|cancel
 * - Haalt posts op via RLS-veilige view (tla_posts_visible) via fetchTlaPosts()
 * - Eén default export, geen dubbele routers/imports
 */
const TimelineAlchemy: React.FC = () => {
  const [params] = useSearchParams();
  const session = params.get("session"); // 'success' | 'cancel' | null

  const [items, setItems] = React.useState<any[]>([]);
  const [err, setErr] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const { data, error } = await fetchTlaPosts();
      if (error) setErr(error.message);
      else setItems(data);
      setReady(true);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Statusbanner vanuit Stripe redirect */}
      {session && (
        <div
          className={`w-full text-white text-sm md:text-base py-3 px-4 ${
            session === "success" ? "bg-green-600" : "bg-yellow-600"
          }`}
        >
          {session === "success"
            ? "✅ Betaling gelukt. Je abonnement is geactiveerd (of wordt verwerkt)."
            : "⚠️ Betaling geannuleerd. Je kunt het later opnieuw proberen."}
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Timeline Alchemy</h1>
        <p className="mt-2 text-gray-600">
          Dit is een stabiele basispagina. Router werkt, banner werkt, data-fetch werkt.
        </p>

        <section className="mt-8 space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Posts</h2>

            {!ready ? (
              <div className="mt-4 text-gray-500">Laden…</div>
            ) : err ? (
              <div className="mt-4 p-3 rounded bg-yellow-50 text-yellow-800">
                {err}
              </div>
            ) : (
              <ul className="mt-4 space-y-2">
                {items.length === 0 ? (
                  <li className="text-gray-500">Geen posts gevonden.</li>
                ) : (
                  items.map((p: any) => (
                    <li key={p.id} className="p-3 border rounded bg-white">
                      <div className="font-semibold">{p.title ?? "(zonder titel)"}</div>
                      <div className="text-sm text-gray-600">
                        {p.created_at
                          ? new Date(p.created_at).toLocaleString()
                          : ""}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Volgende stap (optioneel)</h2>
            <p className="mt-1 text-gray-600">
              Klaar om een Subscribe-knop toe te voegen? Zeg het, dan drop ik een
              veilige knop die je Edge Function aanroept.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TimelineAlchemy;
