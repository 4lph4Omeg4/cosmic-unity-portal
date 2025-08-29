import React from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Minimal TimelineAlchemy page
 * - Toont een simpele banner bij ?session=success|cancel
 * - Geen externe services/imports (dus geen build-conflicts)
 * - Eén default export
 */
const TimelineAlchemy: React.FC = () => {
  const [params] = useSearchParams();
  const session = params.get("session"); // 'success' | 'cancel' | null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top banner voor Stripe redirect status (optioneel) */}
      {session && (
        <div
          className={`w-full text-white text-sm md:text-base py-3 px-4 ${
            session === "success" ? "bg-green-600" : "bg-yellow-600"
          }`}
        >
          {session === "success"
            ? "✅ Betaling gelukt. Je abonnement is geactiveerd (of wordt zo verwerkt)."
            : "⚠️ Betaling geannuleerd. Je kunt het later opnieuw proberen."}
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Timeline Alchemy</h1>
        <p className="mt-2 text-gray-600">
          Welkom bij TLA. Dit is een minimal werkende pagina zonder extra
          dependencies, zodat je build gewoon groen blijft.
        </p>

        <section className="mt-8 space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Status</h2>
            <p className="mt-1 text-gray-600">
              Alles staat: router werkt, pagina rendert, en we hebben één
              duidelijke export.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Volgende stap (optioneel)</h2>
            <p className="mt-1 text-gray-600">
              Wil je hier later een “Subscribe” knop? Dan kun je een functie{" "}
              <code>startCheckout()</code> aanroepen vanuit je services. Voor nu
              hebben we dat bewust weggelaten om conflicten te voorkomen.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TimelineAlchemy;
