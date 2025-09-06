import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, X, Star, Home, ShoppingBag, BookOpen, Users, Mail, User, LogOut, LogIn, MessageCircle } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import Cart from '@/components/Cart';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { t, language } = useLanguage();
  const timelineAlchemyEntryHref = user
    ? (profile?.role === 'admin'
        ? '/timeline-alchemy/admin/dashboard'
        : (profile?.role === 'client'
            ? '/timeline-alchemy/client/my-previews'
            : '/timeline-alchemy'))
    : '/timeline-alchemy';
  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('nav.shop'), href: '/shop', icon: ShoppingBag },
    { name: t('nav.community'), href: '/community', icon: Users },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Timeline Alchemy', href: timelineAlchemyEntryHref, icon: Star },
    { name: t('nav.about'), href: '/about', icon: Star },
    { name: t('nav.contact'), href: '/contact', icon: Mail },
  ];

  // Timeline Alchemy sub-navigation based on user role
  const timelineAlchemyNav = user && profile?.role === 'admin' ? [
    { name: 'Dashboard', href: '/timeline-alchemy/admin/dashboard', icon: Star },
    { name: 'Ideas', href: '/timeline-alchemy/admin/ideas', icon: Star },
    { name: 'Preview Wizard', href: '/timeline-alchemy/admin/preview-wizard-new', icon: Star },
    { name: 'Social Connections', href: '/timeline-alchemy/admin/social-connections', icon: Star },
  ] : user && profile?.role === 'client' ? [
    { name: 'My Previews', href: '/timeline-alchemy/client/my-previews', icon: Star },
    { name: 'Social Connections', href: '/timeline-alchemy/client/social-connections', icon: Star },
  ] : [];

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

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
                  className={`font-mystical text-sm transition-all duration-300 hover:text-primary ${
                    isActive(item.href)
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
            <Cart />
            <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-cosmic-gradient text-white">
                        {profile?.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem asChild className="font-mystical">
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('nav.profile')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="font-mystical">
                    <Link to="/friends" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>{t('friends.title')}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="font-mystical">
                    <Link to="/messages" className="flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>{language === 'en' ? 'Messages' : language === 'de' ? 'Nachrichten' : 'Berichten'}</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* Timeline Alchemy Direct Link */}
                  {timelineAlchemyNav.length > 0 && (
                    <DropdownMenuItem asChild className="font-mystical">
                      <Link to={timelineAlchemyNav[0].href} className="flex items-center">
                        <Star className="mr-2 h-4 w-4" />
                        <span>Timeline Alchemy</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {/* Timeline Alchemy Section */}
                  {timelineAlchemyNav.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="font-mystical text-xs text-muted-foreground cursor-default">
                        Timeline Alchemy
                      </DropdownMenuItem>
                      {timelineAlchemyNav.map((item) => (
                        <DropdownMenuItem key={item.name} asChild className="font-mystical">
                          <Link to={item.href} className="flex items-center">
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  
                  <DropdownMenuItem className="font-mystical">
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="font-mystical">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="mystical" 
                onClick={() => navigate('/auth')}
              >
                <LogIn className="w-4 h-4 mr-2" />
                {t('nav.login')}
              </Button>
            )}
            </div>
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <Cart />
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
              )
            ))}

            {/* Additional actions mobile */}
            <div className="space-y-1">
              <Link
                to="/cart"
                className="flex items-center px-3 py-2 rounded-md text-base font-mystical cosmic-hover text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                {t('nav.cart') || 'Winkelwagen'}
              </Link>
            </div>

            {/* Auth Section Mobile */}
            <div className="pt-4 border-t border-border/20">
              {user ? (
                <div className="space-y-3">
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 px-3 py-2 cosmic-hover rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-cosmic-gradient text-white text-sm">
                        {profile?.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-mystical text-sm">{profile?.display_name || 'Profiel'}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full mx-3"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="mystical" 
                  className="w-full mx-3"
                  onClick={() => navigate('/auth')}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('nav.login')}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
