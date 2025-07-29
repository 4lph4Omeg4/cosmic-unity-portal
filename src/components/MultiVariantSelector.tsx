import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface VariantOption {
  name: string;
  value: string;
}

export interface MultiVariant {
  id: string;
  title: string;
  price: number;
  available: boolean;
  selectedOptions: VariantOption[];
  image?: string;
}

interface VariantSelection {
  [optionName: string]: string;
}

interface MultiVariantSelectorProps {
  variants: MultiVariant[];
  selectedVariant: MultiVariant | null;
  onVariantChange: (variant: MultiVariant) => void;
  className?: string;
}

const MultiVariantSelector: React.FC<MultiVariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  className = ""
}) => {
  // Extract all unique option names and their possible values
  const optionNames = Array.from(
    new Set(
      variants.flatMap(variant => 
        variant.selectedOptions.map(option => option.name)
      )
    )
  );

  const getOptionValues = (optionName: string) => {
    return Array.from(
      new Set(
        variants
          .filter(variant => variant.available)
          .flatMap(variant => 
            variant.selectedOptions
              .filter(option => option.name === optionName)
              .map(option => option.value)
          )
      )
    );
  };

  // Get current selections
  const currentSelections: VariantSelection = selectedVariant?.selectedOptions.reduce(
    (acc, option) => ({ ...acc, [option.name]: option.value }),
    {} as VariantSelection
  ) || {};

  const handleOptionChange = (optionName: string, value: string) => {
    const newSelections = { ...currentSelections, [optionName]: value };
    
    // Find variant that matches all current selections
    const matchingVariant = variants.find(variant => {
      return optionNames.every(name => {
        const variantOption = variant.selectedOptions.find(opt => opt.name === name);
        const selectedValue = newSelections[name];
        return variantOption?.value === selectedValue;
      });
    });

    if (matchingVariant) {
      onVariantChange(matchingVariant);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(price / 100);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {optionNames.map((optionName) => {
        const values = getOptionValues(optionName);
        const currentValue = currentSelections[optionName] || '';
        
        return (
          <div key={optionName} className="space-y-2">
            <Label className="font-mystical text-sm font-medium text-foreground capitalize">
              {optionName.toLowerCase()}
            </Label>
            <Select 
              value={currentValue}
              onValueChange={(value) => handleOptionChange(optionName, value)}
            >
              <SelectTrigger className="cosmic-hover border-cosmic/30 bg-card/50 backdrop-blur-sm hover:border-cosmic/60 focus:border-cosmic focus:ring-cosmic/20">
                <SelectValue placeholder={`Kies ${optionName.toLowerCase()}...`} />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-sm border-cosmic/30">
                {values.map((value) => {
                  // Check if this option value combination would result in an available variant
                  const testSelections = { ...currentSelections, [optionName]: value };
                  const wouldBeAvailable = variants.some(variant => {
                    const matches = optionNames.every(name => {
                      const variantOption = variant.selectedOptions.find(opt => opt.name === name);
                      const testValue = testSelections[name];
                      return !testValue || variantOption?.value === testValue;
                    });
                    return matches && variant.available;
                  });

                  return (
                    <SelectItem 
                      key={value} 
                      value={value}
                      disabled={!wouldBeAvailable}
                      className="cosmic-hover focus:bg-cosmic/10 focus:text-cosmic"
                    >
                      <span className="font-mystical capitalize">
                        {value}
                      </span>
                      {!wouldBeAvailable && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (Uitverkocht)
                        </span>
                      )}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        );
      })}
      
      {selectedVariant && (
        <div className="mt-6 p-4 rounded-lg bg-cosmic/5 border border-cosmic/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mystical text-sm text-muted-foreground">
                Geselecteerd:
              </span>
              <p className="font-cosmic font-semibold text-cosmic">
                {selectedVariant.selectedOptions.map(opt => opt.value).join(' • ')}
              </p>
            </div>
            <div className="text-right">
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

export default MultiVariantSelector;