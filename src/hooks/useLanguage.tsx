import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'nl' | 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  nl: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.community': 'Community',
    'nav.about': 'Over Ons',
    'nav.contact': 'Contact',
    'nav.login': 'Inloggen',
    'nav.profile': 'Profiel',
    'nav.logout': 'Uitloggen',
    
    // Hero Section
    'hero.title.cosmic': 'Cosmic',
    'hero.title.unity': 'Unity',
    'hero.title.portal': 'Portal',
    'hero.subtitle': 'Ontdek de kosmische verbinding tussen bewustzijn, spiritualiteit en universele wijsheid',
    'hero.cta.explore': 'Verken de Portal',
    'hero.cta.community': 'Word Lid van Gemeenschap',
    
    // Featured Section
    'featured.title.sacred': 'Sacred',
    'featured.title.geometry': 'Geometry',
    'featured.subtitle': 'Ontdek de eeuwenoude wijsheid verborgen in kosmische patronen',
    'featured.explore': 'Verken Collectie',
    
    // Latest Posts
    'posts.title.latest': 'Laatste',
    'posts.title.posts': 'Posts',
    'posts.subtitle': 'Ontdek de nieuwste inzichten van onze community',
    'posts.viewCommunity': 'Bekijk Community',
    'posts.newPost': 'Nieuwe Post',
    'posts.noPosts': 'Nog geen posts',
    'posts.firstPost': 'Wees de eerste om een post te plaatsen!',
    'posts.createFirst': 'Eerste Post Maken',
    'posts.loginToPost': 'Inloggen om te Posten',
    'posts.readMore': 'Lees meer →',
    'posts.viewAll': 'Bekijk Alle Posts',
    
    // Community
    'community.title.cosmic': 'Cosmic',
    'community.title.community': 'Community',
    'community.subtitle': 'Connect met medebewuste zielen op hun spirituele reis naar verlichting',
    'community.newPost': 'Nieuwe Post',
    'community.shareInsight': 'Deel je kosmische inzicht',
    'community.inspire': 'Inspireer anderen met je spirituele ervaring',
    'community.postTitle': 'Titel van je bericht...',
    'community.postContent': 'Wat wil je delen met de community?',
    'community.publish': 'Publiceren',
    'community.cancel': 'Annuleren',
    'community.addComment': 'Deel je gedachten...',
    
    // Auth
    'auth.title.cosmic': 'Cosmic',
    'auth.title.portal': 'Portal',
    'auth.subtitle': 'Verbind met je kosmische zelf',
    'auth.login': 'Inloggen',
    'auth.signup': 'Registreren',
    'auth.email': 'E-mail',
    'auth.password': 'Wachtwoord',
    'auth.displayName': 'Weergavenaam',
    'auth.loginButton': 'Inloggen',
    'auth.signupButton': 'Account Aanmaken',
    'auth.switchToSignup': 'Nog geen account? Registreer hier',
    'auth.switchToLogin': 'Al een account? Log hier in',
    
    // Common
    'common.loading': 'Laden...',
    'common.cosmic': 'Cosmic',
    'common.chosenOne': 'Chosen One'
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.community': 'Community',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Hero Section
    'hero.title.cosmic': 'Cosmic',
    'hero.title.unity': 'Unity',
    'hero.title.portal': 'Portal',
    'hero.subtitle': 'Discover the cosmic connection between consciousness, spirituality and universal wisdom',
    'hero.cta.explore': 'Explore Portal',
    'hero.cta.community': 'Join Community',
    
    // Featured Section
    'featured.title.sacred': 'Sacred',
    'featured.title.geometry': 'Geometry',
    'featured.subtitle': 'Discover ancient wisdom hidden in cosmic patterns',
    'featured.explore': 'Explore Collection',
    
    // Latest Posts
    'posts.title.latest': 'Latest',
    'posts.title.posts': 'Posts',
    'posts.subtitle': 'Discover the latest insights from our community',
    'posts.viewCommunity': 'View Community',
    'posts.newPost': 'New Post',
    'posts.noPosts': 'No posts yet',
    'posts.firstPost': 'Be the first to create a post!',
    'posts.createFirst': 'Create First Post',
    'posts.loginToPost': 'Login to Post',
    'posts.readMore': 'Read more →',
    'posts.viewAll': 'View All Posts',
    
    // Community
    'community.title.cosmic': 'Cosmic',
    'community.title.community': 'Community',
    'community.subtitle': 'Connect with like-minded souls on their spiritual journey to enlightenment',
    'community.newPost': 'New Post',
    'community.shareInsight': 'Share your cosmic insight',
    'community.inspire': 'Inspire others with your spiritual experience',
    'community.postTitle': 'Title of your post...',
    'community.postContent': 'What would you like to share with the community?',
    'community.publish': 'Publish',
    'community.cancel': 'Cancel',
    'community.addComment': 'Share your thoughts...',
    
    // Auth
    'auth.title.cosmic': 'Cosmic',
    'auth.title.portal': 'Portal',
    'auth.subtitle': 'Connect with your cosmic self',
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.displayName': 'Display Name',
    'auth.loginButton': 'Sign In',
    'auth.signupButton': 'Create Account',
    'auth.switchToSignup': 'No account yet? Register here',
    'auth.switchToLogin': 'Already have an account? Sign in here',
    
    // Common
    'common.loading': 'Loading...',
    'common.cosmic': 'Cosmic',
    'common.chosenOne': 'Chosen One'
  },
  
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.shop': 'Shop',
    'nav.community': 'Community',
    'nav.about': 'Über Uns',
    'nav.contact': 'Kontakt',
    'nav.login': 'Anmelden',
    'nav.profile': 'Profil',
    'nav.logout': 'Abmelden',
    
    // Hero Section
    'hero.title.cosmic': 'Cosmic',
    'hero.title.unity': 'Unity',
    'hero.title.portal': 'Portal',
    'hero.subtitle': 'Entdecke die kosmische Verbindung zwischen Bewusstsein, Spiritualität und universeller Weisheit',
    'hero.cta.explore': 'Portal Erkunden',
    'hero.cta.community': 'Community Beitreten',
    
    // Featured Section
    'featured.title.sacred': 'Sacred',
    'featured.title.geometry': 'Geometry',
    'featured.subtitle': 'Entdecke uralte Weisheit verborgen in kosmischen Mustern',
    'featured.explore': 'Kollektion Erkunden',
    
    // Latest Posts
    'posts.title.latest': 'Neueste',
    'posts.title.posts': 'Posts',
    'posts.subtitle': 'Entdecke die neuesten Einsichten unserer Community',
    'posts.viewCommunity': 'Community Ansehen',
    'posts.newPost': 'Neuer Post',
    'posts.noPosts': 'Noch keine Posts',
    'posts.firstPost': 'Sei der Erste, der einen Post erstellt!',
    'posts.createFirst': 'Ersten Post Erstellen',
    'posts.loginToPost': 'Anmelden zum Posten',
    'posts.readMore': 'Weiterlesen →',
    'posts.viewAll': 'Alle Posts Ansehen',
    
    // Community
    'community.title.cosmic': 'Cosmic',
    'community.title.community': 'Community',
    'community.subtitle': 'Verbinde dich mit Gleichgesinnten auf ihrer spirituellen Reise zur Erleuchtung',
    'community.newPost': 'Neuer Post',
    'community.shareInsight': 'Teile deine kosmische Einsicht',
    'community.inspire': 'Inspiriere andere mit deiner spirituellen Erfahrung',
    'community.postTitle': 'Titel deines Posts...',
    'community.postContent': 'Was möchtest du mit der Community teilen?',
    'community.publish': 'Veröffentlichen',
    'community.cancel': 'Abbrechen',
    'community.addComment': 'Teile deine Gedanken...',
    
    // Auth
    'auth.title.cosmic': 'Cosmic',
    'auth.title.portal': 'Portal',
    'auth.subtitle': 'Verbinde dich mit deinem kosmischen Selbst',
    'auth.login': 'Anmelden',
    'auth.signup': 'Registrieren',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.displayName': 'Anzeigename',
    'auth.loginButton': 'Anmelden',
    'auth.signupButton': 'Konto Erstellen',
    'auth.switchToSignup': 'Noch kein Konto? Hier registrieren',
    'auth.switchToLogin': 'Bereits ein Konto? Hier anmelden',
    
    // Common
    'common.loading': 'Laden...',
    'common.cosmic': 'Cosmic',
    'common.chosenOne': 'Chosen One'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('nl');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['nl', 'en', 'de'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};