import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Clock, MessageSquare, Share2, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const TimelineAlchemy: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<'krachtig' | 'mystiek' | 'creator'>('krachtig');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const styles = {
    krachtig: {
      title: "Timeline Alchemy",
      subtitle: "Transformeer wekelijkse trends naar ziel-resonante content. Blog + cross-platform posts. Volledig gepland. Jij blijft creëren—wij verspreiden.",
      bullets: [
        "Wekelijkse blogpost",
        "Platform-specifieke posts", 
        "Planning & publicatie",
        "Tone of voice on-brand"
      ],
      cta: "Activeer Timeline Alchemy"
    },
    mystiek: {
      title: "Spread the One Message. Add Your Own Essence.",
      subtitle: "Jij zet de intentie neer. Wij weven jouw boodschap door de tijdlijnen—helder, ritmisch, onmisbaar.",
      bullets: [
        "Alchemie van trends → inzicht",
        "Ziel-afgestemde blog",
        "Signaalversterkers voor socials",
        "Ritmische distributie"
      ],
      cta: "Start je Alchemie"
    },
    creator: {
      title: "Creëer vrij. Wij doen de rest.",
      subtitle: "Wekelijks: 1 diepe blog + korte social-varianten + automatische planning. Consistent zichtbaar zonder content-stress.",
      bullets: [
        "Research uit jouw domein",
        "Jouw tone of voice",
        "Publicatiekalender",
        "Rapportage/links"
      ],
      cta: "Aan de slag"
    }
  };

  const currentStyle = styles[selectedStyle];

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      // Hier zou de Stripe checkout logica komen
      // Voor nu simuleren we een succesvolle checkout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success toast
      toast({
        title: "Welkom in de stroom ⚡",
        description: "Je ontvangt zo een bevestiging per e-mail. We plannen je eerste publicatie-week in.",
        variant: "default",
      });
      
    } catch (error) {
      // Error toast
      toast({
        title: "Hmm, de kosmos hikt even",
        description: "Probeer het opnieuw of mail ons — we fixen het meteen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated background with cosmic dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative group cursor-pointer transition-transform duration-300 hover:scale-110">
              {/* Timeline Alchemy Logo */}
              <svg 
                viewBox="0 0 200 200" 
                className="w-full h-full transition-all duration-300 group-hover:drop-shadow-2xl"
                aria-label="Timeline Alchemy — sigil-logo met kosmische geometrie"
              >
                {/* Radiating rays from top and sides */}
                <g>
                  {/* Top rays with staggered animation */}
                  <line x1="100" y1="20" x2="100" y2="35" stroke="#F59E0B" strokeWidth="2" opacity="0.8" className="animate-pulse" style={{animationDelay: '0s'}}/>
                  <line x1="100" y1="25" x2="100" y2="40" stroke="#F59E0B" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
                  
                  {/* Side rays - left with staggered animation */}
                  <line x1="20" y1="100" x2="35" y2="100" stroke="#F59E0B" strokeWidth="2" opacity="0.8" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
                  <line x1="25" y1="100" x2="40" y2="100" stroke="#F59E0B" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.7s'}}/>
                  <line x1="30" y1="95" x2="45" y2="85" stroke="#F59E0B" strokeWidth="2" opacity="0.7" className="animate-pulse" style={{animationDelay: '0.3s'}}/>
                  <line x1="35" y1="105" x2="50" y2="115" stroke="#F59E0B" strokeWidth="2" opacity="0.7" className="animate-pulse" style={{animationDelay: '0.8s'}}/>
                  
                  {/* Side rays - right with staggered animation */}
                  <line x1="180" y1="100" x2="165" y2="100" stroke="#F59E0B" strokeWidth="2" opacity="0.8" className="animate-pulse" style={{animationDelay: '0.1s'}}/>
                  <line x1="175" y1="100" x2="160" y2="100" stroke="#F59E0B" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.6s'}}/>
                  <line x1="170" y1="95" x2="155" y2="85" stroke="#F59E0B" strokeWidth="2" opacity="0.7" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
                  <line x1="165" y1="105" x2="150" y2="115" stroke="#F59E0B" strokeWidth="2" opacity="0.7" className="animate-pulse" style={{animationDelay: '0.9s'}}/>
                  
                  {/* Bottom rays with staggered animation */}
                  <line x1="100" y1="180" x2="100" y2="165" stroke="#F59E0B" strokeWidth="2" opacity="0.8" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
                  <line x1="100" y1="175" x2="100" y2="160" stroke="#F59E0B" strokeWidth="2" opacity="0.6" className="animate-pulse" style={{animationDelay: '0.7s'}}/>
                </g>
                
                {/* Hourglass outline */}
                <path 
                  d="M 70 40 L 130 40 L 130 60 L 100 80 L 130 100 L 130 120 L 70 120 L 70 100 L 100 80 L 70 60 Z" 
                  fill="none" 
                  stroke="#F59E0B" 
                  strokeWidth="3"
                  className="drop-shadow-lg"
                />
                
                {/* Top bulb content - South America shape */}
                <path 
                  d="M 75 45 L 85 50 L 90 55 L 88 60 L 85 65 L 80 68 L 75 65 L 72 60 L 75 55 Z" 
                  fill="#F59E0B" 
                  opacity="0.9"
                />
                
                {/* Stars in top bulb */}
                <g fill="#F59E0B">
                  <path d="M 78 48 L 80 50 L 82 48 L 80 46 Z" opacity="0.8"/>
                  <path d="M 88 58 L 90 60 L 92 58 L 90 56 Z" opacity="0.8"/>
                  <path d="M 82 62 L 84 64 L 86 62 L 84 60 Z" opacity="0.8"/>
                </g>
                
                {/* Sand flowing through neck */}
                <path 
                  d="M 98 78 L 102 78 L 102 82 L 98 82 Z" 
                  fill="#F59E0B" 
                  opacity="0.7"
                />
                
                {/* Bottom bulb content - sand pile */}
                <path 
                  d="M 75 110 L 100 115 L 125 110 L 125 118 L 75 118 Z" 
                  fill="#F59E0B" 
                  opacity="0.9"
                />
                
                {/* Stars in bottom bulb */}
                <g fill="#F59E0B">
                  <path d="M 80 112 L 82 114 L 84 112 L 82 110 Z" opacity="0.8"/>
                  <path d="M 95 113 L 97 115 L 99 113 L 97 111 Z" opacity="0.8"/>
                  <path d="M 110 112 L 112 114 L 114 112 L 112 110 Z" opacity="0.8"/>
                </g>
              </svg>
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-xl"></div>
            </div>
            
            {/* Logo text */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-serif font-bold text-amber-400 tracking-wider">
                TIMELINE
              </h2>
              <h3 className="text-xl font-serif font-bold text-amber-400 tracking-wider">
                ALCHEMY
              </h3>
            </div>
            
            <p className="text-amber-400 text-sm font-medium text-center">
              Van intentie naar impact, in ritme met jouw tijdlijn
            </p>
          </div>

          {/* Style Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-full p-1">
              {(['krachtig', 'mystiek', 'creator'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedStyle === style
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {style === 'krachtig' && '⚡ Krachtig'}
                  {style === 'mystiek' && '✨ Mystiek'}
                  {style === 'creator' && '🎨 Creator'}
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
            {currentStyle.bullets.map((bullet, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-full px-4 py-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-slate-300 text-sm font-medium">{bullet}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Even de stroom openen…
              </>
            ) : (
              <>
                {currentStyle.cta}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {/* CTA Microcopy */}
          <p className="text-slate-400 text-sm mt-4 max-w-md mx-auto">
            Direct via Stripe. Je kunt later altijd upgraden of pauzeren.
          </p>
        </div>
      </section>

      {/* Wat je krijgt Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Wat je krijgt
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Een complete content machine die jouw visie verspreidt zonder dat jij er energie aan verliest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Wekelijkse Blogpost",
                description: "Diep, helder, on-brand content dat jouw expertise toont"
              },
              {
                icon: <Share2 className="w-8 h-8" />,
                title: "Cross-Platform Posts",
                description: "Per kanaal geoptimaliseerd voor maximale impact"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Planning & Publicatie",
                description: "Ritme = bereik. Wij zorgen voor consistentie"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Tone-of-Voice Guardrails",
                description: "Jouw signatuur, consistent door alle content"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Linkarchitectuur",
                description: "Alles verwijst terug naar jouw kern"
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Automatische Distributie",
                description: "Set it and forget it - wij doen de rest"
              }
            ].map((item, index) => (
              <Card key={index} className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
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
                answer: "Ja. Je krijgt een concept; wij verwerken je feedback en publiceren gepland."
              },
              {
                question: "Welke platforms dekken jullie?",
                answer: "Minimaal: Instagram, Facebook, X, LinkedIn. Uitbreiden kan."
              },
              {
                question: "Moet ik zelf nog posten?",
                answer: "Hoeft niet. Wij plannen en publiceren (met jouw toestemming/verbindingen)."
              },
              {
                question: "Wat als mijn niche 'anders' is?",
                answer: "Perfect. We trainen op jouw bronnen, glossarium en voorbeelden."
              },
              {
                question: "Kan ik pauzeren of upgraden?",
                answer: "Ja. Via Stripe kun je pauzeren, wijzigen of annuleren."
              }
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

      {/* Trust Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Klaar om te starten?
            </h3>
            <p className="text-slate-300 mb-8 text-lg">
              Join de creators die al hun content stress hebben vervangen door Timeline Alchemy
            </p>
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Even de stroom openen…
                </>
              ) : (
                <>
                  {currentStyle.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            
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
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default TimelineAlchemy;
