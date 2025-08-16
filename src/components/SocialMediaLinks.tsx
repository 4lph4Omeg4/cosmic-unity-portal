import React from 'react';
import { Instagram, Twitter, Linkedin, Youtube, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialMediaLinksProps {
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    facebook?: string;
  };
  className?: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ socialLinks, className = "" }) => {
  if (!socialLinks) return null;

  const socialPlatforms = [
    { key: 'instagram', icon: Instagram, color: 'text-pink-500 hover:text-pink-600' },
    { key: 'twitter', icon: Twitter, color: 'text-blue-400 hover:text-blue-500' },
    { key: 'linkedin', icon: Linkedin, color: 'text-blue-600 hover:text-blue-700' },
    { key: 'youtube', icon: Youtube, color: 'text-red-500 hover:text-red-600' },
    { 
      key: 'tiktok', 
      icon: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 2.895-2.895c.183 0 .363.018.535.052V11.19a6.329 6.329 0 0 0-.535-.024 6.335 6.335 0 0 0-6.336 6.336A6.335 6.335 0 0 0 10.069 24a6.335 6.335 0 0 0 6.336-6.336V8.031a8.188 8.188 0 0 0 4.759 1.544V6.686h-.575Z"/>
        </svg>
      ), 
      color: 'text-black hover:text-gray-800 dark:text-white dark:hover:text-gray-200' 
    },
    { key: 'facebook', icon: Facebook, color: 'text-blue-500 hover:text-blue-600' },
  ];

  const hasAnyLinks = socialPlatforms.some(platform => 
    socialLinks[platform.key as keyof typeof socialLinks]
  );

  if (!hasAnyLinks) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {socialPlatforms.map(platform => {
        const link = socialLinks[platform.key as keyof typeof socialLinks];
        if (!link) return null;

        const Icon = platform.icon;
        
        return (
          <Button
            key={platform.key}
            variant="ghost"
            size="icon"
            asChild
            className={`h-8 w-8 ${platform.color} transition-colors`}
          >
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${platform.key} profile`}
            >
              <Icon className="h-4 w-4" />
            </a>
          </Button>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;