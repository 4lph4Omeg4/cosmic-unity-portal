import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Star, Send } from 'lucide-react';

const Contact = () => {
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
              <span className="text-cosmic-gradient">Sacred</span>{' '}
              <span className="text-mystical-gradient">Contact</span>
            </h1>
            
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with the Chosen Ones. We're here to guide your journey toward cosmic consciousness.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-cosmic text-2xl text-cosmic-gradient">
                  Send Sacred Message
                </CardTitle>
                <CardDescription className="font-mystical">
                  Share your awakening journey or ask questions about our divine mission.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="font-mystical">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="Your sacred name"
                      className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="font-mystical">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Your family name"
                      className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mystical">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@cosmic.realm"
                    className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-mystical">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="Topic of your divine inquiry"
                    className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-mystical">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Share your thoughts, questions, or awakening experiences..."
                    rows={6}
                    className="bg-input/50 border-border/50 focus:border-cosmic cosmic-hover resize-none"
                  />
                </div>
                
                <Button variant="cosmic" size="lg" className="w-full group">
                  Send Message
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
                    Divine Coordinates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4 cosmic-hover">
                    <div className="w-12 h-12 bg-cosmic/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-cosmic" />
                    </div>
                    <div>
                      <p className="font-mystical font-semibold text-foreground">Email</p>
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
                      <p className="font-mystical font-semibold text-foreground">Phone</p>
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
                      <p className="font-mystical font-semibold text-foreground">Sacred Location</p>
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
                    Divine Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mystical text-muted-foreground leading-relaxed">
                    We typically respond to sacred inquiries within 24-48 hours. 
                    Each message is blessed with cosmic attention and divine care.
                  </p>
                </CardContent>
              </Card>

              {/* Sacred Hours */}
              <Card className="cosmic-hover bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="font-cosmic text-xl text-mystical-gradient">
                    Sacred Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 font-mystical text-muted-foreground">
                    <p><span className="text-foreground">Monday - Friday:</span> 9:00 - 17:00 CET</p>
                    <p><span className="text-foreground">Weekend:</span> By cosmic appointment</p>
                    <p className="text-sm pt-2">
                      The universe is always open for divine guidance.
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