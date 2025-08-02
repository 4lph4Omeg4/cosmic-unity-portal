import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Star, Send } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const Contact = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-energy-gradient rounded-full flex items-center justify-center shadow-energy animate-cosmic-pulse">
                <Star className="w-6 h-6 text-cosmic-foreground" />
              </div>
            </div>
            
            <h1 className="font-cosmic text-4xl md:text-6xl font-bold mb-6">
              <span className="text-mystical-gradient">{t('contact.title.contact')}</span>
            </h1>
            
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-cosmic text-2xl text-cosmic-gradient">
                  {t('contact.form.title')}
                </CardTitle>
                <CardDescription className="font-mystical">
                  {t('contact.form.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-mystical">{t('contact.form.firstName')}</Label>
                    <Input 
                      id="firstName" 
                      placeholder={t('contact.form.firstNamePlaceholder')}
                      className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-mystical">{t('contact.form.lastName')}</Label>
                    <Input 
                      id="lastName" 
                      placeholder={t('contact.form.lastNamePlaceholder')}
                      className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mystical">{t('contact.form.email')}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder={t('contact.form.emailPlaceholder')}
                    className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-mystical">{t('contact.form.subject')}</Label>
                  <Input 
                    id="subject" 
                    placeholder={t('contact.form.subjectPlaceholder')}
                    className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-mystical">{t('contact.form.message')}</Label>
                  <Textarea 
                    id="message" 
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={6}
                    className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover resize-none"
                  />
                </div>
                
                <Button variant="cosmic" size="lg" className="w-full group">
                  {t('contact.form.send')}
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="font-cosmic text-2xl text-mystical-gradient">
                    {t('contact.info.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4 cosmic-hover">
                    <div className="w-12 h-12 bg-cosmic/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-cosmic" />
                    </div>
                    <div>
                      <p className="font-mystical font-semibold text-foreground">{t('contact.info.email')}</p>
                      <a 
                        href="mailto:sh4m4ni4k@sh4m4ni4k.nl"
                        className="font-mystical text-muted-foreground hover:text-cosmic transition-colors"
                      >
                        sh4m4ni4k@sh4m4ni4k.nl
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 cosmic-hover">
                    <div className="w-12 h-12 bg-mystical/20 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-mystical" />
                    </div>
                    <div>
                      <p className="font-mystical font-semibold text-foreground">{t('contact.info.phone')}</p>
                      <a 
                        href="tel:+31613163277"
                        className="font-mystical text-muted-foreground hover:text-cosmic transition-colors"
                      >
                        06 13163277
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 cosmic-hover">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mt-1">
                      <MapPin className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="font-mystical font-semibold text-foreground">{t('contact.info.location')}</p>
                      <div className="font-mystical text-muted-foreground">
                        <p>Poststraat 47B</p>
                        <p>6371VL Landgraaf</p>
                        <p>Nederland</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="font-cosmic text-xl text-cosmic-gradient">
                    {t('contact.response.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mystical text-muted-foreground leading-relaxed">
                    {t('contact.response.text')}
                  </p>
                </CardContent>
              </Card>

              {/* Sacred Hours */}
              <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="font-cosmic text-xl text-mystical-gradient">
                    {t('contact.hours.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mystical text-muted-foreground">
                    <p><span className="text-foreground">{t('contact.hours.weekdays')}</span> {t('contact.hours.weekdaysTime')}</p>
                    <p><span className="text-foreground">{t('contact.hours.weekend')}</span> {t('contact.hours.weekendText')}</p>
                    <p className="text-sm pt-2">
                      {t('contact.hours.always')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;