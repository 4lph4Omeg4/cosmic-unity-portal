import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Star, Sparkles } from 'lucide-react';
import NewsletterSignup from '@/components/NewsletterSignup';

interface NewsletterPopupProps {
  delay?: number; // Show after X seconds
  exitIntent?: boolean; // Show on exit intent
}

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ 
  delay = 30000, // Default 30 seconds
  exitIntent = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('newsletter-popup-shown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let exitHandler: (e: MouseEvent) => void;

    // Show after delay
    timeoutId = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('newsletter-popup-shown', 'true');
      }
    }, delay);

    // Exit intent detection
    if (exitIntent) {
      exitHandler = (e: MouseEvent) => {
        // Check if mouse is leaving viewport from the top
        if (e.clientY <= 0 && !hasShown) {
          setIsOpen(true);
          setHasShown(true);
          sessionStorage.setItem('newsletter-popup-shown', 'true');
        }
      };

      document.addEventListener('mouseleave', exitHandler);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (exitHandler) document.removeEventListener('mouseleave', exitHandler);
    };
  }, [delay, exitIntent, hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto bg-card/95 backdrop-blur-xl border-cosmic/50 shadow-2xl p-0 overflow-hidden">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Header with cosmic effects */}
        <div className="relative bg-gradient-to-br from-cosmic/20 via-primary/10 to-accent/20 p-6 text-center">
          <div className="absolute inset-0 bg-cosmic/5 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="w-6 h-6 text-cosmic animate-pulse" />
              <Sparkles className="w-5 h-5 text-primary animate-spin-slow" />
              <Star className="w-6 h-6 text-cosmic animate-pulse delay-500" />
            </div>
            <DialogHeader>
              <DialogTitle className="font-cosmic text-2xl font-bold text-cosmic-gradient">
                Wait! Don't Miss Out 🌟
              </DialogTitle>
            </DialogHeader>
            <p className="font-mystical text-sm text-muted-foreground mt-2">
              Join thousands of souls on the path to cosmic consciousness
            </p>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="p-6">
          <NewsletterSignup variant="popup" compact />
        </div>

        {/* Bottom text */}
        <div className="px-6 pb-6 text-center">
          <p className="font-mystical text-xs text-muted-foreground">
            This popup appears only once per session. Your spiritual journey is precious to us.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterPopup;
