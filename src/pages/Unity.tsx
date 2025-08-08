import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Eye } from 'lucide-react';
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

const Unity = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        // Gebruik de Unity blog handle
        const blogHandle = 'eenheid-gezien-door-het-enkele-oog';
        console.log(`=== UNITY: Using blog handle: ${blogHandle} for language: ${language} ===`);
        
        const fetchedArticles = await fetchBlogArticles(blogHandle, language);
        console.log('Unity articles:', {
          articlesFound: fetchedArticles.length,
          articles: fetchedArticles
        });

        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error loading Unity articles:', error);
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
              <div className="animate-cosmic-pulse">Loading cosmic unity wisdom...</div>
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
              <div className="w-12 h-12 bg-mystical-gradient rounded-full flex items-center justify-center shadow-mystical animate-cosmic-pulse">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-mystical-gradient">{t('unity.title')}</span>
            </h1>
            
            <h2 className="font-cosmic text-2xl md:text-3xl mb-6 text-cosmic-gradient">
              {t('unity.subtitle')}
            </h2>
            
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('unity.description')}
            </p>
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-mystical">
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
                    <CardTitle className="font-cosmic text-mystical-gradient line-clamp-2">
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
                      variant="cosmic" 
                      className="w-full group"
                      onClick={() => {
                        navigate(`/blog/eenheid-gezien-door-het-enkele-oog/${article.handle}`);
                      }}
                    >
                      {t('unity.readArticle')}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-mystical-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-mystical animate-cosmic-pulse">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-2xl font-bold text-mystical-gradient mb-4">
                {t('unity.noArticlesTitle')}
              </h3>
              <p className="font-mystical text-muted-foreground max-w-md mx-auto">
                {t('unity.noArticlesDescription')}
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Unity;