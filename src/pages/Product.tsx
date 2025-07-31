import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Star, ShoppingCart, ArrowLeft, ExternalLink } from 'lucide-react';
import { fetchProductByHandle, createCheckout } from '@/integrations/shopify/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

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
    maxVariantPrice: {
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

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Functie om de juiste afbeelding te vinden op basis van variant
  const findImageForVariant = (variant: any) => {
    if (!product?.images?.edges?.length || !variant) return 0;

    // First check if variant has its own image
    if (variant.image?.url) {
      const variantImageIndex = product.images.edges.findIndex(image =>
        image.node.url === variant.image.url
      );
      if (variantImageIndex >= 0) return variantImageIndex;
    }

    // Extract color from variant options
    const colorOption = variant.selectedOptions?.find((option: any) =>
      option.name.toLowerCase().includes('color') ||
      option.name.toLowerCase().includes('colour') ||
      option.name.toLowerCase().includes('kleur')
    );

    if (colorOption) {
      const color = colorOption.value.toLowerCase();
      const imageIndex = product.images.edges.findIndex(image => {
        const altText = image.node.altText?.toLowerCase() || '';
        const url = image.node.url.toLowerCase();

        // Check for color matches in alt text or URL
        return altText.includes(color) || url.includes(color) ||
               altText.includes(variant.title.toLowerCase()) ||
               url.includes(variant.title.toLowerCase());
      });

      if (imageIndex >= 0) return imageIndex;
    }

    // Fallback: search by full variant title
    const variantTitle = variant.title.toLowerCase();
    const imageIndex = product.images.edges.findIndex(image => {
      const altText = image.node.altText?.toLowerCase() || '';
      const url = image.node.url.toLowerCase();

      return altText.includes(variantTitle) || url.includes(variantTitle);
    });

    return imageIndex >= 0 ? imageIndex : 0;
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      try {
        const fetchedProduct = await fetchProductByHandle(handle, language);
        setProduct(fetchedProduct);
        if (fetchedProduct?.variants?.edges?.length > 0) {
          const firstVariant = fetchedProduct.variants.edges[0].node;
          setSelectedVariant(firstVariant);
          // Stel de juiste afbeelding in voor de eerste variant
          const imageIndex = findImageForVariant(firstVariant);
          setSelectedImageIndex(imageIndex);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: "Product niet gevonden",
          description: "Het product kon niet worden geladen.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle, toast, language]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    try {
      const checkout = await createCheckout([{ variantId: selectedVariant.id, quantity: 1 }]);
      if (checkout?.webUrl) {
        window.open(checkout.webUrl, '_blank');
        toast({
          title: "Toegevoegd aan winkelwagen",
          description: "Je wordt doorgestuurd naar de checkout.",
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Fout bij toevoegen",
        description: "Het product kon niet worden toegevoegd aan de winkelwagen.",
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
              <div className="animate-cosmic-pulse">Loading cosmic product...</div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
                Product niet gevonden
              </h1>
              <Button onClick={() => navigate('/shop')} variant="mystical">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar Shop
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
          <Button 
            onClick={() => navigate('/shop')} 
            variant="outline" 
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar Shop
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-cosmic/20 to-secondary/20">
                {product.images.edges.length > 0 ? (
                  <img
                    src={product.images.edges[selectedImageIndex].node.url}
                    alt={product.images.edges[selectedImageIndex].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Star className="w-24 h-24 text-cosmic/60" />
                  </div>
                )}
              </div>
              
              {product.images.edges.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.edges.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-cosmic' 
                          : 'border-border/50 hover:border-cosmic/50'
                      }`}
                    >
                      <img
                        src={image.node.url}
                        alt={image.node.altText || product.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="cosmic">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="font-cosmic text-3xl lg:text-4xl font-bold text-cosmic-gradient mb-4">
                  {product.title}
                </h1>
                
                <div className="text-2xl font-bold text-mystical-gradient mb-6">
                  {selectedVariant && formatPrice(
                    selectedVariant.price.amount,
                    selectedVariant.price.currencyCode
                  )}
                </div>
                
                {product.vendor && (
                  <p className="font-mystical text-muted-foreground mb-4">
                    Van {product.vendor}
                  </p>
                )}
              </div>

              {/* Variants */}
              {product.variants.edges.length > 1 && (
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Label className="font-cosmic text-base font-semibold">
                        Selecteer variant
                      </Label>
                      <Select
                        value={selectedVariant?.id || ""}
                        onValueChange={(variantId) => {
                          const variant = product.variants.edges.find(v => v.node.id === variantId)?.node;
                          if (variant) {
                            setSelectedVariant(variant);
                            // Zoek en stel de juiste afbeelding in voor deze variant
                            const imageIndex = findImageForVariant(variant);
                            setSelectedImageIndex(imageIndex);
                          }
                        }}
                      >
                        <SelectTrigger className="cosmic-hover border-cosmic/30 bg-card/50 backdrop-blur-sm hover:border-cosmic/60 focus:border-cosmic focus:ring-cosmic/20">
                          <SelectValue placeholder="Kies een variant..." />
                        </SelectTrigger>
                        <SelectContent className="bg-card/95 backdrop-blur-sm border-cosmic/30">
                          {product.variants.edges.map((variant) => (
                            <SelectItem
                              key={variant.node.id}
                              value={variant.node.id}
                              disabled={!variant.node.availableForSale}
                              className="cosmic-hover focus:bg-cosmic/10 focus:text-cosmic"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="font-mystical">
                                  {variant.node.title}
                                </span>
                                <span className="ml-4 text-cosmic font-semibold">
                                  {formatPrice(variant.node.price.amount, variant.node.price.currencyCode)}
                                </span>
                                {!variant.node.availableForSale && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    (Uitverkocht)
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedVariant && (
                        <div className="mt-4 p-3 rounded-lg bg-cosmic/5 border border-cosmic/20">
                          <div className="flex items-center justify-between">
                            <span className="font-mystical text-sm text-muted-foreground">
                              Geselecteerd:
                            </span>
                            <div className="text-right">
                              <p className="font-cosmic font-semibold text-cosmic">
                                {selectedVariant.title}
                              </p>
                              <p className="text-lg font-bold text-cosmic-gradient">
                                {formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Add to Cart */}
              <div className="flex gap-3">
                {selectedVariant?.availableForSale ? (
                  <Button 
                    onClick={handleAddToCart}
                    variant="mystical" 
                    size="lg"
                    className="flex-1"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Voeg toe aan winkelwagen
                  </Button>
                ) : (
                  <Button disabled size="lg" className="flex-1">
                    Uitverkocht
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(`https://rfih5t-ij.myshopify.com/products/${product.handle}`, '_blank')}
                >
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </div>

              {/* Description */}
              {product.description && (
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-cosmic text-lg font-semibold mb-3">Beschrijving</h3>
                    <div 
                      className="font-mystical text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Product;
