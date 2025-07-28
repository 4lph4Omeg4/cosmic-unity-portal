import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Book } from 'lucide-react';
import { fetchCollections } from '@/integrations/shopify/client';

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  handle: string;
}

interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

const FeaturedSection = () => {
  const [digitalProducts, setDigitalProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDigitalProducts = async () => {
      try {
        const collections: ShopifyCollection[] = await fetchCollections();
        const digitalCollection = collections.find(
          collection => collection.handle === 'digitale'
        );
        
        if (digitalCollection?.products?.edges) {
          const products = digitalCollection.products.edges.map(edge => edge.node);
          setDigitalProducts(products.slice(0, 4)); // Toon maximaal 4 producten
        }
      } catch (error) {
        console.error('Error loading digital products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDigitalProducts();
  }, []);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

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
            <span className="text-cosmic-gradient">Scriptures</span>
          </h2>
          
          <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of digital spiritual content, sacred texts, 
            and consciousness-expanding wisdom for the awakened soul.
          </p>
        </div>

        {/* Featured Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="cosmic-hover group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm animate-pulse">
                <CardHeader className="relative">
                  <div className="aspect-square bg-gradient-to-br from-cosmic/20 to-secondary/20 rounded-lg"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-6 bg-cosmic/20 rounded mb-2"></div>
                  <div className="h-4 bg-cosmic/10 rounded mb-4"></div>
                  <div className="h-4 bg-cosmic/10 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {digitalProducts.map((product) => {
              const productImage = product.images?.edges?.[0]?.node?.url || '/placeholder.svg';
              const productPrice = product.variants?.edges?.[0]?.node?.price;
              
              return (
                <Card key={product.id} className="cosmic-hover group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="secondary" className="bg-energy-gradient text-white">
                        Digital
                      </Badge>
                      <div className="w-8 h-8 bg-cosmic/20 rounded-full flex items-center justify-center">
                        <Download className="w-4 h-4 text-cosmic" />
                      </div>
                    </div>
                    
                    <div className="aspect-square bg-gradient-to-br from-cosmic/20 to-secondary/20 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src={productImage} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardTitle className="font-mystical text-lg mb-2 group-hover:text-cosmic transition-colors">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="font-mystical text-sm text-muted-foreground mb-4 line-clamp-3">
                      {product.description}
                    </CardDescription>
                    <div className="flex justify-between items-center">
                      <span className="font-cosmic text-lg text-cosmic-gradient">
                        {productPrice ? formatPrice(productPrice.amount, productPrice.currencyCode) : 'Prijs op aanvraag'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Digital
                      </Badge>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      variant="energy" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(`/product/${product.handle}`, '_blank')}
                    >
                      Bekijk Product
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

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
