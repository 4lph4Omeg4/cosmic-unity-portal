import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const FeaturedSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-mystical-gradient rounded-full flex items-center justify-center shadow-mystical animate-cosmic-pulse">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h2 className="font-cosmic text-3xl md:text-5xl font-bold mb-6">
            <span className="text-mystical-gradient">{t('featured.title.sacred')}</span>{' '}
            <span className="text-cosmic-gradient">{t('featured.title.geometry')}</span>
          </h2>
          
          <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('featured.subtitle')}
          </p>
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
            Coming Soon
          </h3>
          <p className="font-mystical text-muted-foreground max-w-md mx-auto">
            Featured products are currently being updated and will be available soon.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
