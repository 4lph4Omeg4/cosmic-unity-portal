import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ArrowLeft, ShoppingCart, Eye } from 'lucide-react';
import { fetchCollectionByHandle } from '@/integrations/shopify/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';

interface ShopifyProduct {
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
      node: ShopifyProduct;
    }>;
  };
}

const Collection = () => {
  const navigate = useNavigate();
  const { collection: collectionHandle } = useParams<{ collection: string }>();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  
  const [collection, setCollection] = useState<ShopifyCollection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCollection = async () => {
      if (!collectionHandle) return;
      
      try {
        console.log(`Fetching collection for handle: ${collectionHandle}`);
        
        const collectionData = await fetchCollectionByHandle(collectionHandle, language);

        if (collectionData) {
          setCollection(collectionData);
        } else {
          toast({
            title: "Collectie niet gevonden",
            description: "De gevraagde collectie bestaat niet.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading collection:', error);
        toast({
          title: "Fout bij laden",
          description: "Collectie kon niet worden geladen.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [collectionHandle, language]);

  const handleQuickAdd = (product: ShopifyProduct) => {
    if (!product.variants?.edges.length) return;
    
    const firstVariant = product.variants.edges[0].node;
    if (!firstVariant.availableForSale) return;

    try {
      addItem({
        variantId: firstVariant.id,
        productId: product.id,
        title: product.title,
        variantTitle: firstVariant.title,
        price: parseFloat(firstVariant.price.amount) * 100, // Convert to cents
        quantity: 1,
        image: product.images.edges[0]?.node.url
      });

      toast({
        title: "Toegevoegd aan winkelwagen",
        description: `${product.title} - ${firstVariant.title}`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Fout bij toevoegen",
        description: "Product kon niet worden toegevoegd aan de winkelwagen.",
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
              <div className="animate-cosmic-pulse">Collectie laden...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-cosmic text-3xl font-bold text-cosmic-gradient mb-6">
                Collectie niet gevonden
              </h1>
              <Button onClick={() => navigate('/shop')} variant="mystical">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar winkel
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/shop')}
            className="mb-8 cosmic-hover"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar winkel
          </Button>

          {/* Collection Header */}
          <div className="text-center mb-16">
            {collection.image && (
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden shadow-cosmic">
                <img
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-cosmic-gradient">{collection.title}</span>
            </h1>
            
            {collection.description && (
              <div 
                className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto"
                dangerouslySetInnerHTML={{ __html: collection.description }}
              />
            )}
          </div>

          {/* Products Grid */}
          {collection.products.edges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {collection.products.edges.map(({ node: product }) => (
                <Card key={product.id} className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50 shadow-cosmic animate-fade-in">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    {product.images.edges.length > 0 ? (
                      <img
                        src={product.images.edges[0].node.url}
                        alt={product.images.edges[0].node.altText || product.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
                        Bekijk
                      </Button>
                      {product.variants?.edges.length && product.variants.edges[0].node.availableForSale && (
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuickAdd(product)}
                          className="cosmic-hover"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-cosmic animate-cosmic-pulse">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
                Geen producten beschikbaar
              </h3>
              <p className="font-mystical text-muted-foreground max-w-md mx-auto mb-6">
                Deze collectie bevat momenteel geen producten. Keer binnenkort terug voor nieuwe items.
              </p>
              <Button onClick={() => navigate('/shop')} variant="mystical">
                Bekijk andere collecties
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Collection;