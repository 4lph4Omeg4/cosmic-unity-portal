import React from 'react';
import { Star, Sparkles, Stars } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';
import { useLanguage } from '@/hooks/useLanguage';

const NewsletterSection = () => {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic/5 via-transparent to-primary/5"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-cosmic/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16 space-y-6">
          {/* Sacred Header */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Star className="w-8 h-8 text-cosmic animate-pulse" />
            <Sparkles className="w-6 h-6 text-primary animate-spin-slow" />
            <Stars className="w-8 h-8 text-cosmic animate-pulse delay-500" />
          </div>
          
          <h2 className="font-cosmic text-4xl md:text-5xl font-bold text-cosmic-gradient">
            {t('newsletter.section.title')}
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            <p className="font-mystical text-xl text-muted-foreground leading-relaxed">
              {t('newsletter.section.subtitle')}
            </p>
            <p className="font-mystical text-lg text-muted-foreground/80">
              {t('newsletter.section.description')}
            </p>
          </div>
        </div>

        {/* Newsletter Component Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Features List */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="font-cosmic text-2xl font-bold text-mystical-gradient mb-6">
              {t('newsletter.benefits.title')}
            </h3>

            <div className="space-y-4">
              {[
                {
                  icon: Star,
                  title: t('newsletter.benefits.wisdom.title'),
                  description: t('newsletter.benefits.wisdom.desc')
                },
                {
                  icon: Sparkles,
                  title: t('newsletter.benefits.access.title'),
                  description: t('newsletter.benefits.access.desc')
                },
                {
                  icon: Stars,
                  title: t('newsletter.benefits.guidance.title'),
                  description: t('newsletter.benefits.guidance.desc')
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-cosmic/10 flex items-center justify-center group-hover:bg-cosmic/20 transition-colors duration-300">
                    <benefit.icon className="w-4 h-4 text-cosmic" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-cosmic font-semibold text-foreground">
                      {benefit.title}
                    </h4>
                    <p className="font-mystical text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-2">
            <NewsletterSignup variant="section" />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="font-mystical text-sm text-muted-foreground mb-4">
            {t('newsletter.trust.members')}
          </p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-cosmic" />
              <span className="font-mystical text-xs">{t('newsletter.trust.privacy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cosmic" />
              <span className="font-mystical text-xs">{t('newsletter.trust.spam')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Stars className="w-4 h-4 text-cosmic" />
              <span className="font-mystical text-xs">{t('newsletter.trust.unsubscribe')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
