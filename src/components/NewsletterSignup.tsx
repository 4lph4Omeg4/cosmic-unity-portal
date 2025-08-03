import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Stars, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { subscribeToNewsletter } from '@/services/newsletterService';

interface NewsletterSignupProps {
  variant?: 'footer' | 'section' | 'popup';
  compact?: boolean;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  variant = 'section', 
  compact = false 
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !consent) {
      toast({
        title: t('newsletter.error.incomplete'),
        description: t('newsletter.error.incomplete'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Real API call to newsletter service
    try {
      const result = await subscribeToNewsletter({
        email,
        name: name || undefined,
        consent,
        source: variant as 'footer' | 'homepage' | 'popup',
        language,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to subscribe');
      }

      setIsSuccess(true);
      
      // Create confetti effect
      const confetti = document.createElement('div');
      confetti.className = 'confetti-container';
      confetti.innerHTML = Array.from({ length: 50 }, (_, i) => 
        `<div class="confetti confetti-${i % 5}" style="--delay: ${Math.random() * 2}s"></div>`
      ).join('');
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 3000);

      toast({
        title: t('newsletter.success.title'),
        description: t('newsletter.success.description'),
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        setName('');
        setConsent(false);
      }, 3000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardClassName = () => {
    const base = "relative overflow-hidden transition-all duration-500";
    const glowEffect = "before:absolute before:inset-0 before:bg-cosmic-gradient before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-5";
    
    switch (variant) {
      case 'footer':
        return `${base} bg-card/50 backdrop-blur-sm border-cosmic/30 ${glowEffect}`;
      case 'popup':
        return `${base} bg-card/95 backdrop-blur-md border-cosmic/50 shadow-2xl ${glowEffect}`;
      default:
        return `${base} bg-card/80 backdrop-blur-sm border-cosmic/40 hover:border-cosmic/60 ${glowEffect}`;
    }
  };

  const getContentClassName = () => {
    return compact ? "p-4 space-y-3" : "p-6 space-y-4";
  };

  if (isSuccess) {
    return (
      <Card className={getCardClassName()}>
        <CardContent className={getContentClassName()}>
          <div className="text-center space-y-4 animate-in fade-in-50 zoom-in-95 duration-500">
            <div className="relative">
              <CheckCircle className="w-16 h-16 mx-auto text-cosmic animate-bounce" />
              <Sparkles className="w-6 h-6 absolute top-0 right-1/2 transform translate-x-8 text-cosmic/60 animate-pulse" />
              <Stars className="w-4 h-4 absolute bottom-2 left-1/2 transform -translate-x-8 text-cosmic/40 animate-ping" />
            </div>
            <div className="space-y-2">
              <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient">
                {t('newsletter.success.title')}
              </h3>
              <p className="font-mystical text-muted-foreground">
                {t('newsletter.success.message')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={getCardClassName()}>
      <CardContent className={getContentClassName()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-6 h-6 text-cosmic animate-pulse" />
              <Stars className="w-5 h-5 text-cosmic/60 animate-spin-slow" />
            </div>
            {!compact && (
              <>
                <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient">
                  {t('newsletter.title')}
                </h3>
                <p className="font-mystical text-sm text-muted-foreground">
                  {t('newsletter.subtitle')}
                </p>
              </>
            )}
            {compact && (
              <h4 className="font-cosmic text-lg font-bold text-cosmic-gradient">
                Join the Movement 🌀
              </h4>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="newsletter-email" className="font-mystical text-sm">
                E-mail *
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="jouw@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="cosmic-input transition-all duration-300 focus:border-cosmic focus:ring-cosmic/20"
              />
            </div>

            {!compact && (
              <div className="space-y-2">
                <Label htmlFor="newsletter-name" className="font-mystical text-sm">
                  Naam (optioneel)
                </Label>
                <Input
                  id="newsletter-name"
                  type="text"
                  placeholder="Je kosmische naam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="cosmic-input transition-all duration-300 focus:border-cosmic focus:ring-cosmic/20"
                />
              </div>
            )}

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="newsletter-consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
                className="mt-0.5"
                required
              />
              <Label 
                htmlFor="newsletter-consent" 
                className="font-mystical text-xs text-muted-foreground leading-relaxed cursor-pointer"
              >
                Ik ga akkoord met het ontvangen van de nieuwsbrief en begrijp dat ik me op elk moment kan uitschrijven. 
                Mijn gegevens worden gebruikt conform het{' '}
                <span className="text-cosmic hover:underline">privacybeleid</span>.
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !email || !consent}
            className="w-full cosmic-hover bg-cosmic-gradient hover:shadow-cosmic text-white font-mystical transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:hover:shadow-none"
            size={compact ? "default" : "lg"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting to the cosmos...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Enter the Circle
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <style jsx>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: hsl(var(--cosmic));
          animation: confetti-fall 3s linear forwards;
          animation-delay: var(--delay);
        }
        
        .confetti-0 { background: hsl(var(--cosmic)); }
        .confetti-1 { background: hsl(var(--primary)); }
        .confetti-2 { background: hsl(var(--accent)); }
        .confetti-3 { background: #FFD700; }
        .confetti-4 { background: #FF69B4; }
        
        @keyframes confetti-fall {
          0% {
            top: -10px;
            left: random(100) * 1%;
            transform: rotateZ(0deg);
          }
          100% {
            top: 100vh;
            transform: rotateZ(720deg);
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </Card>
  );
};

export default NewsletterSignup;
