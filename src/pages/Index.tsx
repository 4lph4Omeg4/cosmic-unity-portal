import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BooksSection from '@/components/BooksSection';
import FeaturedSection from '@/components/FeaturedSection';
import LatestPosts from '@/components/LatestPosts';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <BooksSection />
      <FeaturedSection />
      <NewsletterSection />
      <LatestPosts />
      <Footer />
    </div>
  );
};

export default Index;
