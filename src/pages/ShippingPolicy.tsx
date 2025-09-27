import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Shipping Policy
            </h1>
            <p className="text-white">
              Shipping policy is currently being updated and will be available soon.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;