import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const CartPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    getTotalItems, 
    getCheckoutUrl 
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100);
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      const checkoutUrl = getCheckoutUrl('rfih5t-ij.myshopify.com');
      window.open(checkoutUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/shop')}
            className="mb-8 cosmic-hover"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Verder winkelen
          </Button>

          <h1 className="font-cosmic text-4xl font-bold text-cosmic-gradient mb-8">
            Winkelwagen
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
              <h2 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-4">
                Je winkelwagen is leeg
              </h2>
              <p className="font-mystical text-muted-foreground mb-8">
                Voeg enkele kosmische items toe om te beginnen
              </p>
              <Button onClick={() => navigate('/shop')} variant="mystical">
                Begin met winkelen
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="cosmic-hover bg-card/50 border-cosmic/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {item.image && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-card">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h3 className="font-cosmic text-lg font-semibold text-cosmic-gradient">
                            {item.title}
                          </h3>
                          <p className="font-mystical text-muted-foreground mb-2">
                            {item.variantTitle}
                          </p>
                          <p className="font-bold text-mystical-gradient text-lg">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        <div className="text-right space-y-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-mystical font-semibold min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <p className="font-bold text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-card/80 backdrop-blur-sm border-cosmic/30 sticky top-8">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient">
                      Overzicht bestelling
                    </h3>
                    
                    <Separator className="bg-cosmic/20" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-mystical">Subtotaal:</span>
                        <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mystical">Items:</span>
                        <span className="font-semibold">{getTotalItems()}</span>
                      </div>
                    </div>
                    
                    <Separator className="bg-cosmic/20" />
                    
                    <div className="flex justify-between text-lg">
                      <span className="font-cosmic font-bold">Totaal:</span>
                      <span className="font-cosmic font-bold text-cosmic-gradient">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>
                    
                    <Button 
                      onClick={handleCheckout}
                      className="w-full cosmic-hover bg-cosmic-gradient hover:shadow-cosmic text-white font-mystical"
                      size="lg"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Afrekenen via Shopify
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Beveiligde checkout via Shopify. Verzending en belasting worden bij checkout berekend.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;