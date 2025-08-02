import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Zap } from 'lucide-react';
import cosmicHero from '@/assets/cosmic-hero.jpg';

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${cosmicHero})` }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        </div>

        {/* Sacred Geometry Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-cosmic rounded-full animate-mystical-float"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-accent rotate-45 animate-cosmic-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-secondary rounded-full animate-mystical-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Sacred Symbol */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-divine animate-cosmic-pulse">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-6 bg-cosmic/20 rounded-full animate-mystical-float"></div>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="font-cosmic text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-cosmic-gradient animate-cosmic-pulse">DigiTemple</span>
            <br />
            <span className="text-mystical-gradient">Under Construction</span>
          </h1>

          {/* Sacred Message */}
          <div className="mb-12">
            <p className="font-mystical text-2xl md:text-3xl text-cosmic-gradient mb-6 animate-mystical-float">
              "The Creator of this will Dwell in this Temple soon"
            </p>
            
            <div className="flex justify-center mb-8">
              <div className="w-16 h-1 bg-cosmic-gradient rounded-full"></div>
            </div>
            
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              Something magnificent is being built in the cosmic realm. The digital temple awaits its divine architect.
            </p>
          </div>

          {/* Back to Home */}
          <Link to="/">
            <Button variant="cosmic" size="lg" className="group">
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Return to Portal
            </Button>
          </Link>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-cosmic rounded-full animate-mystical-float opacity-60"></div>
          <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-accent rounded-full animate-cosmic-pulse opacity-80"></div>
          <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-secondary rounded-full animate-mystical-float opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-mystical rounded-full animate-cosmic-pulse opacity-70" style={{ animationDelay: '3s' }}></div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UnderConstruction;