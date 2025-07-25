import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Filter, Grid, List, ShoppingCart, ExternalLink } from 'lucide-react';
import { fetchCollections, fetchProducts, createCheckout } from '@/integrations/shopify/client';

interface ShopifyCollection {
  id: string;
  title: string;
  description: string;
  handle: string;
  image?: {
    url: string;
    altText: string;
  };
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        handle: string;
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
        images: {
          edges: Array<{
            node: {
              url: string;
              altText: string;
            };
          }>;
        };
      };
    }>;
  };
}

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
}

const Shop = () => {
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCollections, fetchedProducts] = await Promise.all([
          fetchCollections(),
          fetchProducts()
        ]);
        setCollections(fetchedCollections);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddToCart = async (variantId: string) => {
    try {
      const checkout = await createCheckout([{ variantId, quantity: 1 }]);
      if (checkout?.webUrl) {
        window.open(checkout.webUrl, '_blank');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-cosmic-pulse">Loading cosmic merchandise...</div>
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
          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {collections.map((collection) => (
                <Card key={collection.id} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="cosmic">Collection</Badge>
                      <span className="text-sm text-muted-foreground">
                        {collection.products.edges.length} products
                      </span>
                    </div>
                    
                    <div className="aspect-square bg-gradient-to-br from-cosmic/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {collection.image ? (
                        <img
                          src={collection.image.url}
                          alt={collection.image.altText || collection.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Star className="w-12 h-12 text-cosmic/60" />
                      )}
                    </div>
                    
                    <CardTitle className="font-cosmic text-xl font-bold text-cosmic-gradient mb-2">
                      {collection.title}
                    </CardTitle>
                    
                    <CardDescription className="font-mystical text-muted-foreground mb-6">
                      {collection.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Button 
                      variant="mystical" 
                      className="w-full"
                      onClick={() => setSelectedCollection(collection.handle)}
                    >
                      Explore Collection
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

          {/* Products Grid */}
          {products.length > 0 && (
            <div>
              <h2 className="font-cosmic text-3xl font-bold text-center mb-12">
                <span className="text-mystical-gradient">Alle Producten</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <Card key={product.id} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      {product.images.edges.length > 0 ? (
                        <img
                          src={product.images.edges[0].node.url}
                          alt={product.images.edges[0].node.altText || product.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cosmic/20 to-secondary/20 flex items-center justify-center">
                          <Star className="w-12 h-12 text-cosmic/60" />
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="cosmic" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <CardTitle className="font-cosmic text-lg font-bold text-cosmic-gradient line-clamp-2">
                        {product.title}
                      </CardTitle>
                      
                      <div className="text-lg font-bold text-mystical-gradient">
                        {formatPrice(
                          product.priceRange.minVariantPrice.amount,
                          product.priceRange.minVariantPrice.currencyCode
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex gap-2">
                        {product.variants.edges.length > 0 && product.variants.edges[0].node.availableForSale && (
                          <Button 
                            variant="mystical" 
                            className="flex-1"
                            onClick={() => handleAddToCart(product.variants.edges[0].node.id)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(`https://rfih5t-ij.myshopify.com/products/${product.handle}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {collections.length === 0 && products.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
                Geen producten gevonden
              </h3>
              <p className="font-mystical text-muted-foreground max-w-md mx-auto">
                De kosmische merchandise is nog onderweg. Keer binnenkort terug voor nieuwe items.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;