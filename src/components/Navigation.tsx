import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingBag, User, Star } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/', icon: Star },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Community', href: '/community', icon: User },
    { name: 'Blog', href: '/blog', icon: Star },
    { name: 'About', href: '/about', icon: Star },
    { name: 'Contact', href: '/contact', icon: Star },
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
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-mystical text-sm transition-all duration-300 hover:text-primary ${
                  isActive(item.href)
                    ? 'text-cosmic glow-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="mystical" size="sm">
              Join the Mission
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
        <div className="md:hidden bg-card/95 backdrop-blur-lg border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-mystical cosmic-hover ${
                  isActive(item.href)
                    ? 'text-cosmic bg-cosmic/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Button variant="mystical" size="sm" className="w-full">
                Join the Mission
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;