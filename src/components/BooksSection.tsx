import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Book {
  id: string;
  title: {
    nl: string;
    en: string;
  };
  subtitle: {
    nl: string;
    en: string;
  };
  bookNumber: number;
  pages: number;
  price: string;
  originalPrice: string;
  link: {
    nl: string;
    en: string;
  };
  description: {
    nl: string;
    en: string;
  };
}

const books: Book[] = [
  {
    id: '1',
    title: {
      nl: "De 'Echte' Wereld",
      en: "The 'Real' World"
    },
    subtitle: {
      nl: "Ontdek de Waarheid Achter de Illusie",
      en: "Discover the Truth Behind the Illusion"
    },
    bookNumber: 1,
    pages: 17,
    price: "$3.91",
    originalPrice: "$5.87",
    link: {
      nl: "https://play.google.com/store/books/details?id=QN1hEQAAQBAJ",
      en: "https://play.google.com/store/books/details?id=QN1hEQAAQBAJ" // Update with EN version if different
    },
    description: {
      nl: "Begin je reis van ontwaken en ontdek de waarheid achter de illusie van de 'echte' wereld. De eerste stap in je spirituele transformatie.",
      en: "Begin your journey of awakening and discover the truth behind the illusion of the 'real' world. The first step in your spiritual transformation."
    }
  },
  {
    id: '2',
    title: {
      nl: "De Waarheid Die Echt Bevrijdt",
      en: "The Truth that Sets Free"
    },
    subtitle: {
      nl: "Een Spiritueel Ontwaken voor het Nieuwe Tijdperk",
      en: "A Spiritual Awakening for the New Age"
    },
    bookNumber: 2,
    pages: 17,
    price: "$3.91",
    originalPrice: "$5.87",
    link: {
      nl: "https://play.google.com/store/books/details?id=It1hEQAAQBAJ",
      en: "https://play.google.com/store/books/details?id=It1hEQAAQBAJ" // Update with EN version if different
    },
    description: {
      nl: "Een radicale uitnodiging tot innerlijke overgave, ego-loslating en het herontdekken van je goddelijke oorsprong. Geen dogma's, geen theorie – maar directe herkenning en herinnering.",
      en: "A radical invitation to inner surrender, ego-letting and rediscovering your divine origin. No dogma, no theory – but direct recognition and memory."
    }
  },
  {
    id: '3',
    title: {
      nl: "Eenheid Onthuld",
      en: "Unity Unveiled"
    },
    subtitle: {
      nl: "Waar Religie, Wetenschap en Spiritualiteit Samensmelten tot Realiteit",
      en: "Where Religion, Science and Spirituality Merge into Reality"
    },
    bookNumber: 3,
    pages: 27,
    price: "$3.91",
    originalPrice: "$5.87",
    link: {
      nl: "https://play.google.com/store/books/details?id=0d1hEQAAQBAJ",
      en: "https://play.google.com/store/books/details?id=0d1hEQAAQBAJ" // Update with EN version if different
    },
    description: {
      nl: "Een baanbrekend eBook dat onthult hoe religie, wetenschap en spiritualiteit uitdrukkingen zijn van één onderliggende waarheid: de Eenheid die alles doordringt.",
      en: "A groundbreaking eBook revealing how religion, science and spirituality are expressions of one underlying truth: the Oneness that permeates all."
    }
  }
];

const BooksSection = () => {
  const { t, language } = useLanguage();
  const currentLang = (language === 'en' || language === 'de') ? 'en' : 'nl';

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-card/30 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-cosmic animate-cosmic-pulse">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <h2 className="font-cosmic text-3xl md:text-5xl font-bold mb-6">
            <span className="text-cosmic-gradient">Trinity of Transformation</span>
          </h2>
          
          <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentLang === 'nl' 
              ? 'Een heilige trilogie die je begeleidt van illusie naar waarheid, van ego naar bevrijding, van scheiding naar eenheid. Geschreven vanuit directe kennis, niet vanuit geloof.'
              : 'A sacred trilogy guiding you from illusion to truth, from ego to liberation, from separation to unity. Written from direct knowing, not belief.'
            }
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-cosmic/10 rounded-full border border-cosmic/30">
            <Star className="w-4 h-4 text-cosmic" />
            <span className="font-mystical text-sm text-cosmic">
              {currentLang === 'nl' 
                ? 'Door Dennis Erens • The Chosen Ones Merchandise'
                : 'By Dennis Erens • The Chosen Ones Merchandise'
              }
            </span>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {books.map((book) => (
            <Card key={book.id} className="cosmic-hover group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="secondary" className="bg-cosmic-gradient text-white shadow-lg">
                    {currentLang === 'nl' ? 'Boek' : 'Book'} {book.bookNumber}
                  </Badge>
                </div>
                
                <div className="aspect-[3/4] bg-gradient-to-br from-cosmic/20 to-mystical/20 rounded-lg overflow-hidden relative mb-4">
                  <img 
                    src={`https://play-lh.googleusercontent.com/books/images?id=${book.link[currentLang].split('id=')[1]}&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api`}
                    alt={book.title[currentLang]}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 items-center justify-center text-center p-6 hidden">
                    <div>
                      <BookOpen className="w-16 h-16 mx-auto mb-4 text-cosmic animate-pulse" />
                      <div className="space-y-2">
                        <p className="font-cosmic text-sm text-cosmic-gradient">Trinity of</p>
                        <p className="font-cosmic text-sm text-mystical-gradient">Transformation</p>
                        <p className="font-mystical text-xs text-muted-foreground mt-4">
                          {currentLang === 'nl' ? 'Boek' : 'Book'} {book.bookNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <CardTitle className="font-cosmic text-xl text-cosmic-gradient line-clamp-2">
                  {book.title[currentLang]}
                </CardTitle>
                
                <CardDescription className="font-mystical text-sm line-clamp-2">
                  {book.subtitle[currentLang]}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="font-mystical text-sm text-muted-foreground line-clamp-4 mb-4">
                  {book.description[currentLang]}
                </p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-cosmic text-2xl font-bold text-cosmic-gradient">
                    {book.price}
                  </span>
                  <span className="font-mystical text-sm text-muted-foreground line-through">
                    {book.originalPrice}
                  </span>
                </div>

                {book.pages > 0 && (
                  <p className="font-mystical text-xs text-muted-foreground">
                    {book.pages} {currentLang === 'nl' ? 'pagina\'s' : 'pages'}
                  </p>
                )}
              </CardContent>
              
              <CardFooter>
                <Button
                  variant="cosmic"
                  size="lg"
                  className="w-full group shadow-cosmic"
                  asChild
                >
                  <a 
                    href={book.link[currentLang]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    {currentLang === 'nl' ? 'Bekijk op Google Play' : 'View on Google Play'}
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Author Bio */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <div className="p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-border/30">
            <h3 className="font-cosmic text-2xl font-bold text-mystical-gradient mb-4">
              {currentLang === 'nl' ? 'Over de Auteur' : 'About the Author'}
            </h3>
            <p className="font-mystical text-muted-foreground leading-relaxed">
              {currentLang === 'nl' 
                ? 'Dennis Erens is een visionair auteur, spreker en de bedenker van The Chosen Ones Merchandise en SH4M4NI4K.NL. Zijn werk verbindt de domeinen van spiritualiteit, wetenschap en soeverein ontwaken. Na een levensveranderende ervaring buiten tijd en ruimte, wijdde hij zich aan het ontmaskeren van controlesystemen en het begeleiden van anderen naar multidimensionale bevrijding.'
                : 'Dennis Erens is a visionary author, speaker, and the creator of The Chosen Ones Merchandise and SH4M4NI4K.NL. His work bridges the realms of spirituality, science, and sovereign awakening. After a life-altering experience beyond time and space, he committed himself to exposing control systems and guiding others toward multidimensional liberation.'
              }
            </p>
            <p className="font-mystical text-muted-foreground leading-relaxed mt-4">
              {currentLang === 'nl'
                ? 'Dennis schrijft vanuit directe kennis, niet vanuit geloof. Met helderheid, diepgang en kosmische humor nodigt hij lezers uit om te ontwaken tot hun ware essentie — de onwrikbare IK BEN aanwezigheid achter alle illusie. Zijn boodschap is niet alleen een leer, maar een frequentie: bevrijdend, activerend en onmogelijk om te ont-weten eenmaal gevoeld.'
                : 'Dennis writes from direct knowing, not belief. With clarity, depth, and cosmic humor, he invites readers to awaken to their true essence — the unshakable I AM presence behind all illusion. His message is not just a teaching, but a frequency: liberating, activating, and impossible to un-know once felt.'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BooksSection;

