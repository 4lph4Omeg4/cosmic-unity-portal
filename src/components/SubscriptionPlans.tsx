import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckoutButton } from './CheckoutButton';

interface Plan {
  id: string;
  name: string;
  price: string;
  priceId: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface SubscriptionPlansProps {
  orgId: string;
  plans?: Plan[];
}

const defaultPlans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '€9.99',
    priceId: 'price_basic_monthly', // Replace with your actual Stripe Price ID
    description: 'Perfect for getting started',
    features: [
      'Basic timeline features',
      'Community access',
      'Email support'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: '€19.99',
    priceId: 'price_pro_monthly', // Replace with your actual Stripe Price ID
    description: 'Best for professionals',
    features: [
      'All Basic features',
      'Advanced timeline tools',
      'Priority support',
      'Custom integrations'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '€49.99',
    priceId: 'price_enterprise_monthly', // Replace with your actual Stripe Price ID
    description: 'For large organizations',
    features: [
      'All Professional features',
      'Team management',
      'Advanced analytics',
      'Dedicated support',
      'Custom branding'
    ]
  }
];

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  orgId,
  plans = defaultPlans
}) => {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-gray-600">
          Start your journey with Timeline Alchemy today
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <CheckoutButton
                orgId={orgId}
                priceId={plan.priceId}
                className="w-full"
              >
                Get Started
              </CheckoutButton>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
