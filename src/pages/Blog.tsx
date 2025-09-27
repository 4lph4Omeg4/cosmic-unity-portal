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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <div className="text-muted-foreground">Coming Soon</div>
                </div>
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
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <div className="text-muted-foreground">Coming Soon</div>
                </div>
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

          {/* Coming Soon Message */}
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
              Coming Soon
            </h3>
            <p className="font-mystical text-muted-foreground max-w-md mx-auto">
              Blog articles are currently being updated and will be available soon.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
