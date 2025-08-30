import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SizeColorSelector from '@/components/SizeColorSelector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Star, ShoppingCart, ArrowLeft, ExternalLink, Minus, Plus, CheckCircle } from 'lucide-react';
import { fetchProductByHandle } from '@/integrations/shopify/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useCart } from '@/hooks/useCart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const { addItem, getTotalItems } = useCart();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mockupImages, setMockupImages] = useState<string[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('');

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

  // Functie om alle beschikbare afbeeldingen voor een variant te krijgen
  const getVariantImages = (variant: any) => {
    if (!product?.images?.edges?.length) return [];
    
    // Als er maar 1 afbeelding is, gebruik die
    if (product.images.edges.length === 1) {
      return [product.images.edges[0].node.url];
    }

    // Probeer afbeeldingen te vinden die bij de variant passen
    const variantImages = product.images.edges.filter(image => {
      const altText = image.node.altText?.toLowerCase() || '';
      const url = image.node.url.toLowerCase();
      
      // Check voor kleur matches
      if (variant.selectedOptions) {
        const colorOption = variant.selectedOptions.find((option: any) =>
          option.name.toLowerCase().includes('color') ||
          option.name.toLowerCase().includes('colour') ||
          option.name.toLowerCase().includes('kleur')
        );
        
        if (colorOption) {
          const color = colorOption.value.toLowerCase();
          return altText.includes(color) || url.includes(color);
        }
      }
      
      // Check voor variant title matches
      const variantTitle = variant.title.toLowerCase();
      return altText.includes(variantTitle) || url.includes(variantTitle);
    });

    // Als er geen specifieke afbeeldingen zijn gevonden, gebruik alle afbeeldingen
    return variantImages.length > 0 
      ? variantImages.map(img => img.node.url)
      : product.images.edges.map(img => img.node.url);
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

  useEffect(() => {
    // Update mockup images when variant changes
    if (product && selectedVariant) {
      const variantImages = getVariantImages(selectedVariant);
      setMockupImages(variantImages);
      
      // Reset selected image index if it's out of bounds
      if (selectedImageIndex >= variantImages.length) {
        setSelectedImageIndex(0);
      }
    }
  }, [product, selectedVariant, selectedImageIndex]);

  const getVariantColor = (variant: any): string | null => {
    // Look for color in selectedOptions
    const colorOption = variant.selectedOptions?.find((option: any) =>
      option.name.toLowerCase().includes('color') || 
      option.name.toLowerCase().includes('kleur') ||
      option.name.toLowerCase().includes('colour')
    );
    return colorOption?.value || null;
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    try {
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        title: product.title,
        variantTitle: selectedVariant.title,
        price: parseFloat(selectedVariant.price.amount) * 100, // Convert to cents
        quantity: quantity,
        image: product.images.edges[0]?.node.url
      });

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);

      toast({
        title: "Toegevoegd aan winkelwagen",
        description: `${quantity}x ${product.title} - ${selectedVariant.title}`,
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
              <div className="aspect-square overflow-hidden rounded-lg bg-card/80 backdrop-blur-sm border border-border/50">
                {(() => {
                  const displayImages = mockupImages.length > 0 ? mockupImages : 
                    product.images.edges.map(edge => edge.node.url);
                  
                  return displayImages.length > 0 ? (
                    <img
                      src={displayImages[selectedImageIndex] || '/placeholder.svg'}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => {
                        const currentImage = displayImages[selectedImageIndex];
                        if (currentImage) {
                          setSelectedImageUrl(currentImage);
                          setSelectedImageTitle(product.title);
                          setIsImageDialogOpen(true);
                        }
                      }}
                      title="Klik om afbeelding in volledige grootte te bekijken"
                      onError={(e) => {
                        // Fallback to original Shopify images if mockups don't exist
                        if (product.images.edges[selectedImageIndex]) {
                          (e.target as HTMLImageElement).src = product.images.edges[selectedImageIndex].node.url;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Star className="w-24 h-24 text-cosmic/60" />
                    </div>
                  );
                })()}
              </div>
              
              {(() => {
                const displayImages = mockupImages.length > 0 ? mockupImages : 
                  product.images.edges.map(edge => edge.node.url);
                
                return displayImages.length > 1 && (
                  <div className="space-y-3">
                    <h3 className="font-mystical text-sm font-medium text-muted-foreground">
                      Alle beschikbare kleuren en varianten ({displayImages.length})
                    </h3>
                    <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto">
                      {displayImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105 ${
                            selectedImageIndex === index 
                              ? 'border-cosmic shadow-cosmic ring-2 ring-cosmic/20' 
                              : 'border-border/50 hover:border-cosmic/50'
                          }`}
                          title={`Klik om ${index + 1} van ${displayImages.length} afbeeldingen te bekijken`}
                        >
                          <img
                            src={image}
                            alt={`${product.title} - Variant ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              if (product.images.edges[index]) {
                                (e.target as HTMLImageElement).src = product.images.edges[index].node.url;
                              }
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                
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

              {/* Size and Color Selectors */}
              {(() => {
                console.log('Product variants check:', product.variants.edges.length);
                console.log('Full product variants:', product.variants.edges);
                
                if (product.variants.edges.length > 1) {
                  console.log('Rendering SizeColorSelector with variants:', product.variants.edges.map(edge => edge.node));
                  return (
                    <SizeColorSelector
                      variants={product.variants.edges.map(edge => edge.node)}
                      selectedVariant={selectedVariant}
                      onVariantChange={(variant) => {
                        setSelectedVariant(variant);
                        const imageIndex = findImageForVariant(variant);
                        setSelectedImageIndex(imageIndex);
                        
                        // Update mockup images for the new variant
                        const variantImages = getVariantImages(variant);
                        setMockupImages(variantImages);
                      }}
                      formatPrice={formatPrice}
                    />
                  );
                } else {
                  console.log('Only one variant found, not showing SizeColorSelector');
                  return null;
                }
              })()}

              {/* Quantity Selection */}
              <div className="flex items-center space-x-4">
                <Label className="font-mystical text-sm font-medium">Aantal:</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-mystical text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale || addedToCart}
                  className="w-full text-lg py-6 cosmic-hover"
                  variant={addedToCart ? "default" : "mystical"}
                >
                  {addedToCart ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Toegevoegd!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Toevoegen aan winkelwagen
                    </>
                  )}
                </Button>

                {getTotalItems() > 0 && (
                  <div className="text-center">
                    <Button variant="outline" onClick={() => navigate('/cart')}>
                      Bekijk winkelwagen ({getTotalItems()} items)
                    </Button>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => window.open(`https://rfih5t-ij.myshopify.com/products/${product.handle}`, '_blank')}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Bekijk op Shopify
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

        {/* Image Dialog */}
        {selectedImageUrl && (
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogContent className="bg-black/95 border-gray-700 max-w-4xl max-h-[90vh] w-[90vw]">
              <DialogHeader>
                <DialogTitle className="text-white text-center">
                  {selectedImageTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="flex justify-center items-center p-4">
                <img 
                  src={selectedImageUrl} 
                  alt="Full size preview" 
                  className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Product;
