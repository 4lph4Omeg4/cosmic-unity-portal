import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { fetchShopPolicies } from '@/integrations/shopify/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ShippingPolicy = () => {
  const { language } = useLanguage();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicy = async () => {
      setLoading(true);
      try {
        const policies = await fetchShopPolicies(language);
        setPolicy(policies.shippingPolicy);
      } catch (error) {
        console.error('Error loading shipping policy:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-cosmic">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-cosmic-pulse text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {policy ? (
            <article className="prose prose-lg max-w-none">
              <h1 className="text-3xl font-bold text-white mb-8">
                {policy.title}
              </h1>
              <div 
                className="text-white leading-relaxed space-y-6 [&_*]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h6]:text-white [&_p]:text-white [&_li]:text-white [&_span]:text-white [&_div]:text-white [&_strong]:text-white [&_em]:text-white [&_a]:text-white"
                dangerouslySetInnerHTML={{ __html: policy.body }}
              />
            </article>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">
                Shipping Policy Not Found
              </h1>
              <p className="text-white">
                Shipping policy is not available at this time.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;