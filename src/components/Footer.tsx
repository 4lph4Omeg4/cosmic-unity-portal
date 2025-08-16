import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import NewsletterSignup from '@/components/NewsletterSignup';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();

  // Generate language-specific policy URLs
  const getPolicyUrls = () => {
    switch (language) {
      case 'nl':
        return {
          privacy: '/privacybeleid',
          terms: '/algemene-voorwaarden',
          shipping: '/verzendbeleid',
          refund: '/retourbeleid'
        };
      case 'en':
        return {
          privacy: '/privacy-policy',
          terms: '/terms-of-service',
          shipping: '/shipping-policy',
          refund: '/refund-policy'
        };
      case 'de':
        return {
          privacy: '/datenschutz',
          terms: '/nutzungsbedingungen',
          shipping: '/versandrichtlinien',
          refund: '/rückgaberecht'
        };
      default:
        return {
          privacy: '/privacybeleid',
          terms: '/algemene-voorwaarden',
          shipping: '/verzendbeleid',
          refund: '/retourbeleid'
        };
    }
  };

  const policyUrls = getPolicyUrls();

  const footerLinks = {
    shop: [
      { name: t('footer.allProducts'), href: '/shop/alle-kleding' },
      { name: t('footer.newArrivals'), href: '/shop/digitale-producten' },
      { name: t('footer.featured'), href: '/shop/andere-merchandise' },
    ],
    community: [
      { name: t('footer.community'), href: '/community' },
      { name: t('footer.blog'), href: '/blog' },
      { name: t('footer.about'), href: '/about' },
      { name: t('footer.contact'), href: '/contact' },
    ]
  };

  return (
    <footer className="bg-card/50 backdrop-blur-md border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="space-y-12 mb-12">
          {/* Top Row: Brand and Newsletter Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Brand Section */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <div className="w-8 h-8 bg-cosmic-gradient rounded-full shadow-cosmic animate-cosmic-pulse"></div>
                <span className="font-cosmic text-xl text-cosmic-gradient">SH4M4NI4K</span>
              </div>
              <div className="space-y-2">
                <p className="font-mystical text-muted-foreground">
                  Awakening consciousness through sacred scripture and divine merchandise.
                </p>
                <p className="font-mystical text-muted-foreground">
                  Join the galactic federation of light.
                </p>
              </div>
              <div className="flex space-x-4 justify-center lg:justify-start">
                <a href="https://www.instagram.com/sh4m4n1ak?igsh=MW55aDZ1cTM4anplOQ==" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/share/1CLsVsZJpg/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.youtube.com/@SH4M4NI4K" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="https://x.com/sh4m4ni4k" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.tiktok.com/@sh4m4ni4k?_t=ZN-8tl32THb6yk&_r=1" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <NewsletterSignup variant="footer" compact />
              </div>
            </div>
          </div>

          {/* Bottom Row: Shop, Community, and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop Links */}
            <div>
              <h3 className="font-cosmic text-lg font-semibold text-mystical-gradient mb-4">
                {t('footer.shop')}
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
                {t('footer.community')}
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
                <li>
                  <a
                    href="https://g.co/gemini/share/6d4720253bb2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover text-sm"
                  >
                    The Direct Path
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover text-sm"
                  >
                    Timeline Alchemy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-cosmic text-lg font-semibold text-mystical-gradient mb-4">
                {t('footer.contactUs')}
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
              © {currentYear} SH4M4NI4K - The Chosen Ones. {t('footer.copyright')}
            </p>
          </div>
            <Link 
              to={policyUrls.shipping} 
              className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover"
            >
              {t('footer.shipping')}
            </Link>
            <Link 
              to={policyUrls.refund} 
              className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover"
            >
              {t('footer.returns')}
            </Link>
            <Link 
              to={policyUrls.privacy} 
              className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover"
            >
              {t('footer.privacy')}
            </Link>
            <Link 
              to={policyUrls.terms} 
              className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover"
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
