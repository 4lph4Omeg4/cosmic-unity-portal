import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Filter, Grid, List } from 'lucide-react';

const Shop = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-cosmic animate-cosmic-pulse">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-cosmic-gradient">Sacred</span>{' '}
              <span className="text-mystical-gradient">Shop</span>
            </h1>
            
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover consciousness-expanding merchandise designed to awaken your divine purpose 
              and connect you with the galactic federation of light.
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Egypt & The 7 Seals',
                description: 'Ancient wisdom meets modern consciousness',
                badge: 'Bestseller',
                items: '12 products'
              },
              {
                title: 'Fun Shirts',
                description: 'Playful designs with cosmic energy',
                badge: 'New',
                items: '8 products'
              },
              {
                title: 'Digital Products',
                description: 'Instant downloads for awakening souls',
                badge: 'Featured',
                items: '6 products'
              },
              {
                title: 'The Chosen Ones',
                description: 'Exclusive merchandise for the awakened',
                badge: 'Limited',
                items: '4 products'
              },
              {
                title: 'Galactic Federation',
                description: 'Connect with cosmic consciousness',
                badge: 'Premium',
                items: '10 products'
              },
              {
                title: 'Glitch in the Matrix',
                description: 'Reality-bending designs',
                badge: 'Trending',
                items: '7 products'
              }
            ].map((collection, index) => (
              <div key={index} className="cosmic-hover group">
                <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-cosmic">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="cosmic">{collection.badge}</Badge>
                    <span className="text-sm text-muted-foreground">{collection.items}</span>
                  </div>
                  
                  <div className="aspect-square bg-gradient-to-br from-cosmic/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                    <Star className="w-12 h-12 text-cosmic/60" />
                  </div>
                  
                  <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-2">
                    {collection.title}
                  </h3>
                  
                  <p className="font-mystical text-muted-foreground mb-6">
                    {collection.description}
                  </p>
                  
                  <Button variant="mystical" className="w-full">
                    Explore Collection
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;