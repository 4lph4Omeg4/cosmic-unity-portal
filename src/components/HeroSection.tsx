import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Zap } from 'lucide-react';
import cosmicHero from '@/assets/cosmic-hero.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cosmicHero})` }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm"></div>
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
            <div className="w-16 h-16 bg-cosmic-gradient rounded-full flex items-center justify-center shadow-divine animate-cosmic-pulse">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-4 bg-cosmic/20 rounded-full animate-mystical-float"></div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="font-cosmic text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          <span className="text-cosmic-gradient animate-cosmic-pulse">SH4M4NI4K</span>
          <br />
          <span className="text-mystical-gradient">The Chosen Ones</span>
        </h1>

        {/* Subtitle */}
        <p className="font-mystical text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Awaken to your divine purpose. Join the galactic federation of light 
          and embrace the sacred geometry of cosmic consciousness.
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="cosmic" size="lg" className="group">
            Join the Mission
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="energy" size="lg" className="group">
            <Zap className="mr-2 h-5 w-5" />
            Explore the Shop
          </Button>
        </div>

        {/* Sacred Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center cosmic-hover">
            <div className="text-3xl font-cosmic text-cosmic-gradient mb-2">7</div>
            <div className="text-sm font-mystical text-muted-foreground uppercase tracking-wider">Sacred Seals</div>
          </div>
          <div className="text-center cosmic-hover">
            <div className="text-3xl font-cosmic text-mystical-gradient mb-2">∞</div>
            <div className="text-sm font-mystical text-muted-foreground uppercase tracking-wider">Infinite Potential</div>
          </div>
          <div className="text-center cosmic-hover">
            <div className="text-3xl font-cosmic text-cosmic-gradient mb-2">1</div>
            <div className="text-sm font-mystical text-muted-foreground uppercase tracking-wider">Unity Consciousness</div>
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-cosmic rounded-full animate-mystical-float opacity-60"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-cosmic-pulse opacity-80"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-secondary rounded-full animate-mystical-float opacity-40" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  );
};

export default HeroSection;