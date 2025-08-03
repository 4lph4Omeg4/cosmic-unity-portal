import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedSection from '@/components/FeaturedSection';
import LatestPosts from '@/components/LatestPosts';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturedSection />
      <LatestPosts />
      <Footer />
    </div>
  );
};

export default Index;
