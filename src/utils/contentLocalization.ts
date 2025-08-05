// Content localization utilities for handling multilingual Shopify content

interface LocalizedContent {
  title: string;
  description: string;
}

// Manual translations for products that might not have Shopify translations
const productTranslations: Record<string, Record<string, LocalizedContent>> = {
  'trinity-transformatie': {
    nl: {
      title: 'Trinity van Transformatie',
      description: 'Een krachtige gids voor spirituele transformatie door de drievoudige weg van bewustzijn, liefde en wijsheid.'
    },
    en: {
      title: 'Trinity of Transformation',
      description: 'A powerful guide for spiritual transformation through the threefold path of consciousness, love and wisdom.'
    },
    de: {
      title: 'Trinität der Transformation',
      description: 'Ein kraftvoller Leitfaden für spirituelle Transformation durch den dreifachen Pfad von Bewusstsein, Liebe und Weisheit.'
    }
  },
  'the-real-world': {
    nl: {
      title: 'De Echte Wereld',
      description: 'Ontdek de waarheid achter de illusie en stap uit de matrix van beperkt denken.'
    },
    en: {
      title: 'The Real World',
      description: 'Discover the truth behind the illusion and step out of the matrix of limited thinking.'
    },
    de: {
      title: 'Die Wahre Welt',
      description: 'Entdecke die Wahrheit hinter der Illusion und tritt aus der Matrix des begrenzten Denkens heraus.'
    }
  },
  'the-truth-that-sets-free': {
    nl: {
      title: 'De Waarheid die werkelijk Bevrijdt',
      description: 'De ultieme waarheid die je bevrijdt van alle beperkingen en je ware natuur openbaart.'
    },
    en: {
      title: 'The Truth That Truly Liberates',
      description: 'The ultimate truth that liberates you from all limitations and reveals your true nature.'
    },
    de: {
      title: 'Die Wahrheit, die wirklich befreit',
      description: 'Die ultimative Wahrheit, die dich von allen Begrenzungen befreit und deine wahre Natur offenbart.'
    }
  },
  'eenheid-ontsluierd': {
    nl: {
      title: 'Eenheid Ontsluierd',
      description: 'Een diepe duik in de mystieke ervaring van eenheid en verbondenheid met alles wat is.'
    },
    en: {
      title: 'Unity Unveiled',
      description: 'A deep dive into the mystical experience of unity and connection with all that is.'
    },
    de: {
      title: 'Einheit Entschleiert',
      description: 'Ein tiefer Einblick in die mystische Erfahrung der Einheit und Verbindung mit allem was ist.'
    }
  },
  'lightbody-mastery': {
    nl: {
      title: 'Lightbody Mastery',
      description: 'Leer je lichtklichaam te activeren en te beheersen voor spirituele ascensie.'
    },
    en: {
      title: 'Lightbody Mastery',
      description: 'Learn to activate and master your light body for spiritual ascension.'
    },
    de: {
      title: 'Lichtkörper-Meisterschaft',
      description: 'Lerne deinen Lichtkörper zu aktivieren und zu beherrschen für spirituelle Aufstieg.'
    }
  },
  'universal-god-interface': {
    nl: {
      title: 'Universal God Interface',
      description: 'De directe interface met de goddelijke intelligentie van het universum.'
    },
    en: {
      title: 'Universal God Interface',
      description: 'The direct interface with the divine intelligence of the universe.'
    },
    de: {
      title: 'Universelle Gott-Schnittstelle',
      description: 'Die direkte Schnittstelle zur göttlichen Intelligenz des Universums.'
    }
  },
  'universal-health-interface': {
    nl: {
      title: 'Universal Health Interface',
      description: 'Toegang tot universele genezing en optimale gezondheid door bewustzijn.'
    },
    en: {
      title: 'Universal Health Interface',
      description: 'Access to universal healing and optimal health through consciousness.'
    },
    de: {
      title: 'Universelle Gesundheits-Schnittstelle',
      description: 'Zugang zu universeller Heilung und optimaler Gesundheit durch Bewusstsein.'
    }
  }
};

// Collection translations
const collectionTranslations: Record<string, Record<string, LocalizedContent>> = {
  'digital-products': {
    nl: {
      title: 'Digitale Producten',
      description: 'Transformerende digitale gidsen voor spirituele groei en bewustzijnsontwikkeling.'
    },
    en: {
      title: 'Digital Products',
      description: 'Transformative digital guides for spiritual growth and consciousness development.'
    },
    de: {
      title: 'Digitale Produkte',
      description: 'Transformierende digitale Leitfäden für spirituelles Wachstum und Bewusstseinsentwicklung.'
    }
  }
};

// Blog translations for handles
const blogTranslations: Record<string, Record<string, LocalizedContent>> = {
  'unity': {
    nl: {
      title: 'Eenheid',
      description: 'Berichten over kosmische eenheid en universele verbondenheid.'
    },
    en: {
      title: 'Unity',
      description: 'Messages about cosmic unity and universal connection.'
    },
    de: {
      title: 'Einheit',
      description: 'Nachrichten über kosmische Einheit und universelle Verbindung.'
    }
  },
  'ego-to-eden': {
    nl: {
      title: 'Van Ego naar Eden',
      description: 'De transformatie van ego-bewustzijn naar paradijselijke staat van zijn.'
    },
    en: {
      title: 'From Ego to Eden',
      description: 'The transformation from ego consciousness to paradisiacal state of being.'
    },
    de: {
      title: 'Vom Ego zum Eden',
      description: 'Die Transformation vom Ego-Bewusstsein zum paradiesischen Seinszustand.'
    }
  }
};

export const getLocalizedProductContent = (handle: string, language: string, fallbackContent?: { title: string; description: string }): LocalizedContent => {
  const translations = productTranslations[handle];
  
  if (translations && translations[language]) {
    return translations[language];
  }
  
  // Fallback to original content if available
  if (fallbackContent) {
    return fallbackContent;
  }
  
  // Final fallback to English or empty
  if (translations && translations.en) {
    return translations.en;
  }
  
  return {
    title: handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Spirituele gids voor bewustzijnsontwikkeling en transformatie.'
  };
};

export const getLocalizedCollectionContent = (handle: string, language: string, fallbackContent?: { title: string; description: string }): LocalizedContent => {
  const translations = collectionTranslations[handle];
  
  if (translations && translations[language]) {
    return translations[language];
  }
  
  if (fallbackContent) {
    return fallbackContent;
  }
  
  if (translations && translations.en) {
    return translations.en;
  }
  
  return {
    title: handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Spirituele collectie voor transformatie en groei.'
  };
};

export const getLocalizedBlogContent = (handle: string, language: string, fallbackContent?: { title: string; description: string }): LocalizedContent => {
  const translations = blogTranslations[handle];
  
  if (translations && translations[language]) {
    return translations[language];
  }
  
  if (fallbackContent) {
    return fallbackContent;
  }
  
  if (translations && translations.en) {
    return translations.en;
  }
  
  return {
    title: handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Spirituele blog voor inzicht en inspiratie.'
  };
};