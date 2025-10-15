import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Star } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface Book {
  id: string;
  title: string;
  subtitle: string;
  bookNumber: number;
  pages: number;
  price: string;
  originalPrice: string;
  link: string;
  description: string;
}

const books: Book[] = [
  {
    id: '1',
    title: "The 'Real' World",
    subtitle: "Discover the Truth Behind the Illusion",
    bookNumber: 1,
    pages: 17,
    price: "$3.91",
    originalPrice: "$5.87",
    link: "https://play.google.com/store/books/details?id=QN1hEQAAQBAJ",
    description: "Begin your journey of awakening and discover the truth behind the illusion of the 'real' world. The first step in your spiritual transformation."
  },
  {
    id: '2',
    title: "The Truth that Sets Free",
    subtitle: "A Spiritual Awakening for the New Age",
    bookNumber: 2,
    pages: 17,
    price: "$3.91",
    originalPrice: "$5.87",
    link: "https://play.google.com/store/books/details?id=It1hEQAAQBAJ",
    description: "A radical invitation to inner surrender, ego-letting and rediscovering your divine origin. No dogma, no theory – but direct recognition and memory."
  },
  {
    id: '3',
    title: "Unity Unveiled",
    subtitle: "Where Religion, Science and Spirituality Merge into Reality",
    bookNumber: 3,
    pages: 27,
    price: "$3.91",
    originalPrice: "$5.87",
    link: "https://play.google.com/store/books/details?id=0d1hEQAAQBAJ",
    description: "A groundbreaking eBook revealing how religion, science and spirituality are expressions of one underlying truth: the Oneness that permeates all."
  }
];

const BooksSection = () => {
  const { t } = useLanguage();

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
            A sacred trilogy guiding you from illusion to truth, from ego to liberation, from separation to unity.
            Written from direct knowing, not belief.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-cosmic/10 rounded-full border border-cosmic/30">
            <Star className="w-4 h-4 text-cosmic" />
            <span className="font-mystical text-sm text-cosmic">
              By Dennis Erens • The Chosen Ones Merchandise
            </span>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {books.map((book) => (
            <Card key={book.id} className="cosmic-hover group overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm h-full flex flex-col">
              <CardHeader className="relative">
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-cosmic-gradient text-white shadow-lg">
                    Book {book.bookNumber}
                  </Badge>
                </div>
                
                <div className="aspect-[3/4] bg-gradient-to-br from-cosmic/20 to-mystical/20 rounded-lg overflow-hidden relative mb-4 flex items-center justify-center">
                  <div className="text-center p-6">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-cosmic animate-pulse" />
                    <div className="space-y-2">
                      <p className="font-cosmic text-sm text-cosmic-gradient">Trinity of</p>
                      <p className="font-cosmic text-sm text-mystical-gradient">Transformation</p>
                      <p className="font-mystical text-xs text-muted-foreground mt-4">Book {book.bookNumber}</p>
                    </div>
                  </div>
                </div>

                <CardTitle className="font-cosmic text-xl text-cosmic-gradient line-clamp-2">
                  {book.title}
                </CardTitle>
                
                <CardDescription className="font-mystical text-sm line-clamp-2">
                  {book.subtitle}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="font-mystical text-sm text-muted-foreground line-clamp-4 mb-4">
                  {book.description}
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
                    {book.pages} pages
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
                    href={book.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View on Google Play
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
              About the Author
            </h3>
            <p className="font-mystical text-muted-foreground leading-relaxed">
              Dennis Erens is a visionary author, speaker, and the creator of The Chosen Ones Merchandise and SH4M4NI4K.NL. 
              His work bridges the realms of spirituality, science, and sovereign awakening. After a life-altering experience 
              beyond time and space, he committed himself to exposing control systems and guiding others toward multidimensional liberation.
            </p>
            <p className="font-mystical text-muted-foreground leading-relaxed mt-4">
              Dennis writes from direct knowing, not belief. With clarity, depth, and cosmic humor, he invites readers to awaken 
              to their true essence — the unshakable I AM presence behind all illusion. His message is not just a teaching, 
              but a frequency: liberating, activating, and impossible to un-know once felt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BooksSection;

