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
        console.log('Available collections:', collections.map(c => ({ title: c.title, handle: c.handle })));

        // Try multiple possible handles for Digital Products
        const digitalCollection = collections.find(
          collection =>
            collection.handle === 'digital-products' ||
            collection.handle === 'digitale' ||
            collection.title === 'Digital Products'
        );
        
        if (digitalCollection?.products?.edges) {
          const products = digitalCollection.products.edges.map(edge => edge.node);
          setDigitalProducts(products.slice(0, 4)); // Toon maximaal 4 producten
        } else {
          // Use fallback products when collection not found
          console.log('Using fallback digital products');
          const fallbackProducts = [
            {
              id: 'fallback-1',
              title: 'Sacred Awakening Guide',
              description: 'A comprehensive digital guide to spiritual awakening and cosmic consciousness. Unlock the secrets of the universe and discover your divine purpose through ancient wisdom.',
              images: { edges: [{ node: { url: '/placeholder.svg', altText: 'Sacred Awakening Guide' } }] },
              variants: { edges: [{ node: { id: 'var-1', price: { amount: '29.99', currencyCode: 'EUR' } } }] },
              handle: 'sacred-awakening-guide'
            },
            {
              id: 'fallback-2',
              title: 'Cosmic Meditation Collection',
              description: 'Guided meditations for connecting with higher dimensional beings and the galactic federation of light. Transform your consciousness and raise your vibration.',
              images: { edges: [{ node: { url: '/placeholder.svg', altText: 'Cosmic Meditation Collection' } }] },
              variants: { edges: [{ node: { id: 'var-2', price: { amount: '49.99', currencyCode: 'EUR' } } }] },
              handle: 'cosmic-meditation-collection'
            },
            {
              id: 'fallback-3',
              title: 'Sacred Geometry Blueprint',
              description: 'Digital blueprints and sacred geometry patterns for manifestation and reality creation. Harness the power of universal mathematics.',
              images: { edges: [{ node: { url: '/placeholder.svg', altText: 'Sacred Geometry Blueprint' } }] },
              variants: { edges: [{ node: { id: 'var-3', price: { amount: '39.99', currencyCode: 'EUR' } } }] },
              handle: 'sacred-geometry-blueprint'
            },
            {
              id: 'fallback-4',
              title: 'Akashic Records Training',
              description: 'Learn to access the cosmic library of all knowledge. This digital course teaches you to read the Akashic Records and unlock universal wisdom.',
              images: { edges: [{ node: { url: '/placeholder.svg', altText: 'Akashic Records Training' } }] },
              variants: { edges: [{ node: { id: 'var-4', price: { amount: '79.99', currencyCode: 'EUR' } } }] },
              handle: 'akashic-records-training'
            }
          ];
          setDigitalProducts(fallbackProducts);
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
                <Card key={product.id} className="cosmic-hover group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm h-full flex flex-col">
                  <CardHeader className="relative p-0">
                    <div className="aspect-square bg-gradient-to-br from-cosmic/20 to-secondary/20 rounded-t-lg overflow-hidden relative">
                      <img
                        src={productImage}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-energy-gradient text-white shadow-lg">
                          Digital
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 w-8 h-8 bg-cosmic/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Download className="w-4 h-4 text-cosmic" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1">
                    <CardTitle className="font-mystical text-lg mb-2 group-hover:text-cosmic transition-colors line-clamp-2">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="font-mystical text-sm text-muted-foreground mb-4 line-clamp-4">
                      {product.description}
                    </CardDescription>
                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-cosmic text-xl font-bold text-cosmic-gradient">
                          {productPrice ? formatPrice(productPrice.amount, productPrice.currencyCode) : 'Prijs op aanvraag'}
                        </span>
                        <Badge variant="energy" className="text-xs">
                          Digital
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Download className="w-3 h-3" />
                        <span>Instant Download</span>
                      </div>
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
