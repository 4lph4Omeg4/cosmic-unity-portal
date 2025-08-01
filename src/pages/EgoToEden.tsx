import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { fetchBlogArticles } from '@/integrations/shopify/client';
import { useLanguage } from '@/hooks/useLanguage';

interface BlogArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  handle: string;
  publishedAt: string;
  author: {
    firstName: string;
    lastName: string;
  };
  image?: {
    url: string;
    altText: string;
  };
  tags: string[];
}

const EgoToEden = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Gebruik de enige blog die bestaat: ego-to-eden
        const blogHandle = 'ego-to-eden';
        console.log(`=== EGO TO EDEN: Using the only existing blog handle: ${blogHandle} for language: ${language} ===`);
        
        const fetchedArticles = await fetchBlogArticles(blogHandle, language);
        console.log('Ego to Eden articles:', {
          articlesFound: fetchedArticles.length,
          articles: fetchedArticles
        });

        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error loading Ego to Eden articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [language]);

  const formatDate = (dateString: string) => {
    const locale = language === 'en' ? 'en-US' : language === 'de' ? 'de-DE' : 'nl-NL';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-cosmic-pulse">Loading sacred wisdom from Ego to Eden...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-cosmic animate-cosmic-pulse">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-cosmic-gradient">From Ego</span>{' '}
              <span className="text-mystical-gradient">to Eden</span>
            </h1>
            
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              Een spirituele reis van ontwaking. Transformeer jouw innerlijke wereld en 
              ontdek de weg terug naar je oorspronkelijke paradijs.
            </p>
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
                  {article.image && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={article.image.url}
                        alt={article.image.altText || article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    
                    <CardTitle className="font-cosmic text-cosmic-gradient line-clamp-2">
                      {article.title}
                    </CardTitle>
                    
                    <CardDescription className="font-mystical line-clamp-3">
                      {article.excerpt || stripHtmlTags(article.content).substring(0, 150) + '...'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{`${article.author.firstName} ${article.author.lastName}`.trim()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="mystical" 
                      className="w-full group"
                      onClick={() => {
                        navigate(`/blog/ego-to-eden/${article.handle}`);
                      }}
                    >
                      {language === 'en' ? 'Read Full Article' : language === 'de' ? 'Vollständigen Artikel lesen' : 'Lees Volledig Artikel'}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
                Geen artikelen gevonden
              </h3>
              <p className="font-mystical text-muted-foreground max-w-md mx-auto">
                De spirituele berichten uit "From Ego to Eden" zijn nog onderweg. 
                Keer binnenkort terug voor nieuwe inzichten op je reis naar ontwaking.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EgoToEden;