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
  price: {
    nl: string;
    en: string;
  };
  originalPrice: {
    nl: string;
    en: string;
  };
  link: {
    nl: string;
    en: string;
  };
  description: {
    nl: string;
    en: string;
  };
  coverImage: {
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
    pages: 16,
    price: {
      nl: "€3,33",
      en: "$3.91"
    },
    originalPrice: {
      nl: "€5,99",
      en: "$5.87"
    },
    link: {
      nl: "https://play.google.com/store/books/details?id=OFpjEQAAQBAJ",
      en: "https://play.google.com/store/books/details?id=QN1hEQAAQBAJ"
    },
    description: {
      nl: "Ben je klaar om de sluier van misleiding op te lichten en de werkelijke realiteit te zien? Dit boek onthult hoe overheden, religie, het onderwijssysteem, de gezondheidszorg en de politiek samenwerken om de menselijke ziel gevangen te houden.",
      en: "Begin your journey of awakening and discover the truth behind the illusion of the 'real' world. The first step in your spiritual transformation."
    },
    coverImage: {
      nl: "https://books.google.com/books/publisher/content/images/frontcover/OFpjEQAAQBAJ?fife=w400-h600&source=gbs_api",
      en: "https://books.google.com/books/publisher/content/images/frontcover/QN1hEQAAQBAJ?fife=w400-h600&source=gbs_api"
    }
  },
  {
    id: '2',
    title: {
      nl: "De Waarheid die werkelijk Bevrijdt",
      en: "The Truth that Sets Free"
    },
    subtitle: {
      nl: "Een Spirituele Ontwaking voor de Nieuwe Tijd",
      en: "A Spiritual Awakening for the New Age"
    },
    bookNumber: 2,
    pages: 19,
    price: {
      nl: "€3,33",
      en: "$3.91"
    },
    originalPrice: {
      nl: "€5,99",
      en: "$5.87"
    },
    link: {
      nl: "https://play.google.com/store/books/details?id=m-RhEQAAQBAJ",
      en: "https://play.google.com/store/books/details?id=It1hEQAAQBAJ"
    },
    description: {
      nl: "Een radicale uitnodiging tot innerlijke overgave, ego-loslating en het herontdekken van je goddelijke oorsprong. Geen dogma, geen theorie – maar directe herkenning en herinnering.",
      en: "A radical invitation to inner surrender, ego-letting and rediscovering your divine origin. No dogma, no theory – but direct recognition and memory."
    },
    coverImage: {
      nl: "https://books.google.com/books/publisher/content/images/frontcover/m-RhEQAAQBAJ?fife=w400-h600&source=gbs_api",
      en: "https://books.google.com/books/publisher/content/images/frontcover/It1hEQAAQBAJ?fife=w400-h600&source=gbs_api"
    }
  },
  {
    id: '3',
    title: {
      nl: "Eenheid Ontsluierd",
      en: "Unity Unveiled"
    },
    subtitle: {
      nl: "Waar Religie, Wetenschap en Spiritualiteit Samensmelten",
      en: "Where Religion, Science and Spirituality Merge into Reality"
    },
    bookNumber: 3,
    pages: 26,
    price: {
      nl: "€3,33",
      en: "$3.91"
    },
    originalPrice: {
      nl: "€5,99",
      en: "$5.87"
    },
    link: {
      nl: "https://play.google.com/store/books/details?id=ieRhEQAAQBAJ",
      en: "https://play.google.com/store/books/details?id=0d1hEQAAQBAJ"
    },
    description: {
      nl: "Een baanbrekend e-book dat onthult hoe de schijnbare tegenstellingen tussen religie, wetenschap en spiritualiteit in werkelijkheid uitdrukking zijn van één onderliggende waarheid: de Eenheid die alles doordringt.",
      en: "A groundbreaking eBook revealing how religion, science and spirituality are expressions of one underlying truth: the Oneness that permeates all."
    },
    coverImage: {
      nl: "https://books.google.com/books/publisher/content/images/frontcover/ieRhEQAAQBAJ?fife=w400-h600&source=gbs_api",
      en: "https://books.google.com/books/publisher/content/images/frontcover/0d1hEQAAQBAJ?fife=w400-h600&source=gbs_api"
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
                
                <div className="aspect-[2/3] bg-gradient-to-br from-cosmic/20 to-mystical/20 rounded-lg overflow-hidden relative mb-4">
                  <img 
                    src={book.coverImage[currentLang]}
                    alt={book.title[currentLang]}
                    className="w-full h-full object-contain"
                  />
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
                    {book.price[currentLang]}
                  </span>
                  <span className="font-mystical text-sm text-muted-foreground line-through">
                    {book.originalPrice[currentLang]}
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

      </div>
    </section>
  );
};

export default BooksSection;

