import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const Blog = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-cosmic-gradient">{t('blog.title')}</span>
            </h1>
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('blog.description')}
            </p>
          </div>

          {/* Blog Categories */}
          <div className="max-w-2xl mx-auto mb-16">
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 flex items-center justify-center">
                  <div className="text-4xl font-cosmic text-cosmic-gradient">Timeline Alchemy</div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="font-cosmic text-2xl text-cosmic-gradient">
                  Timeline Alchemy
                </CardTitle>
                <CardDescription className="font-mystical">
                  Ontdek de kunst van bewustzijnstransformatie en tijdlijn alchemie. Leer hoe je jouw realiteit kunt verschuiven naar een hogere dimensie van ervaring.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="mystical"
                  className="w-full group"
                  asChild
                >
                  <a href="https://timeline-alchemy.nl" target="_blank" rel="noopener noreferrer">
                    Bezoek Timeline Alchemy Blog
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
