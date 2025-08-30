import React, { useEffect, useState } from "react";

// Router & data
import { useSearchParams } from "react-router-dom";
import { fetchTlaPosts } from "@/services/tlaData";

// UI libs (shadcn/ui + icons)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowRight,
  Clock,
  Shield,
  Star,
  Zap,
  MessageSquare,
  Share2,
  Sparkles,
} from "lucide-react";

// Toasts
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// CTA
import { TlaSubscribeButton } from "@/components/TlaSubscribeButton";

const TimelineAlchemy: React.FC = () => {
  // ========= Config =========
  const PRICE_ID = "price_1S1VMWFlYXjX03EzHKNwtkWW"; // <-- jouw Stripe Price ID
  const ORG_ID = "timeline-alchemy"; // <-- evt. dynamisch maken via context

  // ========= Stijlkeuze + toasts =========
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

  // ========= Queryparams + data-fetch =========
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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

  // Stripe redirect feedback (?success=1 | ?canceled=1)
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    if (success) toast({ title: "Welkom in de stroom ⚡", description: "Je abonnement is actief." });
    if (canceled) toast({ title: "Geannuleerd", description: "Je hebt de checkout geannuleerd." });
  }, [searchParams, toast]);

  // ========= Render =========
  return (
    <div className="space-y-12">
      {/* Hero / CTA */}
      <section className="relative z-10 pt-16 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative group cursor-pointer transition-transform duration-300 hover:scale-110">
              <img
                src="/timeline-alchemy-logo.svg"
                alt="Timeline Alchemy — sigil-logo met kosmische geometrie"
                className="w-full h-full transition-all duration-300 group-hover:drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-xl"></div>
            </div>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-serif font-bold text-amber-400 tracking-wider">TIMELINE</h2>
              <h3 className="text-xl font-serif font-bold text-amber-400 tracking-wider">ALCHEMY</h3>
            </div>
            <p className="text-amber-400 text-sm font-medium text-center">
              Van intentie naar impact, in ritme met jouw tijdlijn
            </p>
          </div>

          {/* Style Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-full p-1">
              {(["krachtig", "mystiek", "creator"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedStyle === style
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  {style === "krachtig" && "⚡ Krachtig"}
                  {style === "mystiek" && "✨ Mystiek"}
                  {style === "creator" && "🎨 Creator"}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Hero Content */}
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 mb-6">
            {currentStyle.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 font-medium max-w-4xl mx-auto leading-relaxed">
            {currentStyle.subtitle}
          </p>

          {/* Bullets */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {currentStyle.bullets.map((bullet) => (
              <div
                key={bullet}
                className="flex items-center gap-2 bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-full px-4 py-2"
              >
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm font-medium">{bullet}</span>
              </div>
            ))}
          </div>

          {/* CTA knop */}
          <TlaSubscribeButton orgId={ORG_ID} priceId={PRICE_ID} variant="hero" className="w-full sm:w-auto">
            <span className="flex items-center justify-center">
              {currentStyle.cta}
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          </TlaSubscribeButton>

          <p className="text-slate-400 text-sm mt-4 max-w-md mx-auto">
            Direct via Stripe. Je kunt later altijd upgraden of pauzeren.
          </p>
        </div>
      </section>

      {/* Wat je krijgt */}
      <section className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Wat je krijgt</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Een complete content machine die jouw visie verspreidt zonder dat jij er energie aan verliest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <MessageSquare className="w-8 h-8" />, title: "Wekelijkse Blogpost", description: "Diep, helder, on-brand content dat jouw expertise toont" },
              { icon: <Share2 className="w-8 h-8" />, title: "Cross-Platform Posts", description: "Per kanaal geoptimaliseerd voor maximale impact" },
              { icon: <Clock className="w-8 h-8" />, title: "Planning & Publicatie", description: "Ritme = bereik. Wij zorgen voor consistentie" },
              { icon: <Shield className="w-8 h-8" />, title: "Tone-of-Voice Guardrails", description: "Jouw signatuur, consistent door alle content" },
              { icon: <Zap className="w-8 h-8" />, title: "Linkarchitectuur", description: "Alles verwijst terug naar jouw kern" },
              { icon: <Sparkles className="w-8 h-8" />, title: "Automatische Distributie", description: "Set it and forget it — wij doen de rest" },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                    {item.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamische posts */}
      <section className="max-w-3xl mx-auto px-6 pb-10">
        <h2 className="text-3xl font-bold tracking-tight">Laatste posts</h2>
        <div className="mt-6 rounded-2xl border border-slate-600/30 bg-slate-800/30 backdrop-blur p-5 shadow-sm">
          <h3 className="text-xl font-semibold text-white">Posts</h3>
          {!ready ? (
            <div className="mt-4 text-gray-400">Laden…</div>
          ) : err ? (
            <div className="mt-4 p-3 rounded bg-yellow-900/30 text-yellow-200">{err}</div>
          ) : items.length === 0 ? (
            <div className="mt-4 text-gray-400">Geen posts gevonden.</div>
          ) : (
            <ul className="mt-4 space-y-2">
              {items.map((p: any) => (
                <li key={p.id} className="p-3 border rounded bg-slate-800/40">
                  <div className="font-semibold text-white">{p.title ?? "(zonder titel)"}</div>
                  <div className="text-sm text-slate-400">
                    {p.created_at ? new Date(p.created_at).toLocaleString() : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto text-center pt-4">
          <p className="text-slate-400 text-sm">
            © 2025 Timeline Alchemy — Spread the One Message. Add Your Own Essence.
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
};

export default TimelineAlchemy;
