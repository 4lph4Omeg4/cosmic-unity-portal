import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BooksSection from '@/components/BooksSection';

import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <BooksSection />

      <Footer />
    </div>
  );
};

export default Index;
