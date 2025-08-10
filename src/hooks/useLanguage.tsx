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
    common: {
      cosmic: 'Cosmisch',
      unity: 'Eenheid',
      portal: 'Portaal',
      buyNow: 'Koop Nu',
    },
    nav: {
      login:	'Inloggen',	
      home: 'Home',
      about: 'Over Ons',
      shop: 'Shop',
      blog: 'Blogs',
      community: 'Community',
      contact: 'Contact',
      profile: 'Profiel',
      logout: 'Uitloggen',
      cart: 'Winkelwagen', 
    },
 footer: {
  allProducts: 'Alle producten',
  newArrivals: 'Nieuwe producten',
  featured: 'Aanbevolen',
  shop: 'Winkel',
  community: 'Community',
  blog: 'Blogs',
  about: 'Over ons',
  contact: 'Contact',
  contactUs: 'Contacteer ons',
  shipping: 'Verzending',
  returns: 'Retouren',
  privacy: 'Privacybeleid',
  terms: 'Algemene voorwaarden',
  description: 'Verken de cosmos binnenin. Maak verbinding, groei en ontwaak met Cosmic Unity Portal.',
  quickLinks: 'Snelle Links',
  legal: 'Wettelijk',
  social: 'Volg Ons',
  newsletter: 'Schrijf je in voor onze nieuwsbrief',
  newsletter.title: 'Word lid van onze inner circle',
  'newsletter.placeholder': 'Jouw emailadres',
  'newsletter.subscribe': 'Abonneren',
  'newsletter.subtitle': 'Schrijf je in voor de nieuwsbrief en wees als eerste op de hoogte van nieuwe drops, spirituele inzichten en speciale aanbiedingen',
  'newsletter.compact.title': 'Nieuwsbrief',
  'newsletter.email.label': 'E‑mailadres',
  'newsletter.account.create': 'Account aanmaken',
  'newsletter.account.benefits': 'Maak een account aan voor exclusieve voordelen',
  'newsletter.password.label': 'Wachtwoord',
  'newsletter.password.hint': 'Minimaal 8 tekens',
  'newsletter.consent': 'Ik ga akkoord met het ontvangen van kosmische updates en marketingmails',
  'newsletter.error.incomplete': 'Vul alle verplichte velden in en accepteer ons privacybeleid',
  'newsletter.error.password': 'Wachtwoord is verplicht om een account aan te maken',
  'newsletter.success.title': 'Bedankt voor je inschrijving!',
  'newsletter.success.description': 'Je inschrijving is gelukt',
  'newsletter.success.message': 'Je bent nu geabonneerd. Check je inbox voor bevestiging.',
  'newsletter.welcome.title': 'Welkom, spirituele reiziger!',
  'newsletter.welcome.message': 'Check je e‑mail voor ons kosmische welkomstgeschenk.',
  'newsletter.welcome.status': 'Je account is aangemaakt. Log in om te verkennen.',
  'newsletter.button.loading': 'Bezig…',
  'newsletter.button': 'Abonneer',
   copyright: '© 2025 SH4M4NI4K - Cosmic Unity Portal. Alle rechten voorbehouden.',
    },
    auth: {
      login: {
        title: 'Welkom Terug',
        description: 'Log in op je account om je cosmische reis voort te zetten.',
      },
      signup: {
        title: 'Word lid van de Community',
        description: 'Maak een account aan om het volledige potentieel van de cosmos te ontsluiten.',
      },
      emailLabel: 'E-mail',
      passwordLabel: 'Wachtwoord',
      loginButton: 'Inloggen',
      signupButton: 'Aanmelden',
      orContinueWith: 'Of ga door met',
      switchToSignup: 'Nog geen account? Meld je aan',
      switchToLogin: 'Al een account? Log in',
      logoutSuccess: 'Je bent succesvol uitgelogd.',
      loginSuccess: 'Succesvol ingelogd!',
      signupSuccess: 'Account succesvol aangemaakt!',
      error: 'Authenticatiefout',
    },
    community: {
      title: 'Cosmische Community',
      description: 'Maak verbinding met gelijkgestemde zielen op hun spirituele reis.',
      allMembers: 'Alle Leden',
      searchPlaceholder: 'Zoek leden...',
      friends: 'Vrienden',
      requests: 'Verzoeken',
      viewProfile: 'Bekijk Profiel',
      sendMessage: 'Stuur Bericht',
      addFriend: 'Vriend Toevoegen',
      removeFriend: 'Vriend Verwijderen',
      acceptRequest: 'Accepteren',
      declineRequest: 'Weigeren',
      noMembers: 'Geen leden gevonden die overeenkomen met je zoekopdracht.',
      noFriends: 'Je hebt nog geen vrienden. Voeg wat toe!',
      noRequests: 'Je hebt geen openstaande vriendschapsverzoeken.',
      backToCommunity: 'Terug naar Community',
    },
    friend: {
      requestSent: 'Vriendschapsverzoek verzonden!',
      requestError: 'Fout bij verzenden van vriendschapsverzoek.',
      requestAccepted: 'Vriendschapsverzoek geaccepteerd!',
      acceptError: 'Fout bij accepteren van vriendschapsverzoek.',
      requestDeclined: 'Vriendschapsverzoek geweigerd.',
      declineError: 'Fout bij weigeren van vriendschapsverzoek.',
      removed: 'Vriend verwijderd.',
      removeError: 'Fout bij verwijderen van vriend.',
    },
    userProfile: {
      friends: 'Vrienden',
      since: 'Lid sinds',
      noFriends: 'Nog geen vrienden in de cosmos.',
      loading: 'Profiel laden...',
      notFound: 'Gebruiker niet gevonden.',
      editProfile: 'Profiel Bewerken',
      status: {
        friends: 'Vrienden',
        pending: 'Verzoek In Afwachting',
        notFriends: 'Vriend Toevoegen',
        isSelf: 'Dit ben jij',
      },
      
    },
    messages: {
      title: 'Cosmische Berichten',
      back: 'Terug',
      conversations: 'Gesprekken',
      recentConversations: 'Je recente gesprekken',
      noConversations: 'Nog geen gesprekken',
      selectConversation: 'Selecteer een gesprek',
      startMessaging: 'Kies een gesprek aan de linkerkant om te beginnen met berichten.',
      typeMessage: 'Typ een bericht...',
      loading: 'Berichten laden...',
      sendMessageError: 'Fout bij verzenden van bericht',
      fetchMessageError: 'Fout bij ophalen van berichten',
      fetchConversationsError: 'Fout bij ophalen van gesprekken',
      userNotFoundError: 'Gebruiker niet gevonden',
    },
hero: {
  subtitle: 'Ontdek je oneindige potentieel',
  cta: { explore: 'Ontdek' }
},
  },
  en: {
    common: {
      cosmic: 'Cosmic',
      unity: 'Unity',
      portal: 'Portal',
      buyNow: 'Buy Now',
    },
    nav: {
      login: 'Login', 
      home: 'Home',
      about: 'About',
      shop: 'Shop',
      blog: 'Blogs',
      community: 'Community',
      contact: 'Contact',
      profile: 'Profile',
      logout: 'Logout',
      cart:	'Cart',
    },
    hero: {
  subtitle: 'Discover your infinite potential',
  cta: { explore: 'Explore' }
},
footer: {
  allProducts: 'All Products',
  newArrivals: 'New Arrivals',
  featured: 'Featured',
  shop: 'Shop',
  community: 'Community',
  blog: 'Blog',
  about: 'About Us',
  contact: 'Contact',
  contactUs: 'Contact Us',
  shipping: 'Shipping',
  returns: 'Returns',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
      description: 'Explore the cosmos within. Connect, expand, and awaken with Cosmic Unity Portal.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      social: 'Follow Us',
      newsletter: 'Sign up for our newsletter',
      'newsletter.title': 'Join our inner circle',
      'newsletter.placeholder': 'Your email address',
      'newsletter.subscribe': 'Subscribe',
      'newsletter.subtitle': 'Sign up for the newsletter and be the first to know about new drops, spiritual insights and special offers',
      'newsletter.compact.title': 'Newsletter',
      'newsletter.email.label': 'Email address',
      'newsletter.account.create': 'Create an account', 
      'newsletter.account.benefits': 'Unlock exclusive benefits when you create an account',
      'newsletter.password.label': 'Password',
      'newsletter.success.title': 'Thank you for joining!',
      'newsletter.error.password': 'Password is required to create an account',
      'newsletter.error.incomplete': 'Please fill in all required fields and accept our privacy policy',
      'newsletter.consent': 'I agree to receive cosmic updates and marketing emails',
      'newsletter.password.hint': 'Minimum 8 characters',
      'newsletter.success.description': 'Your subscription was successful',
      'newsletter.success.message': 'You’re now subscribed. Check your inbox for a confirmation.',
      'newsletter.welcome.title': 'Welcome, spiritual traveller!',
      'newsletter.welcome.message': 'Check your email for a cosmic welcome gift.',
      'newsletter.welcome.status': 'Your account has been created. Log in to explore.',
      'newsletter.button.loading': 'Sending…',
      'newsletter.button': 'Subscribe',
      copyright: '© 2025 SH4M4NI4K - Cosmic Unity Portal. All rights reserved.',
    },
    auth: {
      login: {
        title: 'Welcome Back',
        description: 'Log in to your account to continue your cosmic journey.',
      },
      signup: {
        title: 'Join the Community',
        description: 'Create an account to unlock the full potential of the cosmos.',
      },
      emailLabel: 'Email',
      passwordLabel: 'Password',
      loginButton: 'Login',
      signupButton: 'Sign Up',
      orContinueWith: 'Or continue with',
      switchToSignup: "Don't have an account? Sign up",
      switchToLogin: 'Already have an account? Login',
      logoutSuccess: 'You have been successfully logged out.',
      loginSuccess: 'Successfully logged in!',
      signupSuccess: 'Account created successfully!',
      error: 'Authentication Error',
    },
    community: {
      title: 'Cosmic Community',
      description: 'Connect with like-minded souls on their spiritual journey.',
      allMembers: 'All Members',
      searchPlaceholder: 'Search members...',
      friends: 'Friends',
      requests: 'Requests',
      viewProfile: 'View Profile',
      sendMessage: 'Send Message',
      addFriend: 'Add Friend',
      removeFriend: 'Remove Friend',
      acceptRequest: 'Accept',
      declineRequest: 'Decline',
      noMembers: 'No members found matching your search.',
      noFriends: "You don't have any friends yet. Add some!",
      noRequests: 'You have no pending friend requests.',
      backToCommunity: 'Back to Community',
    },
    friend: {
      requestSent: 'Friend request sent!',
      requestError: 'Error sending friend request.',
      requestAccepted: 'Friend request accepted!',
      acceptError: 'Error accepting friend request.',
      requestDeclined: 'Friend request declined.',
      declineError: 'Error declining friend request.',
      removed: 'Friend removed.',
      removeError: 'Error removing friend.',
    },
    userProfile: {
      friends: 'Friends',
      since: 'Member since',
      noFriends: 'No friends in the cosmos yet.',
      loading: 'Loading profile...',
      notFound: 'User not found.',
      editProfile: 'Edit Profile',
      status: {
        friends: 'Friends',
        pending: 'Request Pending',
        notFriends: 'Add Friend',
        isSelf: 'This is you',
      },
    },
    messages: {
      title: 'Cosmic Messages',
      back: 'Back',
      conversations: 'Conversations',
      recentConversations: 'Your recent conversations',
      noConversations: 'No conversations yet',
      selectConversation: 'Select a conversation',
      startMessaging: 'Choose a conversation from the left to start messaging.',
      typeMessage: 'Type a message...',
      loading: 'Loading messages...',
      sendMessageError: 'Error sending message',
      fetchMessageError: 'Error fetching messages',
      fetchConversationsError: 'Error fetching conversations',
      userNotFoundError: 'User not found',
    },
  },
  de: {
    common: {
      cosmic: 'Kosmisch',
      unity: 'Einheit',
      portal: 'Portal',
      buyNow: 'Jetzt Kaufen',
    },
    nav: {
      login: 'Anmelden',
      home: 'Startseite',
      about: 'Über Uns',
      shop: 'Shop',
      blog: 'Blog',
      community: 'Gemeinschaft',
      contact: 'Kontakt',
      profile: 'Profil',
      logout: 'Abmelden',
      cart:	'Warenkorb', 
    },
    hero: {
  subtitle: 'Entdecke dein grenzenloses Potenzial',
  cta: { explore: 'Entdecken' }
},
footer: {
  allProducts: 'Alle Produkte',
  newArrivals: 'Neuheiten',
  featured: 'Empfohlen',
  shop: 'Shop',           // of 'Laden', afhankelijk van je voorkeur
  community: 'Gemeinschaft',
  blog: 'Blog',
  about: 'Über uns',
  contact: 'Kontakt',
  contactUs: 'Kontaktieren Sie uns',
  shipping: 'Versand',
  returns: 'Rückgabe',
  privacy: 'Datenschutz',
  terms: 'Nutzungsbedingungen',
      description: 'Erkunde den Kosmos im Inneren. Verbinde dich, wachse und erwache mit dem Cosmic Unity Portal.',
      quickLinks: 'Schnell-Links',
      legal: 'Rechtliches',
      social: 'Folge Uns',
      newsletter: 'Melde dich für unseren Newsletter an',
      'newsletter.title': 'Werde Teil unseres Inner Circle',
      'newsletter.placeholder': 'Deine E-Mail-Adresse',
      'newsletter.subscribe': 'Abonnieren',
      'newsletter.subtitle': 'Melde dich für den Newsletter an und sei der Erste, der von neuen Drops, spirituellen Erkenntnissen und besonderen Angeboten erfährt',
      'newsletter.compact.title': 'Newsletter',
      'newsletter.email.label': 'E‑Mail‑Adresse',
      'newsletter.account.create': 'Konto erstellen',
      'newsletter.account.benefits': 'Erhalte exklusive Vorteile mit einem Konto',
      'newsletter.password.label': 'Passwort',
      'newsletter.success.title': 'Danke für deine Anmeldung!',
      'newsletter.error.password': 'Passwort ist erforderlich, um ein Konto zu erstellen', 
      'newsletter.error.incomplete': 'Bitte fülle alle Pflichtfelder aus und akzeptiere unsere Datenschutzrichtlinie',
      'newsletter.consent': 'Ich stimme zu, kosmische Updates und Marketing‑E‑Mails zu erhalten',
      'newsletter.password.hint': 'Mindestens 8 Zeichen',
      'newsletter.success.description': 'Deine Anmeldung war erfolgreich',
      'newsletter.success.message': 'Du bist jetzt angemeldet. Prüfe dein Postfach auf eine Bestätigung.',
      'newsletter.welcome.title': 'Willkommen, spiritueller Reisender!',
      'newsletter.welcome.message': 'Prüfe deine E‑Mail auf unser kosmisches Willkommensgeschenk.',
      'newsletter.welcome.status': 'Dein Konto wurde erstellt. Logge dich ein, um zu entdecken.',
      'newsletter.button.loading': 'Senden…',
      'newsletter.button': 'Abonnieren',
      copyright: '© 2025 SH4M4NI4K - Cosmic Unity Portal. Alle Rechte vorbehalten.',
    },
    auth: {
      login: {
        title: 'Willkommen zurück',
        description: 'Melde dich bei deinem Konto an, um deine kosmische Reise fortzusetzen.',
      },
      signup: {
        title: 'Tritt der Gemeinschaft bei',
        description: 'Erstelle ein Konto, um das volle Potenzial des Kosmos freizuschalten.',
      },
      emailLabel: 'E-Mail',
      passwordLabel: 'Passwort',
      loginButton: 'Anmelden',
      signupButton: 'Registrieren',
      orContinueWith: 'Oder fahre fort mit',
      switchToSignup: 'Noch kein Konto? Registrieren',
      switchToLogin: 'Bereits ein Konto? Anmelden',
      logoutSuccess: 'Du wurdest erfolgreich abgemeldet.',
      loginSuccess: 'Erfolgreich angemeldet!',
      signupSuccess: 'Konto erfolgreich erstellt!',
      error: 'Authentifizierungsfehler',
    },
    community: {
      title: 'Kosmische Gemeinschaft',
      description: 'Verbinde dich mit Gleichgesinnten auf ihrer spirituellen Reise.',
      allMembers: 'Alle Mitglieder',
      searchPlaceholder: 'Mitglieder suchen...',
      friends: 'Freunde',
      requests: 'Anfragen',
      viewProfile: 'Profil Anzeigen',
      sendMessage: 'Nachricht Senden',
      addFriend: 'Freund Hinzufügen',
      removeFriend: 'Freund Entfernen',
      acceptRequest: 'Annehmen',
      declineRequest: 'Ablehnen',
      noMembers: 'Keine Mitglieder gefunden, die deiner Suche entsprechen.',
      noFriends: 'Du hast noch keine Freunde. Füge welche hinzu!',
      noRequests: 'Du hast keine ausstehenden Freundschaftsanfragen.',
      backToCommunity: 'Zurück zur Community',
    },
    friend: {
      requestSent: 'Freundschaftsanfrage gesendet!',
      requestError: 'Fehler beim Senden der Freundschaftsanfrage.',
      requestAccepted: 'Freundschaftsanfrage angenommen!',
      acceptError: 'Fehler beim Annehmen der Freundschaftsanfrage.',
      requestDeclined: 'Freundschaftsanfrage abgelehnt.',
      declineError: 'Fehler beim Ablehnen der Freundschaftsanfrage.',
      removed: 'Freund entfernt.',
      removeError: 'Fehler beim Entfernen des Freundes.',
    },
    userProfile: {
      friends: 'Freunde',
      since: 'Mitglied seit',
      noFriends: 'Noch keine Freunde im Kosmos.',
      loading: 'Profil wird geladen...',
      notFound: 'Benutzer nicht gefunden.',
      editProfile: 'Profil Bearbeiten',
      status: {
        friends: 'Freunde',
        pending: 'Anfrage Ausstehend',
        notFriends: 'Freund Hinzufügen',
        isSelf: 'Das bist du',
      },
    },
    messages: {
      title: 'Kosmische Nachrichten',
      back: 'Zurück',
      conversations: 'Gespräche',
      recentConversations: 'Ihre letzten Gespräche',
      noConversations: 'Noch keine Gespräche',
      selectConversation: 'Wähle ein Gespräch',
      startMessaging: 'Wählen Sie ein Gespräch auf der linken Seite, um mit dem Chatten zu beginnen.',
      typeMessage: 'Nachricht schreiben...',
      loading: 'Nachrichten werden geladen...',
      sendMessageError: 'Fehler beim Senden der Nachricht',
      fetchMessageError: 'Fehler beim Abrufen von Nachrichten',
      fetchConversationsError: 'Fehler beim Abrufen von Gesprächen',
      userNotFoundError: 'Benutzer nicht gefunden',
    },
  }
}

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
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations.en;
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk];
        }
        return fallbackResult || key;
      }
    }
    return result || key;
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
