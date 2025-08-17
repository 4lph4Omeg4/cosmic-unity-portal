import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FriendsList from '@/components/FriendsList';
import { useLanguage } from '@/hooks/useLanguage';

const Friends = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="font-cosmic text-4xl md:text-5xl text-cosmic-gradient mb-4">
              {t('friends.pageTitle')}
            </h1>
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('friends.pageSubtitle')}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <FriendsList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Friends;