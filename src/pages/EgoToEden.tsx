import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import StorageImage from '@/components/StorageImage';

const EgoToEden = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header with Image */}
          <div className="text-center mb-16">
            <div className="aspect-video overflow-hidden rounded-lg mb-8 shadow-cosmic">
              <StorageImage
                bucket="blog-images"
                path="0175ee3b-7623-42f0-8af6-3a23236c9fed/header-cosmic.png"
                alt="Ego to Eden - Cosmic Journey"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-cosmic-gradient">{t('blog.egoToEden.title')}</span>
            </h1>
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('blog.egoToEden.description')}
            </p>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
              Coming Soon
            </h3>
            <p className="font-mystical text-muted-foreground max-w-md mx-auto">
              Ego to Eden articles are currently being updated and will be available soon.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EgoToEden;