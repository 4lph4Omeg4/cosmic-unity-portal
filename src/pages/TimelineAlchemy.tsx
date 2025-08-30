import React, { useState, useEffect } from "react";

// Router & data
import { useSearchParams } from "react-router-dom";
import { fetchTlaPosts } from "@/services/tlaData";

// UI libs (shadcn/ui + icons)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Star,
  Zap,
  Clock,
  MessageSquare,
  Share2,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Toasts
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// CTA
import { TlaSubscribeButton } from "@/components/TlaSubscribeButton";

/**
 * TimelineAlchemy (minimal + stabiel)
 * - Toont statusbanner op ?session=success|cancel
 * - Haalt posts op via RLS-veilige view (tla_posts_visible) via fetchTlaPosts()
 * - Eén default export, geen dubbele routers/imports
 */
const TimelineAlchemy: React.FC = () => {
  // ========= Config =========
  // Vervang dit door je echte Stripe Price ID (Stripe → Products → Prices)
  const PRICE_ID = "price_timeline_alchemy_monthly";
  // Haal je orgId op uit je context/store waar jij ‘m bewaart (placeholder hieronder):
  const ORG_ID = "org_placeholder"; // TODO: injecteer uit context/store/props

  // ========= Vine: stijlkeuze + toasts =========
  const [selectedStyle, setSelectedStyle] = useState<"krachtig" | "mystiek" | "creator">("krachtig");
  const { toast } = useToast();

  const styles = {
    krachtig: {
      title: "Timeline Alchemy",
      subtitle:
        "Transformeer wekelijkse trends naar ziel-resonante content. Blog + cross-platform posts. Volledig gepland. Jij blijft creëren—wij verspreiden.",
      bullets: ["Wekelijkse blogpost", "Platform-specifieke posts", "Planning & publicatie", "Tone of voice on-brand"],
      cta: "Activeer Timeline Alchemy",
    },
    mystiek: {
      title: "Spread the One Message. Add Your Own Essence.",
      subtitle:
        "Jij zet de intentie neer. Wij weven jouw boodschap door de tijdlijnen—helder, ritmisch, onmisbaar.",
      bullets: ["Alchemie van trends → inzicht", "Ziel-afgestemde blog", "Signaalversterkers voor socials", "Ritmische distributie"],
      cta: "Start je Alchemie",
    },
    creator: {
      title: "Creëer vrij. Wij doen de rest.",
      subtitle:
        "Wekelijks: 1 diepe blog + korte social-varianten + automatische planning. Consistent zichtbaar zonder content-stress.",
      bullets: ["Research uit jouw domein", "Jouw tone of voice", "Publicatiekalender", "Rapportage/links"],
      cta: "Aan de slag",
    },
  } as const;

  const currentStyle = styles[selectedStyle];

  // ========= main: queryparams + data-fetch =========
  const [searchParams] = useSearchParams();
  const session = searchParams.get("session"); // backward compat als je dit elders gebruikt

  const [items, setItems] = React.useState<any[]>([]);
  const [err, setErr] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const { data, error } = await fetchTlaPosts();
        if (error) setErr(error.message);
        else setItems(data ?? []);
      } catch (e: any) {
        setErr(e?.message ?? "Onbekende fout");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Toon Stripe redirect-resultaat via query params (?success=1|?canceled=1 of ?session=success|cancel)
  React.useEffect(() => {
    const success = searchParams.get("success") || (session === "success" ? "1" : null);
    const canceled = searchParams.get("canceled") || (session === "cancel" ? "1" : null);

    if (success) {
      toast({
        title: "Welkom in de stroom ⚡",
        description: "Je abonnement is actief. We plannen je eerste week in.",
      });
    }
    if (canceled) {
      toast({
        title: "Geannuleerd",
        description: "Je hebt de checkout geannuleerd.",
      });
    }
  }, [searchParams, session, toast]);

  // ========= Render =========
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-2xl">{currentStyle.title}</CardTitle>

            {/* Stijl selector */}
            <div className="flex gap-2">
              <Badge
                variant={selectedStyle === "krachtig" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedStyle("krachtig")}
              >
                Krachtig
              </Badge>
              <Badge
                variant={selectedStyle === "mystiek" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedStyle("mystiek")}
              >
                Mystiek
              </Badge>
              <Badge
                variant={selectedStyle === "creator" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedStyle("creator")}
              >
                Creator
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{currentStyle.subtitle}</p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentStyle.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* CTA naar je Edge Function via TlaSubscribeButton */}
          <div className="pt-2">
            <TlaSubscribeButton
              orgId={ORG_ID}
              priceId={PRICE_ID}
              variant="hero"
              className="w-full sm:w-auto"
            >
              {currentStyle.cta}
            </TlaSubscribeButton>
          </div>
        </CardContent>
      </Card>

      {/* (Optioneel) laat data zien uit fetchTlaPosts */}
      <Card>
        <CardHeader>
          <CardTitle>Laatste items</CardTitle>
        </CardHeader>
        <CardContent>
          {!ready && <p>Data laden…</p>}
          {ready && err && <p className="text-red-600">Fout: {err}</p>}
          {ready && !err && items?.length === 0 && <p>Nog geen items gevonden.</p>}
          {ready && !err && items?.length > 0 && (
            <ul className="list-disc pl-5 space-y-1">
              {items.map((it, i) => (
                <li key={it.id ?? i}>{it.title ?? JSON.stringify(it)}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Toaster />
    </div>
  );
};

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

return (
  <>
    {/* Vine: Hero / value props / FAQ / Trust */}
    <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* ... Hero content exact zoals in Vine ... */}
    </section>

    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
      {/* ... Wat je krijgt section ... */}
    </section>

    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
      {/* ... FAQ section ... */}
    </section>

    <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
      {/* ... Trust section ... */}
    </section>

    {/* Main: dynamische posts */}
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold tracking-tight">Laatste posts</h2>
      <p className="mt-2 text-gray-600">
        Inzichten & updates uit de Timeline Alchemy stroom.
      </p>

      <section className="mt-8 space-y-4">
        <div className="rounded-2xl border bg-white/5 backdrop-blur p-5 shadow-sm">
          <h3 className="text-xl font-semibold">Posts</h3>

          {!ready ? (
            <div className="mt-4 text-gray-400">Laden…</div>
          ) : err ? (
            <div className="mt-4 p-3 rounded bg-yellow-900/30 text-yellow-200">
              {err}
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {items.length === 0 ? (
                <li className="text-gray-400">Geen posts gevonden.</li>
              ) : (
                items.map((p: any) => (
                  <li key={p.id} className="p-3 border rounded bg-slate-800/40">
                    <div className="font-semibold text-white">
                      {p.title ?? "(zonder titel)"}
                    </div>
                    <div className="text-sm text-slate-400">
                      {p.created_at ? new Date(p.created_at).toLocaleString() : ""}
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </section>
    </main>
  </>
);
          </div>
{/* Volgende stap (optioneel) – uit main, qua stijl gematcht met je dark theme */}
<section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto">
    <div className="rounded-2xl border border-slate-600/30 bg-slate-800/30 backdrop-blur p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-white">Volgende stap (optioneel)</h2>
      <p className="mt-1 text-slate-300">
        Klaar om een Subscribe-knop toe te voegen? Zeg het, dan drop ik een
        veilige knop die je Edge Function aanroept.
      </p>
    </div>
  </div>
</section>

{/* Footer – uit Vine */}
<footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div>
        <h4 className="text-white font-semibold mb-4">Timeline Alchemy</h4>
        <p className="text-slate-400 text-sm">
          Van intentie naar impact, in ritme met jouw tijdlijn.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Features</h4>
        <ul className="text-slate-400 text-sm space-y-2">
          <li>Wekelijkse blogpost</li>
          <li>Cross-platform distributie</li>
          <li>Automatische planning</li>
          <li>Tone-of-voice bewaking</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Support</h4>
        <ul className="text-slate-400 text-sm space-y-2">
          <li>Email support</li>
          <li>Documentatie</li>
          <li>Community</li>
          <li>Updates</li>
        </ul>
      </div>
    </div>

    <div className="text-center pt-8 border-t border-slate-700/50">
      <p className="text-slate-400 text-sm">
        © 2025 Timeline Alchemy — Spread the One Message. Add Your Own Essence.
      </p>
    </div>
  </div>
</footer>
    </div>
  );
};

export default TimelineAlchemy;
