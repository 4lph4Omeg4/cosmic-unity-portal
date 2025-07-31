import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react';
import { fetchBlogArticles } from '@/integrations/shopify/client';

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

const BlogArticle = () => {
  const { blogHandle, articleHandle } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        console.log('=== FETCHING SPECIFIC BLOG ARTICLE ===');
        console.log('Blog handle:', blogHandle);
        console.log('Article handle:', articleHandle);
        
        const articles = await fetchBlogArticles(blogHandle || 'ego-to-eden');
        const foundArticle = articles.find((a: BlogArticle) => a.handle === articleHandle);
        
        console.log('Found article:', foundArticle);
        setArticle(foundArticle || null);
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (articleHandle) {
      loadArticle();
    }
  }, [blogHandle, articleHandle]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const goBack = () => {
    if (blogHandle) {
      navigate(`/blog/${blogHandle}`);
    } else {
      navigate('/blog');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-cosmic-pulse">Loading sacred wisdom...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
                Artikel niet gevonden
              </h3>
              <p className="font-mystical text-muted-foreground max-w-md mx-auto mb-6">
                Het spirituele bericht dat je zoekt kon niet worden gevonden.
              </p>
              <Button variant="mystical" onClick={goBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar overzicht
              </Button>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-8">
            <Button variant="outline" onClick={goBack} className="group">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Terug naar overzicht
            </Button>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            {article.image && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={article.image.url}
                  alt={article.image.altText || article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="cosmic">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="font-cosmic text-3xl md:text-5xl font-bold mb-6 text-cosmic-gradient">
              {article.title}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-mystical">
                  {`${article.author.firstName} ${article.author.lastName}`.trim()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-mystical">
                  {formatDate(article.publishedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-cosmic-gradient prose-p:text-foreground prose-a:text-primary prose-strong:text-foreground prose-em:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Bottom navigation */}
          <div className="mt-12 pt-8 border-t border-border">
            <Button variant="mystical" onClick={goBack} className="group">
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Terug naar alle artikelen
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogArticle;