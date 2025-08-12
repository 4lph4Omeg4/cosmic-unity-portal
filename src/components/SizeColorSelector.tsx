import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface VariantOption {
  name: string;
  value: string;
}

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: VariantOption[];
  price: {
    amount: string;
    currencyCode: string;
  };
}

interface SizeColorSelectorProps {
  variants: Variant[];
  selectedVariant: Variant | null;
  onVariantChange: (variant: Variant) => void;
  formatPrice: (amount: string, currencyCode: string) => string;
}

const SizeColorSelector: React.FC<SizeColorSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  formatPrice
}) => {
  // Extract unique sizes and colors from variants
  const sizes = Array.from(new Set(
    variants.flatMap(variant => 
      variant.selectedOptions
        .filter(option => 
          option.name.toLowerCase().includes('size') || 
          option.name.toLowerCase().includes('maat')
        )
        .map(option => option.value)
    )
  ));

  const colors = Array.from(new Set(
    variants.flatMap(variant => 
      variant.selectedOptions
        .filter(option => 
          option.name.toLowerCase().includes('color') || 
          option.name.toLowerCase().includes('colour') ||
          option.name.toLowerCase().includes('kleur')
        )
        .map(option => option.value)
    )
  ));

  // Get current size and color from selected variant
  const currentSize = selectedVariant?.selectedOptions?.find(option =>
    option.name.toLowerCase().includes('size') || 
    option.name.toLowerCase().includes('maat')
  )?.value || '';

  const currentColor = selectedVariant?.selectedOptions?.find(option =>
    option.name.toLowerCase().includes('color') || 
    option.name.toLowerCase().includes('colour') ||
    option.name.toLowerCase().includes('kleur')
  )?.value || '';

  // Find variant based on size and color combination
  const findVariant = (size: string, color: string) => {
    return variants.find(variant => {
      const variantSize = variant.selectedOptions.find(option =>
        option.name.toLowerCase().includes('size') || 
        option.name.toLowerCase().includes('maat')
      )?.value;
      
      const variantColor = variant.selectedOptions.find(option =>
        option.name.toLowerCase().includes('color') || 
        option.name.toLowerCase().includes('colour') ||
        option.name.toLowerCase().includes('kleur')
      )?.value;

      return variantSize === size && variantColor === color;
    });
  };

  const handleSizeChange = (size: string) => {
    const variant = findVariant(size, currentColor);
    if (variant) {
      onVariantChange(variant);
    }
  };

  const handleColorChange = (color: string) => {
    const variant = findVariant(currentSize, color);
    if (variant) {
      onVariantChange(variant);
    }
  };

  // Check if a size is available for the current color
  const isSizeAvailable = (size: string) => {
    const variant = findVariant(size, currentColor);
    return variant?.availableForSale || false;
  };

  // Check if a color is available for the current size
  const isColorAvailable = (color: string) => {
    const variant = findVariant(currentSize, color);
    return variant?.availableForSale || false;
  };

  if (sizes.length === 0 && colors.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="space-y-3">
              <Label className="font-cosmic text-base font-semibold">
                Kleur
              </Label>
              <Select
                value={currentColor}
                onValueChange={handleColorChange}
              >
                <SelectTrigger className="cosmic-hover border-cosmic/30 bg-card/50 backdrop-blur-sm hover:border-cosmic/60 focus:border-cosmic focus:ring-cosmic/20">
                  <SelectValue placeholder="Kies een kleur..." />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-cosmic/30">
                  {colors.map((color) => (
                    <SelectItem
                      key={color}
                      value={color}
                      disabled={!isColorAvailable(color)}
                      className="cosmic-hover focus:bg-cosmic/10 focus:text-cosmic"
                    >
                      <span className="font-mystical">
                        {color}
                        {!isColorAvailable(color) && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Uitverkocht)
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="space-y-3">
              <Label className="font-cosmic text-base font-semibold">
                Maat
              </Label>
              <Select
                value={currentSize}
                onValueChange={handleSizeChange}
              >
                <SelectTrigger className="cosmic-hover border-cosmic/30 bg-card/50 backdrop-blur-sm hover:border-cosmic/60 focus:border-cosmic focus:ring-cosmic/20">
                  <SelectValue placeholder="Kies een maat..." />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-cosmic/30">
                  {sizes.map((size) => (
                    <SelectItem
                      key={size}
                      value={size}
                      disabled={!isSizeAvailable(size)}
                      className="cosmic-hover focus:bg-cosmic/10 focus:text-cosmic"
                    >
                      <span className="font-mystical">
                        {size}
                        {!isSizeAvailable(size) && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Uitverkocht)
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selected Variant Info */}
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
  );
};

export default SizeColorSelector;