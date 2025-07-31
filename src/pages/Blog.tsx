import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { fetchBlogArticles, fetchAllBlogs, testConnection } from '@/integrations/shopify/client';
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

const Blog = () => {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        console.log('=== FETCHING BLOG ARTICLES ===');

        // Test connection first
        console.log('Testing Shopify connection...');
        const connectionOk = await testConnection();
        console.log('Connection test result:', connectionOk);

        if (!connectionOk) {
          console.error('Shopify API connection failed - cannot fetch blog articles');
          return;
        }

        // Eerst alle blogs ophalen om de juiste handle te vinden
        console.log('Fetching all blogs to find available handles...');
        const allBlogs = await fetchAllBlogs(language);
        console.log('All blogs found:', {
          blogsFound: allBlogs.length,
          blogs: allBlogs.map(blog => ({ id: blog.id, title: blog.title, handle: blog.handle }))
        });

        // Gebruik de enige blog die bestaat: ego-to-eden
        const blogHandle = 'ego-to-eden';
        console.log(`=== BLOG PAGE: Using the only existing blog handle: ${blogHandle} for language: ${language} ===`);
        
        const fetchedArticles = await fetchBlogArticles(blogHandle, language);
        console.log('Blog fetch result:', {
          articlesFound: fetchedArticles.length,
          articles: fetchedArticles.map(a => ({ title: a.title, handle: a.handle }))
        });

        setArticles(fetchedArticles.slice(0, 3));
      } catch (error) {
        console.error('Error loading articles:', error);
        console.error('Full error:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-cosmic-pulse">{t('common.loading')}</div>
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
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-cosmic-gradient">Sacred</span>{' '}
              <span className="text-mystical-gradient">Wisdom</span>
            </h1>
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Break through the illusion and discover the truth behind the matrix. Messages from higher dimensions for awakening souls.'
                : language === 'de' 
                ? 'Durchbreche die Illusion und entdecke die Wahrheit hinter der Matrix. Botschaften aus höheren Dimensionen für erwachende Seelen.'
                : 'Doorbreek de illusie en ontdek de waarheid achter de matrix. Berichten uit hogere dimensies voor de ontwakende zielen.'
              }
            </p>
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Card key={article.id} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
                  {article.image && (
                    <div className="overflow-hidden rounded-t-lg">
                      <img
                        src={article.image.url}
                        alt={article.image.altText || article.title}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="cosmic" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <CardTitle className="font-cosmic text-cosmic-gradient">
                      {article.title}
                    </CardTitle>
                    
                    <CardDescription className="font-mystical">
                      {article.excerpt || article.content.substring(0, 120) + '...'}
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
                        window.location.href = `/blog/ego-to-eden/${article.handle}`;
                      }}
                    >
                      {language === 'en' ? 'Read More' : language === 'de' ? 'Mehr Lesen' : 'Lees Meer'}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
                {language === 'en' ? 'No articles found' : language === 'de' ? 'Keine Artikel gefunden' : 'Geen artikelen gevonden'}
              </h3>
              <p className="font-mystical text-muted-foreground max-w-md mx-auto">
                {language === 'en' 
                  ? 'The cosmic messages are still on their way. Come back soon for new insights.'
                  : language === 'de' 
                  ? 'Die kosmischen Botschaften sind noch unterwegs. Kehre bald zurück für neue Einsichten.'
                  : 'De kosmische berichten zijn nog onderweg. Keer binnenkort terug voor nieuwe inzichten.'
                }
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
