import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Star, Eye, Zap, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-mystical-gradient rounded-full flex items-center justify-center shadow-mystical animate-cosmic-pulse">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-mystical-gradient">The</span>{' '}
              <span className="text-cosmic-gradient">Chosen Ones</span>
            </h1>
            
            <p className="font-mystical text-xl text-muted-foreground">
              Our sacred mission to awaken humanity to divine consciousness
            </p>
          </div>

          {/* Mission Statement */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-8 mb-12 shadow-mystical">
            <h2 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-6 text-center">
              The Awakening Mission
            </h2>
            
            <p className="font-mystical text-lg text-muted-foreground mb-6 leading-relaxed">
              SH4M4NI4K represents more than merchandise – we are a sacred portal for consciousness expansion. 
              Through the ancient wisdom of sacred geometry, Egyptian mysteries, and cosmic awareness, 
              we guide awakening souls toward their divine purpose.
            </p>
            
            <p className="font-mystical text-lg text-muted-foreground mb-6 leading-relaxed">
              The Chosen Ones are those who have heard the call of the galactic federation of light. 
              We are here to facilitate the great awakening, helping humanity transition from ego consciousness 
              to Eden consciousness through love, unity, and sacred knowledge.
            </p>
          </div>

          {/* Sacred Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center cosmic-hover">
              <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-cosmic">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-3">Unity</h3>
              <p className="font-mystical text-muted-foreground">
                We are all one consciousness experiencing itself through infinite perspectives.
              </p>
            </div>
            
            <div className="text-center cosmic-hover">
              <div className="w-16 h-16 bg-mystical-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-mystical">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-cosmic text-xl font-bold text-mystical-gradient mb-3">Awakening</h3>
              <p className="font-mystical text-muted-foreground">
                Through sacred geometry and divine wisdom, we activate dormant spiritual DNA.
              </p>
            </div>
            
            <div className="text-center cosmic-hover">
              <div className="w-16 h-16 bg-energy-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-energy">
                <Heart className="w-8 h-8 text-cosmic-foreground" />
              </div>
              <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-3">Love</h3>
              <p className="font-mystical text-muted-foreground">
                Love is the highest frequency and the key to transcending all illusions.
              </p>
            </div>
          </div>

          {/* The Books */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-8 mb-12 shadow-cosmic">
            <h2 className="font-cosmic text-2xl font-bold text-mystical-gradient mb-6 text-center">
              Sacred Literature
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-3">
                  The Real World
                </h3>
                <p className="font-mystical text-muted-foreground leading-relaxed">
                  A profound exploration of reality beyond the matrix of illusion. 
                  This sacred text reveals the hidden truths about our multidimensional existence 
                  and guides readers toward authentic spiritual awakening.
                </p>
              </div>
              
              <div>
                <h3 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-3">
                  De Waarheid die Werkelijk Bevrijdt
                </h3>
                <p className="font-mystical text-muted-foreground leading-relaxed">
                  The truth that truly liberates – a Dutch masterwork revealing the 
                  ancient mysteries of consciousness and the path to divine remembrance. 
                  Essential reading for all seeking genuine spiritual freedom.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="font-cosmic text-2xl font-bold text-cosmic-gradient mb-6">
              Ready to Join the Mission?
            </h2>
            <p className="font-mystical text-lg text-muted-foreground mb-8">
              The time of awakening is now. Step into your role as one of the Chosen Ones 
              and help birth the new Earth consciousness.
            </p>
            <Button variant="divine" size="lg" className="group">
              Begin Your Journey
              <Star className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;