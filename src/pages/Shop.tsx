import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Filter, Grid, List, ShoppingCart, ExternalLink, Eye } from 'lucide-react';
import { fetchCollections, fetchProducts, createCheckout } from '@/integrations/shopify/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

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
        productType?: string;
        tags?: string[];
        priceRange: {
          minVariantPrice: {
            amount: string;
            currencyCode: string;
          };
        };
        variants?: {
          edges: Array<{
            node: {
              id: string;
              title: string;
              price: {
                amount: string;
                currencyCode: string;
              };
              availableForSale: boolean;
              selectedOptions: Array<{
                name: string;
                value: string;
              }>;
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
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
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
  const navigate = useNavigate();
  const { collection: urlCollection } = useParams();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCollections, fetchedProducts] = await Promise.all([
          fetchCollections(language),
          fetchProducts(language)
        ]);
        setCollections(fetchedCollections);
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        
        // Als er een URL collectie is, filter direct
        if (urlCollection) {
          const matchingCollection = fetchedCollections.find(c => c.handle === urlCollection);
          if (matchingCollection) {
            setSelectedCollection(urlCollection);
            handleCollectionFilter(urlCollection, fetchedCollections);
          }
        }
      } catch (error) {
        console.error('Error loading shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [urlCollection, language]); // Herlaad bij taal wijziging

  const handleCollectionFilter = (collectionHandle: string | null, collectionsData?: ShopifyCollection[]) => {
    const collectionsToUse = collectionsData || collections;
    setSelectedCollection(collectionHandle);
    
    if (!collectionHandle) {
      setFilteredProducts(products);
    } else {
      const collection = collectionsToUse.find(c => c.handle === collectionHandle);
      if (collection && collection.products.edges.length > 0) {
        // Gebruik de producten die direct in de collectie zitten met alle data
        const collectionProducts = collection.products.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          description: '', // Shopify collections bevatten beperkte productinfo
          handle: edge.node.handle,
          vendor: '',
          productType: edge.node.productType || '',
          tags: edge.node.tags || [],
          priceRange: edge.node.priceRange,
          variants: edge.node.variants || {
            edges: [{
              node: {
                id: edge.node.id + '_variant',
                title: 'Default',
                price: edge.node.priceRange.minVariantPrice,
                availableForSale: true,
                selectedOptions: []
              }
            }]
          },
          images: edge.node.images
        }));
        setFilteredProducts(collectionProducts);
      } else {
        setFilteredProducts([]);
      }
    }
  };

  const handleAddToCart = async (variantId: string) => {
    try {
      console.log('Adding to cart with variant ID:', variantId);
      
      // Controleer of variantId geldig is
      if (!variantId || variantId.includes('_variant')) {
        console.error('Invalid variant ID:', variantId);
        toast({
          title: t('shop.errorAdding'),
          description: t('shop.errorAddingProduct'),
          variant: "destructive",
        });
        return;
      }
      
      const checkout = await createCheckout([{ variantId, quantity: 1 }]);
      console.log('Checkout result:', checkout);
      
      if (checkout?.webUrl) {
        window.open(checkout.webUrl, '_blank');
        toast({
          title: t('shop.addedToCart'),
          description: t('shop.redirecting'),
        });
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: t('shop.errorAdding'),
        description: t('shop.errorMessage'),
        variant: "destructive",
      });
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
              <div className="animate-cosmic-pulse">{t('shop.loading')}</div>
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
              <span className="text-cosmic-gradient">{t('shop.title.sacred')}</span>{' '}
              <span className="text-mystical-gradient">{t('shop.title.shop')}</span>
            </h1>
            
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('shop.subtitle')}
            </p>
          </div>


          {/* Filter Bar */}
          {collections.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCollection === null ? "mystical" : "outline"}
                  onClick={() => handleCollectionFilter(null)}
                >
                  {t('shop.filter.all')}
                </Button>
                {collections.map((collection) => (
                  <Button
                    key={collection.id}
                    variant={selectedCollection === collection.handle ? "mystical" : "outline"}
                    onClick={() => navigate(`/shop/collection/${collection.handle}`)}
                  >
                    {collection.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 && (
            <div>
              <h2 className="font-cosmic text-3xl font-bold text-center mb-12">
                <span className="text-mystical-gradient">
                  {selectedCollection 
                    ? collections.find(c => c.handle === selectedCollection)?.title || t('shop.products')
                    : t('shop.allProducts')
                  }
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
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
                        <Button 
                          variant="mystical" 
                          className="flex-1"
                          onClick={() => navigate(`/product/${product.handle}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {t('shop.viewProduct')}
                        </Button>
                        {product.variants.edges.length > 0 && product.variants.edges[0].node.availableForSale && (
                          <Button 
                            variant="outline"
                            size="icon"
                            onClick={() => handleAddToCart(product.variants.edges[0].node.id)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {collections.length === 0 && filteredProducts.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
                {t('shop.noProducts')}
              </h3>
              <p className="font-mystical text-muted-foreground max-w-md mx-auto">
                {t('shop.noProductsDescription')}
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
