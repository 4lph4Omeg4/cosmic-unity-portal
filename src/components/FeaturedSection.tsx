import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Book, Shirt, Coffee } from 'lucide-react';

const FeaturedSection = () => {
  const featuredItems = [
    {
      id: 1,
      type: 'product',
      title: 'Egypt & The 7 Seals Collection',
      description: 'Sacred geometry designs inspired by ancient Egyptian wisdom and the seven seals of consciousness.',
      image: '/placeholder.svg',
      price: '€29.99',
      badge: 'Bestseller',
      icon: Shirt,
      category: 'Apparel'
    },
    {
      id: 2,
      type: 'digital',
      title: 'Trinity of Transformation',
      description: 'Digital guide to awakening your divine trinity: Mind, Body, and Spirit through cosmic consciousness.',
      image: '/placeholder.svg',
      price: '€19.99',
      badge: 'New',
      icon: Download,
      category: 'Digital'
    },
    {
      id: 3,
      type: 'blog',
      title: 'From Ego to Eden',
      description: 'Journey through the sacred geometry of consciousness and discover your true divine nature.',
      image: '/placeholder.svg',
      price: 'Free',
      badge: 'Featured',
      icon: Book,
      category: 'Blog'
    },
    {
      id: 4,
      type: 'product',
      title: 'Galactic Federation Mug',
      description: 'Start your day with cosmic energy. Sacred symbols to align your morning ritual with divine purpose.',
      image: '/placeholder.svg',
      price: '€14.99',
      badge: 'Limited',
      icon: Coffee,
      category: 'Lifestyle'
    }
  ];

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case 'Bestseller': return 'cosmic';
      case 'New': return 'energy';
      case 'Featured': return 'mystical';
      case 'Limited': return 'divine';
      default: return 'default';
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-mystical-gradient rounded-full flex items-center justify-center shadow-mystical animate-cosmic-pulse">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h2 className="font-cosmic text-3xl md:text-5xl font-bold mb-6">
            <span className="text-mystical-gradient">Sacred</span>{' '}
            <span className="text-cosmic-gradient">Scripture</span>
          </h2>
          
          <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of digital spiritual content, sacred texts, 
            and consciousness-expanding wisdom for the awakened soul.
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card key={item.id} className="cosmic-hover group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                <CardHeader className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary" className={`bg-${getBadgeVariant(item.badge)}-gradient text-white`}>
                      {item.badge}
                    </Badge>
                    <div className="w-8 h-8 bg-cosmic/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-cosmic" />
                    </div>
                  </div>
                  
                  <div className="aspect-square bg-gradient-to-br from-cosmic/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                    <IconComponent className="w-12 h-12 text-cosmic/60" />
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardTitle className="font-mystical text-lg mb-2 group-hover:text-cosmic transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="font-mystical text-sm text-muted-foreground mb-4">
                    {item.description}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <span className="font-cosmic text-lg text-cosmic-gradient">{item.price}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant={item.type === 'digital' ? 'energy' : item.type === 'blog' ? 'mystical' : 'cosmic'} 
                    size="sm" 
                    className="w-full"
                  >
                    {item.type === 'digital' ? 'Download' : item.type === 'blog' ? 'Read More' : 'Add to Cart'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button variant="divine" size="lg" className="group">
            Explore All Offerings
            <Star className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;