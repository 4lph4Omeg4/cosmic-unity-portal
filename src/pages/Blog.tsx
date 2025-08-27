import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { fetchBlogArticles, fetchAllBlogs, testConnection } from '@/integrations/shopify/client';
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedBlogContent } from '@/utils/contentLocalization';
import StorageImage from '@/components/StorageImage';

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
  blogHandle?: string; // Add blog handle to determine correct linking
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

        // Fetch articles from existing blog handles with language context
        console.log('Fetching articles from blogs...');

        // Use existing Dutch blog handles but pass language for content translation
        const blogHandles = ['ego-to-eden', 'eenheid-gezien-door-het-enkele-oog'];
        let allArticles: BlogArticle[] = [];

        for (const blogHandle of blogHandles) {
          try {
            console.log(`=== BLOG PAGE: Fetching from blog handle: ${blogHandle} for language: ${language} ===`);
            const fetchedArticles = await fetchBlogArticles(blogHandle, language);

            console.log(`Blog ${blogHandle} fetch result:`, {
              articlesFound: fetchedArticles.length,
              articles: fetchedArticles.map(a => ({ title: a.title, handle: a.handle }))
            });

            // Add blog handle info to articles for correct linking
            const articlesWithBlogHandle = fetchedArticles.map(article => ({
              ...article,
              blogHandle
            }));

            allArticles = [...allArticles, ...articlesWithBlogHandle];
          } catch (error) {
            console.error(`Error fetching from blog ${blogHandle}:`, error);
          }
        }
        
        // Sort by publication date (newest first) and take top 6
        allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        setArticles(allArticles.slice(0, 6));
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
              <span className="text-cosmic-gradient">{t('blog.title')}</span>
            </h1>
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('blog.description')}
            </p>
          </div>

          {/* Blog Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <StorageImage
                  bucket="blog-images"
                  path="header-cosmic.png"
                  alt="Ego to Eden - Cosmic Journey"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="font-cosmic text-2xl text-cosmic-gradient">
                  {t('blog.egoToEden.title')}
                </CardTitle>
                <CardDescription className="font-mystical">
                  {t('blog.egoToEden.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="mystical"
                  className="w-full group"
                  asChild
                >
                  <Link to="/ego-to-eden">
                    {t('blog.exploreBlog')}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <StorageImage
                  bucket="blog-images"
                  path="header-utopia.png"
                  alt="Unity - Seen Through the Single Eye"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="font-cosmic text-2xl text-cosmic-gradient">
                  {t('blog.unity.title')}
                </CardTitle>
                <CardDescription className="font-mystical">
                  {t('blog.unity.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="cosmic"
                  className="w-full group"
                  asChild
                >
                  <Link to="/eenheid-gezien-door-het-enkele-oog">
                    {t('blog.exploreBlog')}
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Latest Articles Section */}
          <div className="text-center mb-12">
            <h2 className="font-cosmic text-3xl font-bold mb-4">
              <span className="text-mystical-gradient">
                {t('blog.latestArticles')}
              </span>
            </h2>
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
                      asChild
                    >
                      <Link to={`/blog/${article.blogHandle || 'ego-to-eden'}/${article.handle}`}>
                        {t('blog.readMore')}
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
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
                {t('blog.noArticlesTitle')}
              </h3>
              <p className="font-mystical text-muted-foreground max-w-md mx-auto">
                {t('blog.noArticlesDescription')}
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
