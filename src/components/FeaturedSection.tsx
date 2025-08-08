import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Book } from 'lucide-react';
import { fetchCollections } from '@/integrations/shopify/client';
import { useLanguage } from '@/hooks/useLanguage';
import { getLocalizedProductContent } from '@/utils/contentLocalization';

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
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
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
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [digitalProducts, setDigitalProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    const loadDigitalProducts = async () => {
      try {
        console.log('=== FETCHING COLLECTIONS ===');
        const collections: ShopifyCollection[] = await fetchCollections(language);
        console.log('Total collections found:', collections.length);
        console.log('All collections:', collections.map(c => ({
          title: c.title,
          handle: c.handle,
          productCount: c.products?.edges?.length || 0
        })));

        // Try multiple possible handles for Digital Products
        const digitalCollection = collections.find(
          collection =>
            collection.handle === 'digital-products' ||
            collection.handle === 'digitale' ||
            collection.title === 'Digital Products' ||
            collection.title.toLowerCase().includes('digital')
        );

        console.log('Digital collection found:', digitalCollection);

        if (digitalCollection?.products?.edges) {
          const products = digitalCollection.products.edges.map(edge => edge.node);
          console.log('Products in digital collection:', products);
          setDigitalProducts(products.slice(0, 4)); // Toon maximaal 4 producten
        } else {
          console.log('No digital collection found or no products in collection');
          // For debugging, let's try to get products from any collection
          const anyCollectionWithProducts = collections.find(c => c.products?.edges?.length > 0);
          if (anyCollectionWithProducts) {
            console.log('Using products from:', anyCollectionWithProducts.title);
            const products = anyCollectionWithProducts.products.edges.map(edge => edge.node);
            setDigitalProducts(products.slice(0, 4));
          }
        }
      } catch (error) {
        console.error('Error loading digital products:', error);
        console.error('Full error details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDigitalProducts();
  }, [language]);

  // Helper function to get language-specific variant
  const getLanguageVariant = (product: ShopifyProduct, language: string) => {
    const languageMap = {
      'nl': ['NLD', 'Nederlands', 'Dutch'],
      'en': ['ENG', 'Engels', 'English'], 
      'de': ['DEU', 'Deutsch', 'German']
    };
    
    const languageKeys = languageMap[language as keyof typeof languageMap] || languageMap['en'];
    
    // Find variant that matches the current language
    const matchingVariant = product.variants?.edges?.find(edge => 
      languageKeys.some(key => 
        edge.node.title.toUpperCase().includes(key.toUpperCase())
      )
    );
    
    return matchingVariant?.node || product.variants?.edges?.[0]?.node;
  };

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
            <span className="text-mystical-gradient">{t('featured.title.sacred')}</span>{' '}
            <span className="text-cosmic-gradient">{t('featured.title.geometry')}</span>
          </h2>
          
          <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('featured.subtitle')}
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
              const languageVariant = getLanguageVariant(product, language);
              const productPrice = languageVariant?.price;
              
              // Get localized content
              const localizedContent = getLocalizedProductContent(
                product.handle, 
                language, 
                { title: product.title, description: product.description }
              );
              
              return (
                <Card key={product.id} className="cosmic-hover group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm h-full flex flex-col">
                  <CardHeader className="relative p-0">
                    <div className="aspect-square bg-gradient-to-br from-cosmic/20 to-secondary/20 rounded-t-lg overflow-hidden relative">
                       <img
                         src={productImage}
                         alt={localizedContent.title}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                       />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-energy-gradient text-white shadow-lg">
                          {t('products.digital')}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3 w-8 h-8 bg-cosmic/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Download className="w-4 h-4 text-cosmic" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 p-6">
                     <CardTitle className="font-mystical text-lg mb-3 group-hover:text-cosmic transition-colors line-clamp-2">
                       {localizedContent.title}
                     </CardTitle>
                     <CardDescription className="font-mystical text-sm text-muted-foreground mb-4 line-clamp-3">
                       {localizedContent.description}
                     </CardDescription>
                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-cosmic text-2xl font-bold text-cosmic-gradient">
                          {productPrice ? formatPrice(productPrice.amount, productPrice.currencyCode) : t('products.priceOnRequest')}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Download className="w-3 h-3" />
                          <span>{t('products.instantDownload')}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
                    <Button
                      variant="cosmic"
                      size="lg"
                      className="w-full group shadow-cosmic"
                      asChild
                    >
                      <Link to={`/product/${product.handle}`}>
                        <Book className="w-4 h-4 mr-2" />
                        {t('product.view')}
                        <Star className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedSection;
