import React from 'react';
import { TlaSubscribeButton } from './TlaSubscribeButton';
import { CheckoutButton } from './CheckoutButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface SubscriptionExamplesProps {
  orgId: string;
}

export const SubscriptionExamples: React.FC<SubscriptionExamplesProps> = ({ orgId }) => {
  return (
    <div className="py-8 space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Abonnement Knoppen Voorbeelden
        </h2>
        <p className="text-gray-600">
          Verschillende manieren om abonnementen te starten
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
        {/* TlaSubscribeButton Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">TlaSubscribeButton</CardTitle>
            <CardDescription>
              Eenvoudige knop met directe API call naar /api/billing/checkout
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <code className="text-sm text-gray-700">
                {`<TlaSubscribeButton 
  orgId="${orgId}" 
  priceId="price_basic_monthly" 
/>`}
              </code>
            </div>
            <div className="flex justify-center">
              <TlaSubscribeButton 
                orgId={orgId} 
                priceId="price_basic_monthly" 
              />
            </div>
          </CardContent>
        </Card>

        {/* CheckoutButton Example */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">CheckoutButton</CardTitle>
            <CardDescription>
              Geavanceerde knop met StripeService en error handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <code className="text-sm text-gray-700">
                {`<CheckoutButton 
  orgId="${orgId}" 
  priceId="price_pro_monthly"
>
  Pro Abonnement
</CheckoutButton>`}
              </code>
            </div>
            <div className="flex justify-center">
              <CheckoutButton 
                orgId={orgId} 
                priceId="price_pro_monthly"
              >
                Pro Abonnement
              </CheckoutButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Gebruik Instructies</CardTitle>
          <CardDescription>
            Hoe je deze knoppen in je eigen componenten gebruikt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Import de componenten:</h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <code className="text-sm">
                {`import { TlaSubscribeButton } from './components/TlaSubscribeButton';
import { CheckoutButton } from './components/CheckoutButton';`}
              </code>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">2. Gebruik ze in je JSX:</h4>
            <div className="p-3 bg-gray-50 rounded-lg">
              <code className="text-sm">
                {`// Voor eenvoudige implementatie
<TlaSubscribeButton 
  orgId="your_org_id" 
  priceId="price_12345" 
/>

// Voor geavanceerde implementatie met styling
<CheckoutButton 
  orgId="your_org_id" 
  priceId="price_12345"
  className="w-full bg-green-600"
>
  Start Premium Abonnement
</CheckoutButton>`}
              </code>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Belangrijke opmerkingen:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li>Vervang <code className="bg-gray-200 px-1 rounded">price_12345</code> met je echte Stripe Price ID</li>
              <li>De <code className="bg-gray-200 px-1 rounded">orgId</code> moet een geldige organisatie ID zijn</li>
              <li>Beide knoppen maken automatisch verbinding met je Stripe checkout</li>
              <li>Na succesvolle betaling wordt de gebruiker doorgestuurd naar de success URL</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
