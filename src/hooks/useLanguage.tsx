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
      loading: 'Laden...',
      loadingCommunity: 'Community laden...',
      error: 'Fout',
      success: 'Succes',
      cancel: 'Annuleren',
      save: 'Opslaan',
      delete: 'Verwijderen',
      edit: 'Bewerken',
      back: 'Terug',
      next: 'Volgende',
      previous: 'Vorige',
      close: 'Sluiten',
      open: 'Openen',
      yes: 'Ja',
      no: 'Nee',
      search: 'Zoeken',
      filter: 'Filteren',
      sort: 'Sorteren',
      view: 'Bekijken',
      share: 'Delen',
      like: 'Leuk vinden',
      comment: 'Reactie',
      send: 'Verzenden',
      reply: 'Antwoorden',
      follow: 'Volgen',
      unfollow: 'Ontvolgen',
      block: 'Blokkeren',
      unblock: 'Deblokkeren',
      report: 'Rapporteren',
      settings: 'Instellingen',
      profile: 'Profiel',
      account: 'Account',
      logout: 'Uitloggen',
      login: 'Inloggen',
      register: 'Registreren',
      forgotPassword: 'Wachtwoord vergeten',
      resetPassword: 'Wachtwoord resetten',
      changePassword: 'Wachtwoord wijzigen',
      email: 'E-mail',
      password: 'Wachtwoord',
      confirmPassword: 'Bevestig wachtwoord',
      firstName: 'Voornaam',
      lastName: 'Achternaam',
      fullName: 'Volledige naam',
      phoneNumber: 'Telefoonnummer',
      address: 'Adres',
      city: 'Stad',
      country: 'Land',
      zipCode: 'Postcode',
      birthDate: 'Geboortedatum',
      gender: 'Geslacht',
      male: 'Man',
      female: 'Vrouw',
      other: 'Anders',
      preferNotToSay: 'Wil ik niet zeggen',
      notifications: 'Meldingen',
      privacy: 'Privacy',
      security: 'Beveiliging',
      help: 'Hulp',
      support: 'Ondersteuning',
      feedback: 'Feedback',
      aboutUs: 'Over ons',
      contact: 'Contact',
      termsOfService: 'Gebruiksvoorwaarden',
      privacyPolicy: 'Privacybeleid',
      cookiePolicy: 'Cookiebeleid',
      legal: 'Juridisch',
      copyright: 'Copyright',
      allRightsReserved: 'Alle rechten voorbehouden',
      version: 'Versie',
      language: 'Taal',
      theme: 'Thema',
      darkMode: 'Donkere modus',
      lightMode: 'Lichte modus',
      systemMode: 'Systeemmodus',
      online: 'Online',
      offline: 'Offline',
      lastSeen: 'Laatst gezien',
      active: 'Actief',
      inactive: 'Inactief',
      banned: 'Geblokkeerd',
      suspended: 'Geschorst',
      verified: 'Geverifieerd',
      unverified: 'Niet geverifieerd',
      premium: 'Premium',
      free: 'Gratis',
      pro: 'Pro',
      basic: 'Basis',
      advanced: 'Geavanceerd',
      expert: 'Expert',
      beginner: 'Beginner',
      intermediate: 'Gemiddeld',
      all: 'Alle',
      none: 'Geen',
      selected: 'Geselecteerd',
      unselected: 'Niet geselecteerd',
      enabled: 'Ingeschakeld',
      disabled: 'Uitgeschakeld',
      public: 'Openbaar',
      private: 'Privé',
      draft: 'Concept',
      published: 'Gepubliceerd',
      archived: 'Gearchiveerd',
      deleted: 'Verwijderd',
      pending: 'In afwachting',
      approved: 'Goedgekeurd',
      rejected: 'Afgewezen',
      completed: 'Voltooid',
      incomplete: 'Onvolledig',
      inProgress: 'In uitvoering',
      notStarted: 'Niet gestart',
      failed: 'Mislukt',
      successful: 'Succesvol',
      warning: 'Waarschuwing',
      info: 'Informatie',
      debug: 'Debug',
      trace: 'Traceren',
      fatal: 'Fataal',
      unknown: 'Onbekend',
      notAvailable: 'Niet beschikbaar',
      comingSoon: 'Binnenkort beschikbaar',
      maintenanceMode: 'Onderhoudsmodus',
      pageNotFound: 'Pagina niet gevonden',
      serverError: 'Serverfout',
      networkError: 'Netwerkfout',
      timeout: 'Time-out',
      unauthorized: 'Niet geautoriseerd',
      forbidden: 'Verboden',
      tooManyRequests: 'Te veel verzoeken',
      badRequest: 'Slecht verzoek',
      conflict: 'Conflict',
      gone: 'Verdwenen',
      lengthRequired: 'Lengte vereist',
      payloadTooLarge: 'Payload te groot',
      unsupportedMediaType: 'Niet-ondersteund mediatype',
      unprocessableEntity: 'Niet-verwerkbare entiteit',
      tooEarly: 'Te vroeg',
      upgradeRequired: 'Upgrade vereist',
      preconditionRequired: 'Voorwaarde vereist',
      tooManyRequestsFromThisIP: 'Te veel verzoeken van dit IP',
      requestHeaderFieldsTooLarge: 'Verzoekheadervelden te groot',
      unavailableForLegalReasons: 'Niet beschikbaar om juridische redenen',
      internalServerError: 'Interne serverfout',
      notImplemented: 'Niet geïmplementeerd',
      badGateway: 'Slechte gateway',
      serviceUnavailable: 'Service niet beschikbaar',
      gatewayTimeout: 'Gateway time-out',
      httpVersionNotSupported: 'HTTP-versie niet ondersteund',
      variantAlsoNegotiates: 'Variant onderhandelt ook',
      insufficientStorage: 'Onvoldoende opslag',
      loopDetected: 'Lus gedetecteerd',
      notExtended: 'Niet uitgebreid',
      networkAuthenticationRequired: 'Netwerkauthenticatie vereist',
    },
    nav: {
      login: 'Inloggen',
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
      copyright: '© 2025 SH4M4NI4K - Cosmic Unity Portal. Alle rechten voorbehouden.',
    },
    newsletter: {
      title: 'Word lid van onze inner circle',
      subtitle: 'Schrijf je in voor de nieuwsbrief en wees als eerste op de hoogte van nieuwe drops, spirituele inzichten en speciale aanbiedingen',
      placeholder: 'Jouw emailadres',
      button: 'Abonneer',
      subscribe: 'Abonneren',
      compact: { title: 'Nieuwsbrief' },
      email: { label: 'E-mailadres' },
      account: {
        create: 'Account aanmaken',
        benefits: 'Maak een account aan voor exclusieve voordelen',
      },
      password: {
        label: 'Wachtwoord',
        hint: 'Minimaal 8 tekens',
      },
      consent: 'Ik ga akkoord met het ontvangen van kosmische updates en marketingmails',
      error: {
        incomplete: 'Vul alle verplichte velden in en accepteer ons privacybeleid',
        password: 'Wachtwoord is verplicht om een account aan te maken',
      },
      success: {
        title: 'Bedankt voor je inschrijving!',
        description: 'Je inschrijving is gelukt',
        message: 'Je bent nu geabonneerd. Check je inbox voor bevestiging.',
      },
      welcome: {
        title: 'Welkom, spirituele reiziger!',
        message: 'Check je e-mail voor ons kosmische welkomstgeschenk.',
        status: 'Je account is aangemaakt. Log in om te verkennen.',
      },
      buttonLoading: 'Bezig…',
      section: {
        title: 'Word lid van onze inner circle',
        subtitle: 'Schrijf je in voor de nieuwsbrief en wees als eerste op de hoogte',
        description: 'Ontvang exclusieve inzichten, speciale aanbiedingen en spirituele begeleiding',
      },
      benefits: {
        title: 'Kosmische Voordelen',
        wisdom: {
          title: 'Spirituele Wijsheid',
          desc: 'Ontvang diepgaande inzichten en spirituele begeleiding',
        },
        access: {
          title: 'Exclusieve Toegang',
          desc: 'Krijg vroege toegang tot nieuwe producten en content',
        },
        guidance: {
          title: 'Persoonlijke Begeleiding',
          desc: 'Ontvang gepersonaliseerde spirituele begeleiding',
        },
      },
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
      cta: { explore: 'Ontdek' },
    },
    featured: {
      title: {
        sacred: 'Heilige',
        geometry: 'Geometrie',
      },
      subtitle: 'Ontdek onze collectie van spirituele kunst en merchandise',
    },
    posts: {
      title: {
        latest: 'Laatste',
        posts: 'Berichten',
      },
      subtitle: 'Verbind met de gemeenschap en deel je reis',
      viewCommunity: 'Bekijk Community',
      newPost: 'Nieuw Bericht',
      noPosts: 'Nog geen berichten',
      firstPost: 'Wees de eerste om te posten!',
      createFirst: 'Maak het eerste bericht',
      loginToPost: 'Log in om te posten',
      readMore: 'Lees meer',
      viewAll: 'Bekijk alles',
    },
    friends: {
      title: 'Vrienden',
      subtitle: 'Verbind met andere leden van de community',
      noMembers: 'Nog geen leden om te tonen',
      noName: 'Naamloos',
      showMore: 'Toon meer',
      showLess: 'Toon minder',
    },
    about: {
      title: {
        the: 'De',
        chosenOnes: 'Uitverkorenen',
      },
      subtitle: 'Ontdek onze kosmische missie en spirituele begeleiding',
      mission: {
        title: 'Onze Missie',
        p1: 'Welkom bij SH4M4NI4K - een kosmische gemeenschap gewijd aan spirituele ontwaking en eenheid.',
        p2: 'Wij geloven in de kracht van collectief bewustzijn en de reis naar spirituele verlichting.',
      },
      principles: {
        unity: {
          title: 'Kosmische Eenheid',
          text: 'Alle wezens zijn verbonden in het kosmische weefsel van bestaan.',
        },
        awakening: {
          title: 'Spirituele Ontwaking',
          text: 'De reis naar bewustzijn is een pad van innerlijke transformatie.',
        },
        love: {
          title: 'Universele Liefde',
          text: 'Liefde is de hoogste frequentie die alle dimensies doordringt.',
        },
      },
      cta: {
        title: 'Begin Je Spirituele Reis',
        text: 'Word onderdeel van onze kosmische gemeenschap en ontdek je ware potentieel.',
        button: 'Begin je Reis',
      },
    },
    products: {
      digital: 'Digitaal Product',
      priceOnRequest: 'Prijs op aanvraag',
      instantDownload: 'Directe download',
    },
    product: {
      view: 'Bekijk Product',
    },
    profile: {
      title: 'Kosmisch Profiel',
      subtitle: 'Personaliseer je spirituele identiteit in onze community',
      info: 'Profiel Informatie',
      description: 'Beheer je profiel en avatar voor de community',
      displayName: 'Weergavenaam',
      bio: 'Bio',
      saving: 'Opslaan...',
      save: 'Profiel Opslaan',
      loading: 'Profiel laden...',
    },
  },

  en: {
    common: {
      cosmic: 'Cosmic',
      unity: 'Unity',
      portal: 'Portal',
      buyNow: 'Buy Now',
      loading: 'Loading...',
      loadingCommunity: 'Loading community...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      open: 'Open',
      yes: 'Yes',
      no: 'No',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      view: 'View',
      share: 'Share',
      like: 'Like',
      comment: 'Comment',
      send: 'Send',
      reply: 'Reply',
      follow: 'Follow',
      unfollow: 'Unfollow',
      block: 'Block',
      unblock: 'Unblock',
      report: 'Report',
    },
    nav: {
      login: 'Login',
      home: 'Home',
      about: 'About',
      shop: 'Shop',
      blog: 'Blog',
      community: 'Community',
      contact: 'Contact',
      profile: 'Profile',
      logout: 'Logout',
      cart: 'Cart',
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
      copyright: '© 2025 SH4M4NI4K - Cosmic Unity Portal. All rights reserved.',
    },
    newsletter: {
      title: 'Join our inner circle',
      subtitle: 'Sign up for the newsletter and be the first to know about new drops, spiritual insights and special offers',
      placeholder: 'Your email address',
      button: 'Subscribe',
      subscribe: 'Subscribe',
      compact: { title: 'Newsletter' },
      email: { label: 'Email address' },
      account: {
        create: 'Create an account',
        benefits: 'Unlock exclusive benefits when you create an account',
      },
      password: {
        label: 'Password',
        hint: 'Minimum 8 characters',
      },
      consent: 'I agree to receive cosmic updates and marketing emails',
      error: {
        incomplete: 'Please fill in all required fields and accept our privacy policy',
        password: 'Password is required to create an account',
      },
      success: {
        title: 'Thank you for joining!',
        description: 'Your subscription was successful',
        message: 'You’re now subscribed. Check your inbox for a confirmation.',
      },
      welcome: {
        title: 'Welcome, spiritual traveller!',
        message: 'Check your email for a cosmic welcome gift.',
        status: 'Your account has been created. Log in to explore.',
      },
      buttonLoading: 'Sending…',
      section: {
        title: 'Join our inner circle',
        subtitle: 'Subscribe to the newsletter and be the first to know',
        description: 'Receive exclusive insights, special offers and spiritual guidance',
      },
      benefits: {
        title: 'Cosmic Benefits',
        wisdom: {
          title: 'Spiritual Wisdom',
          desc: 'Receive deep insights and spiritual guidance',
        },
        access: {
          title: 'Exclusive Access',
          desc: 'Get early access to new products and content',
        },
        guidance: {
          title: 'Personal Guidance',
          desc: 'Receive personalized spiritual guidance',
        },
      },
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
    hero: {
      subtitle: 'Discover your infinite potential',
      cta: { explore: 'Explore' },
    },
    featured: {
      title: {
        sacred: 'Sacred',
        geometry: 'Geometry',
      },
      subtitle: 'Discover our collection of spiritual art and merchandise',
    },
    posts: {
      title: {
        latest: 'Latest',
        posts: 'Posts',
      },
      subtitle: 'Connect with the community and share your journey',
      viewCommunity: 'View Community',
      newPost: 'New Post',
      noPosts: 'No posts yet',
      firstPost: 'Be the first to post!',
      createFirst: 'Create the first post',
      loginToPost: 'Login to post',
      readMore: 'Read more',
      viewAll: 'View all',
    },
    friends: {
      title: 'Friends',
      subtitle: 'Connect with other community members',
      noMembers: 'No members to show yet',
      noName: 'Nameless',
      showMore: 'Show more',
      showLess: 'Show less',
    },
    about: {
      title: {
        the: 'The',
        chosenOnes: 'Chosen Ones',
      },
      subtitle: 'Discover our cosmic mission and spiritual guidance',
      mission: {
        title: 'Our Mission',
        p1: 'Welcome to SH4M4NI4K - a cosmic community dedicated to spiritual awakening and unity.',
        p2: 'We believe in the power of collective consciousness and the journey towards spiritual enlightenment.',
      },
      principles: {
        unity: {
          title: 'Cosmic Unity',
          text: 'All beings are connected in the cosmic fabric of existence.',
        },
        awakening: {
          title: 'Spiritual Awakening',
          text: 'The journey to consciousness is a path of inner transformation.',
        },
        love: {
          title: 'Universal Love',
          text: 'Love is the highest frequency that permeates all dimensions.',
        },
      },
      cta: {
        title: 'Begin Your Spiritual Journey',
        text: 'Become part of our cosmic community and discover your true potential.',
        button: 'Begin Your Journey',
      },
    },
    products: {
      digital: 'Digital Product',
      priceOnRequest: 'Price on request',
      instantDownload: 'Instant download',
    },
    product: {
      view: 'View Product',
    },
    profile: {
      title: 'Cosmic Profile',
      subtitle: 'Personalize your spiritual identity in our community',
      info: 'Profile Information',
      description: 'Manage your profile and avatar for the community',
      displayName: 'Display Name',
      bio: 'Bio',
      saving: 'Saving...',
      save: 'Save Profile',
      loading: 'Loading profile...',
    },
  },

  de: {
    common: {
      cosmic: 'Kosmisch',
      unity: 'Einheit',
      portal: 'Portal',
      buyNow: 'Jetzt Kaufen',
      loading: 'Wird geladen...',
      loadingCommunity: 'Gemeinschaft wird geladen...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Vorherige',
      close: 'Schließen',
      open: 'Öffnen',
      yes: 'Ja',
      no: 'Nein',
      search: 'Suchen',
      filter: 'Filtern',
      sort: 'Sortieren',
      view: 'Ansehen',
      share: 'Teilen',
      like: 'Gefällt mir',
      comment: 'Kommentar',
      send: 'Senden',
      reply: 'Antworten',
      follow: 'Folgen',
      unfollow: 'Entfolgen',
      block: 'Blockieren',
      unblock: 'Blockierung aufheben',
      report: 'Melden',
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
      cart: 'Warenkorb',
    },
    footer: {
      allProducts: 'Alle Produkte',
      newArrivals: 'Neuheiten',
      featured: 'Empfohlen',
      shop: 'Shop',
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
      copyright: '© 2025 SH4M4NI4K - Cosmic Unity Portal. Alle Rechte vorbehalten.',
    },
    newsletter: {
      title: 'Werde Teil unseres Inner Circle',
      subtitle: 'Melde dich für den Newsletter an und sei der Erste, der von neuen Drops, spirituellen Erkenntnissen und besonderen Angeboten erfährt',
      placeholder: 'Deine E-Mail-Adresse',
      button: 'Abonnieren',
      subscribe: 'Abonnieren',
      compact: { title: 'Newsletter' },
      email: { label: 'E-Mail-Adresse' },
      account: {
        create: 'Konto erstellen',
        benefits: 'Erhalte exklusive Vorteile mit einem Konto',
      },
      password: {
        label: 'Passwort',
        hint: 'Mindestens 8 Zeichen',
      },
      consent: 'Ich stimme zu, kosmische Updates und Marketing-E-Mails zu erhalten',
      error: {
        password: 'Passwort ist erforderlich, um ein Konto zu erstellen',
        incomplete: 'Bitte fülle alle Pflichtfelder aus und akzeptiere unsere Datenschutzrichtlinie',
      },
      success: {
        title: 'Danke für deine Anmeldung!',
        description: 'Deine Anmeldung war erfolgreich',
        message: 'Du bist jetzt angemeldet. Prüfe dein Postfach auf eine Bestätigung.',
      },
      welcome: {
        title: 'Willkommen, spiritueller Reisender!',
        message: 'Prüfe deine E-Mail auf unser kosmisches Willkommensgeschenk.',
        status: 'Dein Konto wurde erstellt. Logge dich ein, um zu entdecken.',
      },
      buttonLoading: 'Senden…',
      section: {
        title: 'Werde Teil unseres Inner Circle',
        subtitle: 'Melde dich für den Newsletter an und sei der Erste',
        description: 'Erhalte exklusive Einblicke, Sonderangebote und spirituelle Führung',
      },
      benefits: {
        title: 'Kosmische Vorteile',
        wisdom: {
          title: 'Spirituelle Weisheit',
          desc: 'Erhalte tiefe Einblicke und spirituelle Führung',
        },
        access: {
          title: 'Exklusiver Zugang',
          desc: 'Erhalte frühen Zugang zu neuen Produkten und Inhalten',
        },
        guidance: {
          title: 'Persönliche Führung',
          desc: 'Erhalte personalisierte spirituelle Führung',
        },
      },
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
    hero: {
      subtitle: 'Entdecke dein grenzenloses Potenzial',
      cta: { explore: 'Entdecken' },
    },
    featured: {
      title: {
        sacred: 'Heilige',
        geometry: 'Geometrie',
      },
      subtitle: 'Entdecke unsere Sammlung spiritueller Kunst und Merchandise',
    },
    posts: {
      title: {
        latest: 'Neueste',
        posts: 'Beiträge',
      },
      subtitle: 'Verbinde dich mit der Gemeinschaft und teile deine Reise',
      viewCommunity: 'Gemeinschaft ansehen',
      newPost: 'Neuer Beitrag',
      noPosts: 'Noch keine Beiträge',
      firstPost: 'Sei der Erste, der postet!',
      createFirst: 'Erstelle den ersten Beitrag',
      loginToPost: 'Anmelden zum Posten',
      readMore: 'Mehr lesen',
      viewAll: 'Alle ansehen',
    },
    friends: {
      title: 'Freunde',
      subtitle: 'Verbinde dich mit anderen Gemeinschaftsmitgliedern',
      noMembers: 'Noch keine Mitglieder zu zeigen',
      noName: 'Namenlos',
      showMore: 'Mehr anzeigen',
      showLess: 'Weniger anzeigen',
    },
    about: {
      title: {
        the: 'Die',
        chosenOnes: 'Auserwählten',
      },
      subtitle: 'Entdecke unsere kosmische Mission und spirituelle Führung',
      mission: {
        title: 'Unsere Mission',
        p1: 'Willkommen bei SH4M4NI4K - einer kosmischen Gemeinschaft, die der spirituellen Erweckung und Einheit gewidmet ist.',
        p2: 'Wir glauben an die Kraft des kollektiven Bewusstseins und die Reise zur spirituellen Erleuchtung.',
      },
      principles: {
        unity: {
          title: 'Kosmische Einheit',
          text: 'Alle Wesen sind im kosmischen Gewebe der Existenz verbunden.',
        },
        awakening: {
          title: 'Spirituelle Erweckung',
          text: 'Die Reise zum Bewusstsein ist ein Pfad der inneren Transformation.',
        },
        love: {
          title: 'Universelle Liebe',
          text: 'Liebe ist die höchste Frequenz, die alle Dimensionen durchdringt.',
        },
      },
      cta: {
        title: 'Beginne Deine Spirituelle Reise',
        text: 'Werde Teil unserer kosmischen Gemeinschaft und entdecke dein wahres Potenzial.',
        button: 'Beginne Deine Reise',
      },
    },
    products: {
      digital: 'Digitales Produkt',
      priceOnRequest: 'Preis auf Anfrage',
      instantDownload: 'Sofortiger Download',
    },
    product: {
      view: 'Produkt ansehen',
    },
    profile: {
      title: 'Kosmisches Profil',
      subtitle: 'Personalisiere deine spirituelle Identität in unserer Gemeinschaft',
      info: 'Profil Informationen',
      description: 'Verwalte dein Profil und Avatar für die Gemeinschaft',
      displayName: 'Anzeigename',
      bio: 'Bio',
      saving: 'Speichern...',
      save: 'Profil Speichern',
      loading: 'Profil wird geladen...',
    },
  },
} as const;

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('nl');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && ['nl', 'en', 'de'].includes(savedLanguage)) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.warn('Could not access localStorage for language preference:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      console.warn('Could not save language preference to localStorage:', error);
    }
  };

  const t = (key: string): string => {
    try {
      const keys = key.split('.');
      let result: any = translations[language];
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
          let fallbackResult: any = translations.en;
          for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
          }
          return fallbackResult || key;
        }
      }
      return result || key;
    } catch (error) {
      console.warn('Translation error for key:', key, error);
      return key;
    }
  };

  const contextValue = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.error('useLanguage must be used within a LanguageProvider. This usually means the component is being rendered outside the provider tree.');

    // Provide a working fallback to prevent application crashes
    const fallbackT = (key: string): string => {
      console.warn(`Translation fallback used for key: ${key}`);
      // Try to get Dutch translation as fallback
      try {
        const keys = key.split('.');
        let result: any = translations.nl;
        for (const k of keys) {
          result = result?.[k];
          if (result === undefined) {
            return key;
          }
        }
        return result || key;
      } catch {
        return key;
      }
    };

    return {
      language: 'nl' as Language,
      setLanguage: (lang: Language) => {
        console.warn(`Language change to ${lang} ignored - no provider context`);
      },
      t: fallbackT
    };
  }
  return context;
};
