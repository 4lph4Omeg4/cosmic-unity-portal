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
    'common.cosmic': 'Kosmisch',
    'common.unity': 'Eenheid',
    'common.portal': 'Portaal',
    'common.buyNow': 'Koop Nu',
    'nav.home': 'Thuis',
    'nav.about': 'Over Ons',
    'nav.shop': 'Winkel',
    'nav.blog': 'Blog',
    'nav.community': 'Community',
    'nav.contact': 'Contact',
    'nav.profile': 'Profiel',
    'nav.logout': 'Uitloggen',
    'footer.description': 'Verken de kosmos binnenin. Maak verbinding, groei en ontwaak met Cosmic Unity Portal.',
    'footer.quickLinks': 'Snelle Links',
    'footer.legal': 'Wettelijk',
    'footer.social': 'Volg Ons',
    'footer.newsletter': 'Schrijf je in voor onze nieuwsbrief',
    'footer.newsletter.placeholder': 'Jouw emailadres',
    'footer.newsletter.subscribe': 'Abonneren',
    'footer.copyright': '© 2024 Cosmic Unity Portal. Alle rechten voorbehouden.',
    'auth.login.title': 'Welkom Terug',
    'auth.login.description': 'Log in op je account om je kosmische reis voort te zetten.',
    'auth.signup.title': 'Word lid van de Community',
    'auth.signup.description': 'Maak een account aan om het volledige potentieel van de kosmos te ontsluiten.',
    'auth.emailLabel': 'E-mail',
    'auth.passwordLabel': 'Wachtwoord',
    'auth.loginButton': 'Inloggen',
    'auth.signupButton': 'Aanmelden',
    'auth.orContinueWith': 'Of ga door met',
    'auth.switchToSignup': 'Nog geen account? Meld je aan',
    'auth.switchToLogin': 'Al een account? Log in',
    'auth.logoutSuccess': 'Je bent succesvol uitgelogd.',
    'auth.loginSuccess': 'Succesvol ingelogd!',
    'auth.signupSuccess': 'Account succesvol aangemaakt!',
    'auth.error': 'Authenticatiefout',
    'community.title': 'Kosmische Community',
    'community.description': 'Maak verbinding met gelijkgestemde zielen op hun spirituele reis.',
    'community.allMembers': 'Alle Leden',
    'community.searchPlaceholder': 'Zoek leden...',
    'community.friends': 'Vrienden',
    'community.requests': 'Verzoeken',
    'community.viewProfile': 'Bekijk Profiel',
    'community.sendMessage': 'Stuur Bericht',
    'community.addFriend': 'Vriend Toevoegen',
    'community.removeFriend': 'Vriend Verwijderen',
    'community.acceptRequest': 'Accepteren',
    'community.declineRequest': 'Weigeren',
    'community.noMembers': 'Geen leden gevonden die overeenkomen met je zoekopdracht.',
    'community.noFriends': 'Je hebt nog geen vrienden. Voeg wat toe!',
    'community.noRequests': 'Je hebt geen openstaande vriendschapsverzoeken.',
    'community.backToCommunity': 'Terug naar Community',
    'friend.requestSent': 'Vriendschapsverzoek verzonden!',
    'friend.requestError': 'Fout bij verzenden van vriendschapsverzoek.',
    'friend.requestAccepted': 'Vriendschapsverzoek geaccepteerd!',
    'friend.acceptError': 'Fout bij accepteren van vriendschapsverzoek.',
    'friend.requestDeclined': 'Vriendschapsverzoek geweigerd.',
    'friend.declineError': 'Fout bij weigeren van vriendschapsverzoek.',
    'friend.removed': 'Vriend verwijderd.',
    'friend.removeError': 'Fout bij verwijderen van vriend.',
    'userProfile.friends': 'Vrienden',
    'userProfile.since': 'Lid sinds',
    'userProfile.noFriends': 'Nog geen vrienden in de kosmos.',
    'userProfile.loading': 'Profiel laden...',
    'userProfile.notFound': 'Gebruiker niet gevonden.',
    'userProfile.editProfile': 'Profiel Bewerken',
    'userProfile.status.friends': 'Vrienden',
    'userProfile.status.pending': 'Verzoek In Afwachting',
    'userProfile.status.notFriends': 'Vriend Toevoegen',
    'userProfile.status.isSelf': 'Dit ben jij',
    'messages.title': 'Kosmische Berichten',
    'messages.back': 'Terug',
    'messages.conversations': 'Gesprekken',
    'messages.recentConversations': 'Je recente gesprekken',
    'messages.noConversations': 'Nog geen gesprekken',
    'messages.selectConversation': 'Selecteer een gesprek',
    'messages.startMessaging': 'Kies een gesprek aan de linkerkant om te beginnen met berichten.',
    'messages.typeMessage': 'Typ een bericht...',
    'messages.loading': 'Berichten laden...',
    'messages.sendMessageError': 'Fout bij verzenden van bericht',
    'messages.fetchMessageError': 'Fout bij ophalen van berichten',
    'messages.fetchConversationsError': 'Fout bij ophalen van gesprekken',
    'messages.userNotFoundError': 'Gebruiker niet gevonden',
  },
  en: {
    'common.cosmic': 'Cosmic',
    'common.unity': 'Unity',
    'common.portal': 'Portal',
    'common.buyNow': 'Buy Now',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.shop': 'Shop',
    'nav.blog': 'Blog',
    'nav.community': 'Community',
    'nav.contact': 'Contact',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'footer.description': 'Explore the cosmos within. Connect, grow, and awaken with Cosmic Unity Portal.',
    'footer.quickLinks': 'Quick Links',
    'footer.legal': 'Legal',
    'footer.social': 'Follow Us',
    'footer.newsletter': 'Sign up for our newsletter',
    'footer.newsletter.placeholder': 'Your email address',
    'footer.newsletter.subscribe': 'Subscribe',
    'footer.copyright': '© 2024 Cosmic Unity Portal. All rights reserved.',
    'auth.login.title': 'Welcome Back',
    'auth.login.description': 'Log in to your account to continue your cosmic journey.',
    'auth.signup.title': 'Join the Community',
    'auth.signup.description': 'Create an account to unlock the full potential of the cosmos.',
    'auth.emailLabel': 'Email',
    'auth.passwordLabel': 'Password',
    'auth.loginButton': 'Login',
    'auth.signupButton': 'Sign Up',
    'auth.orContinueWith': 'Or continue with',
    'auth.switchToSignup': "Don't have an account? Sign up",
    'auth.switchToLogin': 'Already have an account? Login',
    'auth.logoutSuccess': 'You have been successfully logged out.',
    'auth.loginSuccess': 'Successfully logged in!',
    'auth.signupSuccess': 'Account created successfully!',
    'auth.error': 'Authentication Error',
    'community.title': 'Cosmic Community',
    'community.description': 'Connect with like-minded souls on their spiritual journey.',
    'community.allMembers': 'All Members',
    'community.searchPlaceholder': 'Search members...',
    'community.friends': 'Friends',
    'community.requests': 'Requests',
    'community.viewProfile': 'View Profile',
    'community.sendMessage': 'Send Message',
    'community.addFriend': 'Add Friend',
    'community.removeFriend': 'Remove Friend',
    'community.acceptRequest': 'Accept',
    'community.declineRequest': 'Decline',
    'community.noMembers': 'No members found matching your search.',
    'community.noFriends': "You don't have any friends yet. Add some!",
    'community.noRequests': 'You have no pending friend requests.',
    'community.backToCommunity': 'Back to Community',
    'friend.requestSent': 'Friend request sent!',
    'friend.requestError': 'Error sending friend request.',
    'friend.requestAccepted': 'Friend request accepted!',
    'friend.acceptError': 'Error accepting friend request.',
    'friend.requestDeclined': 'Friend request declined.',
    'friend.declineError': 'Error declining friend request.',
    'friend.removed': 'Friend removed.',
    'friend.removeError': 'Error removing friend.',
    'userProfile.friends': 'Friends',
    'userProfile.since': 'Member since',
    'userProfile.noFriends': 'No friends in the cosmos yet.',
    'userProfile.loading': 'Loading profile...',
    'userProfile.notFound': 'User not found.',
    'userProfile.editProfile': 'Edit Profile',
    'userProfile.status.friends': 'Friends',
    'userProfile.status.pending': 'Request Pending',
    'userProfile.status.notFriends': 'Add Friend',
    'userProfile.status.isSelf': 'This is you',
    'messages.title': 'Cosmic Messages',
    'messages.back': 'Back',
    'messages.conversations': 'Conversations',
    'messages.recentConversations': 'Your recent conversations',
    'messages.noConversations': 'No conversations yet',
    'messages.selectConversation': 'Select a conversation',
    'messages.startMessaging': 'Choose a conversation from the left to start messaging.',
    'messages.typeMessage': 'Type a message...',
    'messages.loading': 'Loading messages...',
    'messages.sendMessageError': 'Error sending message',
    'messages.fetchMessageError': 'Error fetching messages',
    'messages.fetchConversationsError': 'Error fetching conversations',
    'messages.userNotFoundError': 'User not found',
  },
  de: {
    'common.cosmic': 'Kosmisch',
    'common.unity': 'Einheit',
    'common.portal': 'Portal',
    'common.buyNow': 'Jetzt Kaufen',
    'nav.home': 'Startseite',
    'nav.about': 'Über Uns',
    'nav.shop': 'Shop',
    'nav.blog': 'Blog',
    'nav.community': 'Gemeinschaft',
    'nav.contact': 'Kontakt',
    'nav.profile': 'Profil',
    'nav.logout': 'Abmelden',
    'footer.description': 'Erkunde den Kosmos im Inneren. Verbinde dich, wachse und erwache mit dem Cosmic Unity Portal.',
    'footer.quickLinks': 'Schnell-Links',
    'footer.legal': 'Rechtliches',
    'footer.social': 'Folge Uns',
    'footer.newsletter': 'Melde dich für unseren Newsletter an',
    'footer.newsletter.placeholder': 'Deine E-Mail-Adresse',
    'footer.newsletter.subscribe': 'Abonnieren',
    'footer.copyright': '© 2024 Cosmic Unity Portal. Alle Rechte vorbehalten.',
    'auth.login.title': 'Willkommen zurück',
    'auth.login.description': 'Melde dich bei deinem Konto an, um deine kosmische Reise fortzusetzen.',
    'auth.signup.title': 'Tritt der Gemeinschaft bei',
    'auth.signup.description': 'Erstelle ein Konto, um das volle Potenzial des Kosmos freizuschalten.',
    'auth.emailLabel': 'E-Mail',
    'auth.passwordLabel': 'Passwort',
    'auth.loginButton': 'Anmelden',
    'auth.signupButton': 'Registrieren',
    'auth.orContinueWith': 'Oder fahre fort mit',
    'auth.switchToSignup': 'Noch kein Konto? Registrieren',
    'auth.switchToLogin': 'Bereits ein Konto? Anmelden',
    'auth.logoutSuccess': 'Du wurdest erfolgreich abgemeldet.',
    'auth.loginSuccess': 'Erfolgreich angemeldet!',
    'auth.signupSuccess': 'Konto erfolgreich erstellt!',
    'auth.error': 'Authentifizierungsfehler',
    'community.title': 'Kosmische Gemeinschaft',
    'community.description': 'Verbinde dich mit Gleichgesinnten auf ihrer spirituellen Reise.',
    'community.allMembers': 'Alle Mitglieder',
    'community.searchPlaceholder': 'Mitglieder suchen...',
    'community.friends': 'Freunde',
    'community.requests': 'Anfragen',
    'community.viewProfile': 'Profil Anzeigen',
    'community.sendMessage': 'Nachricht Senden',
    'community.addFriend': 'Freund Hinzufügen',
    'community.removeFriend': 'Freund Entfernen',
    'community.acceptRequest': 'Annehmen',
    'community.declineRequest': 'Ablehnen',
    'community.noMembers': 'Keine Mitglieder gefunden, die deiner Suche entsprechen.',
    'community.noFriends': 'Du hast noch keine Freunde. Füge welche hinzu!',
    'community.noRequests': 'Du hast keine ausstehenden Freundschaftsanfragen.',
    'community.backToCommunity': 'Zurück zur Community',
    'friend.requestSent': 'Freundschaftsanfrage gesendet!',
    'friend.requestError': 'Fehler beim Senden der Freundschaftsanfrage.',
    'friend.requestAccepted': 'Freundschaftsanfrage angenommen!',
    'friend.acceptError': 'Fehler beim Annehmen der Freundschaftsanfrage.',
    'friend.requestDeclined': 'Freundschaftsanfrage abgelehnt.',
    'friend.declineError': 'Fehler beim Ablehnen der Freundschaftsanfrage.',
    'friend.removed': 'Freund entfernt.',
    'friend.removeError': 'Fehler beim Entfernen des Freundes.',
    'userProfile.friends': 'Freunde',
    'userProfile.since': 'Mitglied seit',
    'userProfile.noFriends': 'Noch keine Freunde im Kosmos.',
    'userProfile.loading': 'Profil wird geladen...',
    'userProfile.notFound': 'Benutzer nicht gefunden.',
    'userProfile.editProfile': 'Profil Bearbeiten',
    'userProfile.status.friends': 'Freunde',
    'userProfile.status.pending': 'Anfrage Ausstehend',
    'userProfile.status.notFriends': 'Freund Hinzufügen',
    'userProfile.status.isSelf': 'Das bist du',
    'messages.title': 'Kosmische Nachrichten',
    'messages.back': 'Zurück',
    'messages.conversations': 'Gespräche',
    'messages.recentConversations': 'Ihre letzten Gespräche',
    'messages.noConversations': 'Noch keine Gespräche',
    'messages.selectConversation': 'Wähle ein Gespräch',
    'messages.startMessaging': 'Wählen Sie ein Gespräch auf der linken Seite, um mit dem Chatten zu beginnen.',
    'messages.typeMessage': 'Nachricht schreiben...',
    'messages.loading': 'Nachrichten werden geladen...',
    'messages.sendMessageError': 'Fehler beim Senden der Nachricht',
    'messages.fetchMessageError': 'Fehler beim Abrufen von Nachrichten',
    'messages.fetchConversationsError': 'Fehler beim Abrufen von Gesprächen',
    'messages.userNotFoundError': 'Benutzer nicht gefunden',
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
