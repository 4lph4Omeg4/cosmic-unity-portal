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
      home: 'Thuis',
      about: 'Over Ons',
      shop: 'Winkel',
      blog: 'Blog',
      community: 'Community',
      contact: 'Contact',
      profile: 'Profiel',
      logout: 'Uitloggen',
    },
    footer: {
      description: 'Verken de cosmos binnenin. Maak verbinding, groei en ontwaak met Cosmic Unity Portal.',
      quickLinks: 'Snelle Links',
      legal: 'Wettelijk',
      social: 'Volg Ons',
      newsletter: 'Schrijf je in voor onze nieuwsbrief',
      'newsletter.placeholder': 'Jouw emailadres',
      'newsletter.subscribe': 'Abonneren',
      copyright: '© 2024 Cosmic Unity Portal. Alle rechten voorbehouden.',
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
      noFriends: 'Nog geen vrienden in de kosmos.',
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
  },
  en: {
    common: {
      cosmic: 'Cosmic',
      unity: 'Unity',
      portal: 'Portal',
      buyNow: 'Buy Now',
    },
    nav: {
      home: 'Home',
      about: 'About',
      shop: 'Shop',
      blog: 'Blog',
      community: 'Community',
      contact: 'Contact',
      profile: 'Profile',
      logout: 'Logout',
    },
    footer: {
      description: 'Explore the cosmos within. Connect, grow, and awaken with Cosmic Unity Portal.',
      quickLinks: 'Quick Links',
      legal: 'Legal',
      social: 'Follow Us',
      newsletter: 'Sign up for our newsletter',
      'newsletter.placeholder': 'Your email address',
      'newsletter.subscribe': 'Subscribe',
      copyright: '© 2025 Cosmic Unity Portal. All rights reserved.',
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
      home: 'Startseite',
      about: 'Über Uns',
      shop: 'Shop',
      blog: 'Blog',
      community: 'Gemeinschaft',
      contact: 'Kontakt',
      profile: 'Profil',
      logout: 'Abmelden',
    },
    footer: {
      description: 'Erkunde den Kosmos im Inneren. Verbinde dich, wachse und erwache mit dem Cosmic Unity Portal.',
      quickLinks: 'Schnell-Links',
      legal: 'Rechtliches',
      social: 'Folge Uns',
      newsletter: 'Melde dich für unseren Newsletter an',
      'newsletter.placeholder': 'Deine E-Mail-Adresse',
      'newsletter.subscribe': 'Abonnieren',
      copyright: '© 2024 Cosmic Unity Portal. Alle Rechte vorbehalten.',
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
      switchToSignup': 'Noch kein Konto? Registrieren',
      switchToLogin': 'Bereits ein Konto? Anmelden',
      logoutSuccess': 'Du wurdest erfolgreich abgemeldet.',
      loginSuccess': 'Erfolgreich angemeldet!',
      signupSuccess': 'Konto erfolgreich erstellt!',
      error': 'Authentifizierungsfehler',
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
      noMembers': 'Keine Mitglieder gefunden, die deiner Suche entsprechen.',
      noFriends': 'Du hast noch keine Freunde. Füge welche hinzu!',
      noRequests': 'Du hast keine ausstehenden Freundschaftsanfragen.',
      backToCommunity': 'Zurück zur Community',
    },
    friend: {
      requestSent': 'Freundschaftsanfrage gesendet!',
      requestError': 'Fehler beim Senden der Freundschaftsanfrage.',
      requestAccepted': 'Freundschaftsanfrage angenommen!',
      acceptError': 'Fehler beim Annehmen der Freundschaftsanfrage.',
      requestDeclined': 'Freundschaftsanfrage abgelehnt.',
      declineError': 'Fehler beim Ablehnen der Freundschaftsanfrage.',
      removed': 'Freund entfernt.',
      removeError': 'Fehler beim Entfernen des Freundes.',
    },
    userProfile: {
      friends': 'Freunde',
      since': 'Mitglied seit',
      noFriends': 'Noch keine Freunde im Kosmos.',
      loading': 'Profil wird geladen...',
      notFound': 'Benutzer nicht gefunden.',
      editProfile': 'Profil Bearbeiten',
      status: {
        friends: 'Freunde',
        pending: 'Anfrage Ausstehend',
        notFriends': 'Freund Hinzufügen',
        isSelf': 'Das bist du',
      },
    },
    messages: {
      title': 'Kosmische Nachrichten',
      back': 'Zurück',
      conversations': 'Gespräche',
      recentConversations': 'Ihre letzten Gespräche',
      noConversations': 'Noch keine Gespräche',
      selectConversation': 'Wähle ein Gespräch',
      startMessaging': 'Wählen Sie ein Gespräch auf der linken Seite, um mit dem Chatten zu beginnen.',
      typeMessage': 'Nachricht schreiben...',
      loading': 'Nachrichten werden geladen...',
      sendMessageError': 'Fehler beim Senden der Nachricht',
      fetchMessageError': 'Fehler beim Abrufen von Nachrichten',
      fetchConversationsError': 'Fehler beim Abrufen von Gesprächen',
      userNotFoundError': 'Benutzer nicht gefunden',
    },
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
