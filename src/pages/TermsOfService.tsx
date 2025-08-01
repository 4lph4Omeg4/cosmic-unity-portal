import { useEffect, useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { fetchShopPolicies } from '@/integrations/shopify/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  const { language } = useLanguage();
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPolicy = async () => {
      setLoading(true);
      try {
        const policies = await fetchShopPolicies(language);
        setPolicy(policies.termsOfService);
      } catch (error) {
        console.error('Error loading terms of service:', error);
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
              <h1 className="text-3xl font-bold text-foreground mb-8">
                {policy.title}
              </h1>
              <div 
                className="text-foreground leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: policy.body }}
              />
            </article>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">
                Terms of Service Not Found
              </h1>
              <p className="text-muted-foreground">
                Terms of service are not available at this time.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;