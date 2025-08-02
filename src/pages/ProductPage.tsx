import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, Check, Star, Heart } from 'lucide-react';
import StorageImage from '@/components/StorageImage';
import ProductVariantSelector, { ProductVariant } from '@/components/ProductVariantSelector';
import MultiVariantSelector, { MultiVariant } from '@/components/MultiVariantSelector';
import { useCart } from '@/hooks/useCart';
import { fetchProductByHandle } from '@/integrations/shopify/client';
import { useLanguage } from '@/hooks/useLanguage';

interface ShopifyVariant {
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
}

interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor: string;
  productType: string;
  tags: string[];
  variants: {
    edges: Array<{
      node: ShopifyVariant;
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

interface Product {
  id: string;
  title: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  variants: (ProductVariant & { selectedOptions?: Array<{ name: string; value: string; }> })[];
  images: string[];
  rating?: number;
  reviewCount?: number;
}

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { addItem, getTotalItems } = useCart();
  const { language } = useLanguage();

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const shopifyProduct = await fetchProductByHandle(productId, language);
        
        if (shopifyProduct) {
          // Convert Shopify product to our format
          const convertedProduct: Product = {
            id: shopifyProduct.id,
            title: shopifyProduct.title,
            description: shopifyProduct.description,
            vendor: shopifyProduct.vendor,
            productType: shopifyProduct.productType,
            tags: shopifyProduct.tags,
            variants: shopifyProduct.variants.edges.map(edge => ({
              id: edge.node.id,
              title: edge.node.title,
              price: parseFloat(edge.node.price.amount) * 100, // Convert to cents
              available: edge.node.availableForSale,
              selectedOptions: edge.node.selectedOptions // Include the actual selectedOptions
            })),
            images: shopifyProduct.images.edges.map(edge => edge.node.url)
          };
          
          setProduct(convertedProduct);
          
          // Set first available variant as default
          if (convertedProduct.variants.length > 0) {
            const firstAvailable = convertedProduct.variants.find(v => v.available);
            setSelectedVariant(firstAvailable || convertedProduct.variants[0]);
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, language]);

  const isClothingProduct = (productType: string, tags: string[]) => {
    const clothingTypes = ['clothing', 'apparel', 'shirt', 'hoodie', 'jacket', 'pants', 'dress'];
    const clothingTags = ['clothing', 'apparel', 'shirt', 'hoodie', 'jacket', 'pants', 'dress', 'wear'];
    
    return clothingTypes.some(type => 
      productType.toLowerCase().includes(type.toLowerCase())
    ) || clothingTags.some(tag => 
      tags.some(productTag => productTag.toLowerCase().includes(tag.toLowerCase()))
    );
  };

  const getMultiVariants = (shopifyProduct: ShopifyProduct): MultiVariant[] => {
    return shopifyProduct.variants.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount) * 100,
      available: edge.node.availableForSale,
      selectedOptions: edge.node.selectedOptions
    }));
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: quantity
    });

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100);
  };

  const shopifyDomain = "cosmic-industries.myshopify.com"; // Replace with actual domain

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-cosmic-pulse">Loading product...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Link to="/shop" className="text-cosmic hover:underline">
              Return to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="cosmic-hover">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="cosmic" className="text-sm">
                {getTotalItems()} items in winkelwagen
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-cosmic/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square">
                  {selectedVariant ? (
                    <StorageImage
                      bucket="mockups"
                      path={`mockups/${selectedVariant.id}/1.png`}
                      alt={`${product.title} - ${selectedVariant.title} - Beeld 1`}
                      className="w-full h-full rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-cosmic-gradient animate-pulse rounded-lg"></div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-cosmic/30 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square">
                  {selectedVariant ? (
                    <StorageImage
                      bucket="mockups"
                      path={`mockups/${selectedVariant.id}/2.png`}
                      alt={`${product.title} - ${selectedVariant.title} - Beeld 2`}
                      className="w-full h-full rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-cosmic-gradient animate-pulse rounded-lg"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-cosmic border-cosmic/30">
                  {product.vendor}
                </Badge>
                <Badge variant="outline" className="text-mystical border-mystical/30">
                  {product.productType}
                </Badge>
              </div>
              
              <h1 className="font-cosmic text-4xl md:text-5xl font-bold mb-4">
                <span className="text-cosmic-gradient">{product.title}</span>
              </h1>
              
              {product.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating!) 
                            ? 'text-cosmic fill-cosmic' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              <div className="text-3xl font-bold mb-6">
                {selectedVariant && (
                  <span className="text-cosmic-gradient">
                    {formatPrice(selectedVariant.price)}
                  </span>
                )}
              </div>
            </div>

            <Separator className="bg-cosmic/20" />

            {/* Variant Selector */}
            {isClothingProduct(product.productType, product.tags) ? (
              <div>
                <h3 className="font-cosmic text-lg font-bold mb-4 text-cosmic-gradient">
                  Selecteer opties
                </h3>
                <MultiVariantSelector
                  variants={product.variants.map(variant => ({
                    id: variant.id,
                    title: variant.title,
                    price: variant.price,
                    available: variant.available,
                    selectedOptions: variant.selectedOptions || []
                  }))}
                  selectedVariant={selectedVariant ? {
                    id: selectedVariant.id,
                    title: selectedVariant.title,
                    price: selectedVariant.price,
                    available: selectedVariant.available,
                    selectedOptions: (selectedVariant as any).selectedOptions || []
                  } : null}
                  onVariantChange={(multiVariant) => {
                    const matchingVariant = product.variants.find(v => v.id === multiVariant.id);
                    if (matchingVariant) {
                      setSelectedVariant(matchingVariant);
                    }
                  }}
                />
              </div>
            ) : (
              <ProductVariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
                label="Kies je variant"
              />
            )}

            <Separator className="bg-cosmic/20" />

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.available}
                  size="lg"
                  className="flex-1 cosmic-hover bg-cosmic-gradient hover:shadow-cosmic text-white font-mystical"
                >
                  {isAddedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Toegevoegd!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Toevoegen aan winkelwagen
                    </>
                  )}
                </Button>
                
                <Button variant="outline" size="lg" className="cosmic-hover">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              <Button 
                variant="outline" 
                size="lg" 
                className="w-full cosmic-hover border-cosmic/30 text-cosmic hover:bg-cosmic/10"
                onClick={() => {
                  const { getCheckoutUrl } = useCart();
                  window.open(getCheckoutUrl(shopifyDomain), '_blank');
                }}
              >
                Direct naar checkout
              </Button>
            </div>

            <Separator className="bg-cosmic/20" />

            {/* Product Description */}
            <div>
              <h3 className="font-cosmic text-xl font-bold mb-4 text-cosmic-gradient">
                Productbeschrijving
              </h3>
              <div className="font-mystical text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
