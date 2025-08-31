import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// UI Components
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

// Services & Components
import { fetchTlaPosts } from "@/services/tlaData";
import { TlaSubscribeButton } from "@/components/TlaSubscribeButton";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

const TimelineAlchemy: React.FC = () => {
  // ========= Config =========
  const PRICE_ID = "price_1S1VMWFlYXjX03EzHKNwtkWW"; // <-- jouw Stripe Price ID
  const ORG_ID = "timeline-alchemy"; // <-- evt. dynamisch maken via context

  // ========= Stijlkeuze + toasts =========
  const [selectedStyle, setSelectedStyle] = useState<"krachtig" | "mystiek" | "creator">("krachtig");
  const [showOnboarding, setShowOnboarding] = useState(false);
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

  // Stripe redirect feedback (?session=success | ?session=cancel)
  useEffect(() => {
    const session = searchParams.get("session");
    console.log('TimelineAlchemy - Session parameter:', session);
    
    if (session === "success") {
      console.log('TimelineAlchemy - Success detected, showing onboarding...');
      toast({ 
        title: "Welkom in de stroom ⚡", 
        description: "Je abonnement is actief. Laten we je profiel instellen!",
        duration: 5000
      });
      
      // Show onboarding wizard instead of redirecting
      setShowOnboarding(true);
    }
    if (session === "cancel") {
      toast({ 
        title: "Geannuleerd", 
        description: "Je hebt de checkout geannuleerd." 
      });
    }
  }, [searchParams, toast]);

  // ========= Render =========
  
  // If onboarding should be shown, render the wizard
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welkom bij Timeline Alchemy! 🎉
            </h1>
            <p className="text-lg text-gray-300">
              Je abonnement is actief. Laten we je profiel instellen om te beginnen.
            </p>
          </div>
          <OnboardingWizard />
        </div>
      </div>
    );
  }

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

{/* FAQ Section */}
<section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        Veelgestelde vragen
      </h2>
      <p className="text-xl text-slate-300">
        Alles wat je moet weten over Timeline Alchemy
      </p>
    </div>

    <div className="space-y-6">
      {[
        {
          question: "Kan ik feedback geven op de blog?",
          answer: "Ja. Je krijgt een concept; wij verwerken je feedback en publiceren gepland.",
        },
        {
          question: "Welke platforms dekken jullie?",
          answer: "Minimaal: Instagram, Facebook, X, LinkedIn. Uitbreiden kan.",
        },
        {
          question: "Moet ik zelf nog posten?",
          answer: "Hoeft niet. Wij plannen en publiceren (met jouw toestemming/verbindingen).",
        },
        {
          question: "Wat als mijn niche 'anders' is?",
          answer: "Perfect. We trainen op jouw bronnen, glossarium en voorbeelden.",
        },
        {
          question: "Kan ik pauzeren of upgraden?",
          answer: "Ja. Via Stripe kun je pauzeren, wijzigen of annuleren.",
        },
      ].map((faq, index) => (
        <Card key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30">
          <CardHeader>
            <CardTitle className="text-white text-lg">{faq.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">{faq.answer}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

{/* Trust / CTA Section */}
<section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-4xl mx-auto text-center">
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 md:p-12">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
        Klaar om te starten?
      </h3>
      <p className="text-slate-300 mb-8 text-lg">
        Join de creators die al hun content stress hebben vervangen door Timeline Alchemy
      </p>

      {/* ⚠️ Vervang hieronder 'price_timeline_alchemy_monthly' door je echte Stripe price ID */}
      <TlaSubscribeButton
        orgId="timeline-alchemy"
        priceId="price_timeline_alchemy_monthly"
        variant="trust"
      >
        <span className="flex items-center justify-center">
          {(currentStyle?.cta ?? "Start je maandelijkse transformatie")}
          <ArrowRight className="w-5 h-5 ml-2" />
        </span>
      </TlaSubscribeButton>

      {/* Onboarding Button */}
      <div className="mt-4">
        <Button
          variant="outline"
          size="lg"
          className="bg-transparent border-amber-400/50 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400 transition-all duration-200"
          onClick={() => (window.location.href = "/onboarding")}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Start Onboarding
        </Button>
      </div>

      {/* Trust cues */}
      <div className="mt-8 pt-8 border-t border-slate-600/30">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span>SSL & Stripe — veilig en transparant</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Maandelijks opzegbaar. Eerlijk is heilig</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Creator-eigen data, altijd</span>
          </div>
        </div>
      </div>
    </div>
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

