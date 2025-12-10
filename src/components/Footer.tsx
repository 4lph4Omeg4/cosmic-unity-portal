import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t, language } = useLanguage();
  const timelineAlchemyEntryHref = 'https://www.timeline-alchemy.nl';
  const cosmicCommunityCreatorHref = 'https://cosmic-community-creator.vercel.app/';



  const footerLinks = {
    community: [
      { name: 'Blog', href: '/blog' },
      { name: t('footer.about'), href: '/about' },
      { name: t('footer.contact'), href: '/contact' },
    ]
  };

  return (
    <footer className="bg-card/50 backdrop-blur-md border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="space-y-12 mb-12">
          {/* Footer Row: Community (left), Social Links (center), Contact (right) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            {/* Navigation Links - Left */}
            <div className="w-full md:w-auto">
              <h3 className="font-cosmic text-lg font-semibold text-cosmic-gradient mb-4">
                Links
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
                    href={timelineAlchemyEntryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover text-sm"
                  >
                    Timeline Alchemy
                  </a>
                </li>
                <li>
                  <a
                    href={cosmicCommunityCreatorHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover text-sm"
                  >
                    Cosmic Community Creator
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links - Center */}
            <div className="w-full md:w-auto flex justify-center">
              <div className="text-center">
                <h3 className="font-cosmic text-lg font-semibold text-cosmic-gradient mb-4">
                  SH4M4NI4K
                </h3>
                <div className="flex space-x-4 justify-center">
                  <a href="https://www.instagram.com/timeline_alchemy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://www.facebook.com/timelinealchemy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://www.youtube.com/@Timeline_Alchemy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                    <Youtube className="w-5 h-5" />
                  </a>
                  <a href="https://x.com/Timeline4lchemy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="https://www.tiktok.com/@timeline4lchemy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cosmic cosmic-hover">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Info - Right */}
            <div className="w-full md:w-auto text-right">
              <h3 className="font-cosmic text-lg font-semibold text-mystical-gradient mb-4">
                {t('footer.contactUs')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-end space-x-2 text-sm">
                  <a
                    href="mailto:sh4m4ni4k@sh4m4ni4k.nl"
                    className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover"
                  >
                    timeline-alchemy@sh4m4ni4k.nl
                  </a>
                  <Mail className="w-4 h-4 text-cosmic" />
                </div>
                <div className="flex items-center justify-end space-x-2 text-sm">
                  <a
                    href="tel:+31613163277"
                    className="font-mystical text-muted-foreground hover:text-cosmic cosmic-hover"
                  >
                    06 13163277
                  </a>
                  <Phone className="w-4 h-4 text-cosmic" />
                </div>
                <div className="flex items-start justify-end space-x-2 text-sm">
                  <span className="font-mystical text-muted-foreground">
                    Landgraaf, NL<br />
                  </span>
                  <MapPin className="w-4 h-4 text-cosmic mt-0.5" />
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
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 text-sm">
            <p className="font-mystical text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
