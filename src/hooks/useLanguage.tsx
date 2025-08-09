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
    // ... other translations
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
    // ... other translations
  },
  en: {
    // ... other translations
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
    // ... other translations
  },
  de: {
    // ... other translations
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
    // ... other translations
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
