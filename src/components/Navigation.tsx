import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Menu, X, Star, Home, BookOpen, Mail, Users } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const timelineAlchemyEntryHref = 'https://www.timeline-alchemy.nl';
  const cosmicCommunityCreatorHref = 'https://cosmic-community-creator.vercel.app/';
  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: 'Timeline Alchemy', href: timelineAlchemyEntryHref, icon: Star, external: true },
    { name: 'Cosmic Community Creator', href: cosmicCommunityCreatorHref, icon: Users, external: true },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: t('nav.about'), href: '/about', icon: Star },
    { name: t('nav.contact'), href: '/contact', icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="relative z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 cosmic-hover">
            <div className="w-8 h-8 bg-cosmic-gradient rounded-full shadow-cosmic animate-cosmic-pulse"></div>
            <span className="font-cosmic text-xl text-cosmic-gradient">
              SH4M4NI4K
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mystical text-sm transition-all duration-300 hover:text-primary text-muted-foreground hover:text-foreground"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-mystical text-sm transition-all duration-300 hover:text-primary ${isActive(item.href)
                    ? 'text-cosmic glow-accent'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSelector />
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="cosmic-hover"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-lg border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              item.external ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-3 py-2 rounded-md text-base font-mystical cosmic-hover text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-mystical cosmic-hover ${isActive(item.href)
                    ? 'text-cosmic bg-cosmic/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
