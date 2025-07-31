import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'Egypt & The 7 Seals', href: '/shop/egypt-7-seals' },
      { name: 'Fun Shirts', href: '/shop/fun-shirts' },
      { name: 'Digital Products', href: '/shop/digital' },
      { name: 'The Chosen Ones', href: '/shop/chosen-ones' },
    ],
    community: [
      { name: 'Community Portal', href: '/community' },
      { name: 'Downloads', href: '/shop/digital' },
      { name: 'Blog', href: '/blog' },
      { name: 'From Ego to Eden', href: '/blog' },
    ],
    info: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ]
  };

  return (
    <footer className="bg-card/50 backdrop-blur-md border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cosmic-gradient rounded-full shadow-cosmic animate-cosmic-pulse"></div>
              <span className="font-cosmic text-xl text-cosmic-gradient">SH4M4NI4K</span>
            </div>
            <p className="font-mystical text-muted-foreground">
              Awakening consciousness through sacred geometry and divine merchandise. 
              Join the galactic federation of light.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-cosmic text-lg font-semibold text-mystical-gradient mb-4">
              Sacred Shop
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-cosmic text-lg font-semibold text-cosmic-gradient mb-4">
              Community
            </h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-cosmic text-lg font-semibold text-cosmic-gradient mb-4">
              Sacred Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-cosmic" />
                <a 
                  href="mailto:sh4m4ni4k@sh4m4ni4k.nl" 
                  className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover"
                >
                  sh4m4ni4k@sh4m4ni4k.nl
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-cosmic" />
                <a 
                  href="tel:+31613163277" 
                  className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover"
                >
                  06 13163277
                </a>
              </div>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-cosmic mt-0.5" />
                <span className="font-mystical text-muted-foreground">
                  Poststraat 47B<br />
                  6371VL Landgraaf<br />
                  Nederland
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sacred Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-card px-4">
              <Star className="w-6 h-6 text-cosmic animate-cosmic-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="font-mystical text-sm text-muted-foreground">
              © {currentYear} SH4M4NI4K - The Chosen Ones. All sacred rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link 
              to="/privacy" 
              className="font-mystical text-sm text-muted-foreground hover:text-cosmic cosmic-hover"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="font-mystical text-sm text-muted-foreground hover:text-cosmic cosmic-hover"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;