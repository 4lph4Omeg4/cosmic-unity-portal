import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Stars, Sparkles, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { subscribeToNewsletter } from '@/services/newsletterService';
import { submitToShopifyForm } from '@/services/shopifyFormService';

interface NewsletterSignupProps {
  variant?: 'footer' | 'section' | 'popup';
  compact?: boolean;
  onSuccess?: () => void;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'section',
  compact = false,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [createAccount, setCreateAccount] = useState(true);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { user, signUp } = useAuth();
  const { profile } = useProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !consent) {
      toast({
        title: t('newsletter.error.incomplete'),
        description: t('newsletter.error.incomplete'),
        variant: "destructive",
      });
      return;
    }

    if (createAccount && !password) {
      toast({
        title: t('newsletter.error.password'),
        description: t('newsletter.error.password'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to Shopify form first
      const fullName = `${firstName} ${lastName}`.trim();
      await submitToShopifyForm({
        email,
        firstName,
        lastName,
        consent
      });

      // Then subscribe to newsletter
      const result = await subscribeToNewsletter({
        email,
        name: fullName || undefined,
        consent,
        source: variant as 'footer' | 'homepage' | 'popup',
        language,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to subscribe');
      }

      // If user wants to create account and isn't already logged in
      if (createAccount && !user && password) {
        const fullName = `${firstName} ${lastName}`.trim();
        const { error: authError } = await signUp(email, password, fullName || undefined);

        if (authError) {
          // Newsletter subscription succeeded but account creation failed
          const title = language === 'en' ? 'Newsletter subscription successful' : language === 'de' ? 'Newsletter-Anmeldung erfolgreich' : 'Nieuwsbrief aanmelding geslaagd';
          const description = language === 'en'
            ? `You're subscribed to the newsletter, but account creation failed: ${authError.message}`
            : language === 'de'
            ? `Sie sind für den Newsletter angemeldet, aber die Kontoerstellung ist fehlgeschlagen: ${authError.message}`
            : `Je bent aangemeld voor de nieuwsbrief, maar account aanmaken mislukte: ${authError.message}`;
          toast({
            title,
            description,
            variant: "destructive",
          });
        } else {
          const title = language === 'en' ? 'Welcome to the Inner Circle! 🌀' : language === 'de' ? 'Willkommen im Inneren Kreis! 🌀' : 'Welkom in de Inner Circle! 🌀';
          const description = language === 'en'
            ? 'Your newsletter subscription and portal account have been created! Check your email for confirmation.'
            : language === 'de'
            ? 'Ihre Newsletter-Anmeldung und Ihr Portal-Konto wurden erstellt! Überprüfen Sie Ihre E-Mail zur Bestätigung.'
            : 'Je nieuwsbrief aanmelding en portal account zijn aangemaakt! Check je email voor bevestiging.';
          toast({
            title,
            description,
          });
        }
      } else {
        toast({
          title: t('newsletter.success.title'),
          description: t('newsletter.success.description'),
        });
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
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
      }, 3000);

      // Call success callback if provided (for popup closing)
      if (onSuccess) {
        onSuccess();
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setCreateAccount(true);
        setConsent(false);
      }, 3000);

    } catch (error) {
      const title = language === 'en' ? 'Error' : language === 'de' ? 'Fehler' : 'Fout';
      const description = language === 'en'
        ? 'Something went wrong. Please try again.'
        : language === 'de'
        ? 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.'
        : 'Er is iets misgegaan. Probeer het opnieuw.';
      toast({
        title,
        description,
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

  // Show welcome back message for logged in users
  if (user) {
    return (
      <Card className={getCardClassName()}>
        <CardContent className={getContentClassName()}>
          <div className="text-center space-y-4 animate-in fade-in-50 zoom-in-95 duration-500">
            <div className="relative mx-auto">
              {profile?.avatar_url ? (
                <div className="relative">
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || user.email || 'User'}
                    className="w-16 h-16 mx-auto rounded-full border-2 border-cosmic shadow-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-cosmic rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-16 h-16 mx-auto rounded-full bg-cosmic-gradient flex items-center justify-center text-white font-cosmic text-xl shadow-lg">
                    {profile?.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '✨'}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Stars className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              <Sparkles className="w-6 h-6 absolute top-0 left-1/2 transform -translate-x-12 text-cosmic/60 animate-pulse" />
              <Stars className="w-4 h-4 absolute bottom-2 right-1/2 transform translate-x-12 text-primary/40 animate-ping" />
            </div>

            <div className="space-y-2">
              <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient">
                {t('newsletter.welcome.title')}
              </h3>
              <p className="font-mystical text-muted-foreground">
                {profile?.display_name && (
                  <span className="block font-semibold text-foreground mb-1">
                    {profile.display_name}
                  </span>
                )}
                {t('newsletter.welcome.message')}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cosmic/10 rounded-full">
                <Stars className="w-4 h-4 text-cosmic" />
                <span className="font-mystical text-xs text-cosmic font-medium">
                  {t('newsletter.welcome.status')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                {t('newsletter.compact.title')}
              </h4>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="newsletter-email" className="font-mystical text-sm">
                {t('newsletter.email.label')} *
              </Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder={t('newsletter.email.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="cosmic-input transition-all duration-300 focus:border-cosmic focus:ring-cosmic/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="newsletter-firstname" className="font-mystical text-sm">
                  Voornaam *
                </Label>
                <Input
                  id="newsletter-firstname"
                  type="text"
                  placeholder="Voornaam"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="cosmic-input transition-all duration-300 focus:border-cosmic focus:ring-cosmic/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newsletter-lastname" className="font-mystical text-sm">
                  Achternaam *
                </Label>
                <Input
                  id="newsletter-lastname"
                  type="text"
                  placeholder="Achternaam"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="cosmic-input transition-all duration-300 focus:border-cosmic focus:ring-cosmic/20"
                />
              </div>
            </div>

            {/* Account Creation Option */}
            {!compact && !user && (
              <div className="space-y-3 pt-2 border-t border-border/30">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="create-account"
                    checked={createAccount}
                    onCheckedChange={(checked) => setCreateAccount(Boolean(checked))}
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="create-account"
                    className="font-mystical text-sm text-foreground leading-relaxed cursor-pointer"
                  >
                    {t('newsletter.account.create')}
                    <span className="block text-xs text-muted-foreground mt-1">
                      {t('newsletter.account.benefits')}
                    </span>
                  </Label>
                </div>

                {createAccount && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="newsletter-password" className="font-mystical text-sm">
                      {t('newsletter.password.label')} *
                    </Label>
                    <Input
                      id="newsletter-password"
                      type="password"
                      placeholder={t('newsletter.password.placeholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="cosmic-input transition-all duration-300 focus:border-cosmic focus:ring-cosmic/20"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('newsletter.password.hint')}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start space-x-2 pt-2 relative z-10">
              <Checkbox
                id="newsletter-consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(Boolean(checked))}
                className="mt-0.5 pointer-events-auto"
                required
              />
              <Label
                htmlFor="newsletter-consent"
                className="font-mystical text-xs text-muted-foreground leading-relaxed cursor-pointer pointer-events-auto"
              >
                {t('newsletter.consent')}{' '}
                <span className="text-cosmic hover:underline">privacybeleid</span>.
              </Label>
            </div>
          </div>



          <Button
            type="submit"
            disabled={isSubmitting || !email || !firstName || !lastName || !consent || (createAccount && !password)}
            className="w-full cosmic-hover bg-cosmic-gradient hover:shadow-cosmic text-white font-mystical transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:hover:shadow-none pointer-events-auto relative z-10"
            size={compact ? "default" : "lg"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('newsletter.button.loading')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('newsletter.button')}
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <style>
        {`
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
            left: 50%;
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
        `}
      </style>
    </Card>
  );
};

export default NewsletterSignup;
