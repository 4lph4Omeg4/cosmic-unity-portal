import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const BlogArticle = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const goBack = () => {
    navigate('/blog');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-8">
            <Button variant="outline" onClick={goBack} className="group">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              {language === 'en' ? 'Back to overview' : language === 'de' ? 'Zurück zur Übersicht' : 'Terug naar overzicht'}
            </Button>
          </div>

          {/* Coming Soon Message */}
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
              {language === 'en' ? 'Article not available' : language === 'de' ? 'Artikel nicht verfügbar' : 'Artikel niet beschikbaar'}
            </h3>
            <p className="font-mystical text-muted-foreground max-w-md mx-auto mb-6">
              {language === 'en' 
                ? 'This article is currently being updated and will be available soon.'
                : language === 'de' 
                ? 'Dieser Artikel wird derzeit aktualisiert und wird bald verfügbar sein.'
                : 'Dit artikel wordt momenteel bijgewerkt en zal binnenkort beschikbaar zijn.'
              }
            </p>
            <Button variant="mystical" onClick={goBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Back to overview' : language === 'de' ? 'Zurück zur Übersicht' : 'Terug naar overzicht'}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogArticle;
