import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';

interface CartProps {
  shopifyDomain?: string;
}

const Cart: React.FC<CartProps> = ({
  shopifyDomain = "rfih5t-ij.myshopify.com"
}) => {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
    getCheckoutUrl
  } = useCart();

  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100);
  };

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl(shopifyDomain);
    window.open(checkoutUrl, '_blank');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="cosmic-hover relative">
          <ShoppingCart className="w-4 h-4" />
          {getTotalItems() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 text-xs p-0 flex items-center justify-center"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg bg-card/95 backdrop-blur-sm border-cosmic/30">
        <SheetHeader>
          <SheetTitle className="font-cosmic text-2xl text-cosmic-gradient">
            Winkelwagen
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="font-mystical text-muted-foreground">
                Je winkelwagen is leeg
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <Card key={item.id} className="cosmic-hover bg-card/50 border-cosmic/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-mystical font-semibold text-sm">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.variantTitle}
                          </p>
                          <p className="font-bold text-cosmic">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
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
                        
                        <p className="font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="bg-cosmic/20" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mystical font-semibold">Totaal:</span>
                  <span className="font-cosmic text-xl font-bold text-cosmic-gradient">
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
                  Je wordt doorgestuurd naar een beveiligde Shopify checkout
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
