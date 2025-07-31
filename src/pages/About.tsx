import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Star, Eye, Zap, Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const About = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-mystical-gradient rounded-full flex items-center justify-center shadow-mystical animate-cosmic-pulse">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-mystical-gradient">{t('about.title.the')}</span>{' '}
              <span className="text-cosmic-gradient">{t('about.title.chosenOnes')}</span>
            </h1>
            
            <p className="font-mystical text-xl text-muted-foreground">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-8 mb-12 shadow-mystical">
            <h2 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-6 text-center">
              {t('about.mission.title')}
            </h2>
            
            <p className="font-mystical text-lg text-muted-foreground mb-6 leading-relaxed">
              {t('about.mission.p1')}
            </p>
            
            <p className="font-mystical text-lg text-muted-foreground mb-6 leading-relaxed">
              {t('about.mission.p2')}
            </p>
          </div>

          {/* Sacred Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center cosmic-hover">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-cosmic">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-3">{t('about.principles.unity.title')}</h3>
              <p className="font-mystical text-muted-foreground">
                {t('about.principles.unity.text')}
              </p>
            </div>
            
            <div className="text-center cosmic-hover">
              <div className="w-16 h-16 bg-mystical-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-mystical">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-xl font-bold text-mystical-gradient mb-3">{t('about.principles.awakening.title')}</h3>
              <p className="font-mystical text-muted-foreground">
                {t('about.principles.awakening.text')}
              </p>
            </div>
            
            <div className="text-center cosmic-hover">
              <div className="w-16 h-16 bg-energy-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-energy">
                <Heart className="w-8 h-8 text-cosmic-foreground" />
              </div>
              <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-3">{t('about.principles.love.title')}</h3>
              <p className="font-mystical text-muted-foreground">
                {t('about.principles.love.text')}
              </p>
            </div>
          </div>


          {/* Call to Action */}
          <div className="text-center">
            <h2 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="font-mystical text-lg text-muted-foreground mb-8">
              {t('about.cta.text')}
            </p>
            <Button variant="divine" size="lg" className="group">
              {t('about.cta.button')}
              <Star className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;