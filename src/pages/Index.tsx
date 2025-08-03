import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedSection from '@/components/FeaturedSection';
import LatestPosts from '@/components/LatestPosts';
import NewsletterSection from '@/components/NewsletterSection';
import NewsletterPopup from '@/components/NewsletterPopup';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturedSection />
      <NewsletterSection />
      <LatestPosts />
      <Footer />
      <NewsletterPopup />
    </div>
  );
};

export default Index;
