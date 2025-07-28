import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  available: boolean;
  image?: string;
}

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant) => void;
  label?: string;
  className?: string;
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  label = "Selecteer variant",
  className = ""
}) => {
  const handleValueChange = (value: string) => {
    const variant = variants.find(v => v.id === value);
    if (variant) {
      onVariantChange(variant);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="font-mystical text-sm font-medium text-foreground">
        {label}
      </Label>
      <Select 
        value={selectedVariant?.id || ""} 
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="cosmic-hover border-cosmic/30 bg-card/50 backdrop-blur-sm hover:border-cosmic/60 focus:border-cosmic focus:ring-cosmic/20">
          <SelectValue placeholder="Kies een variant..." />
        </SelectTrigger>
        <SelectContent className="bg-card/95 backdrop-blur-sm border-cosmic/30">
          {variants.map((variant) => (
            <SelectItem 
              key={variant.id} 
              value={variant.id}
              disabled={!variant.available}
              className="cosmic-hover focus:bg-cosmic/10 focus:text-cosmic"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mystical">
                  {variant.title}
                </span>
                <span className="ml-2 text-cosmic font-semibold">
                  {formatPrice(variant.price)}
                </span>
                {!variant.available && (
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
        <div className="mt-3 p-3 rounded-lg bg-cosmic/5 border border-cosmic/20">
          <div className="flex items-center justify-between">
            <span className="font-mystical text-sm text-muted-foreground">
              Geselecteerd:
            </span>
            <div className="text-right">
              <p className="font-cosmic font-semibold text-cosmic">
                {selectedVariant.title}
              </p>
              <p className="text-lg font-bold text-cosmic-gradient">
                {formatPrice(selectedVariant.price)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;
