import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Star, 
  Globe, 
  QrCode, 
  ArrowRight, 
  CheckCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Passport = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>Galactic Passport for No-Bodies — Paspoort naar het Zelf</title>
        <meta name="description" content="Een paspoort dat niets toevoegt en alles opent. 32 A6-pagina's, € 3,69 symbolische bijdrage. Valid nowhere — 'Now' · 'Here'." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Galactic Passport for No-Bodies — Paspoort naar het Zelf" />
        <meta property="og:description" content="Een paspoort dat niets toevoegt en alles opent. 32 A6-pagina's, € 3,69 symbolische bijdrage." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sh4m4ni4k.nl/passport" />
        <meta property="og:image" content="https://sh4m4ni4k.nl/og-passport.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Galactic Passport for No-Bodies" />
        <meta name="twitter:description" content="Een paspoort dat niets toevoegt en alles opent. 32 A6-pagina's, € 3,69 symbolische bijdrage." />
        <meta name="twitter:image" content="https://sh4m4ni4k.nl/og-passport.png" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Galactic Passport for No-Bodies",
            "description": "Een paspoort dat niets toevoegt en alles opent. 32 A6-pagina's met stempels en zinnen die alles doorboren.",
            "url": "https://sh4m4ni4k.nl/passport",
            "image": "https://sh4m4ni4k.nl/og-passport.png",
            "brand": {
              "@type": "Brand",
              "name": "SH4M4NI4K"
            },
            "offers": {
              "@type": "Offer",
              "price": "3.69",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock",
              "url": "https://sh4m4ni4k.nl/checkout/passport"
            },
            "category": "Boek",
            "material": "Papier",
            "numberOfPages": 32,
            "bookFormat": "A6"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#0D0D1A] text-white">
        {/* Navigation */}
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Stars Background Overlay */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'url(/passport-stars.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Meta Badge */}
            <div className="mb-8">
              <div className="inline-block font-mono text-xs border border-cosmic/30 text-cosmic bg-cosmic/10 px-4 py-2 rounded-full">
                Valid nowhere — 'Now' · 'Here'
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-wider">
              Galactic Passport
              <br />
              <span className="text-cosmic-gradient">for No-Bodies</span>
            </h1>
            
            {/* Subtitle */}
            <p className="font-mystical text-xl md:text-2xl text-neutral-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              contains everything you need for the journey of Returning to Self
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-cosmic hover:bg-cosmic/90 text-white px-8 py-4 text-lg font-semibold group"
                asChild
              >
                <Link to="/checkout/passport">
                  Reserveer voor € 3,69
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-neutral-300 hover:text-white border border-neutral-600 hover:border-neutral-500 px-8 py-4 text-lg"
                onClick={() => setShowPreview(true)}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Lees een voorbeeld
              </Button>
            </div>
          </div>
        </section>

                 {/* Manifest Section */}
         <section className="py-24 bg-black/20">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <div className="space-y-8 font-mono text-lg md:text-xl leading-relaxed tracking-wide">
               <p className="text-2xl md:text-3xl font-bold text-cosmic">
                 Geen boek.
               </p>
               <p className="text-2xl md:text-3xl font-bold text-cosmic">
                 Geen gids.
               </p>
               <p className="text-2xl md:text-3xl font-bold text-cosmic">
                 Maar een reisdocument.
               </p>
               
               <div className="pt-8 space-y-4 text-neutral-200">
                 <p>
                   Dit paspoort bevat alles wat je nodig hebt
                   <br />
                   voor de terugreis naar het Zelf.
                 </p>
                 
                 <p>
                   Het wijst nergens heen.
                   <br />
                   En toch opent het iedere grens.
                 </p>
               </div>
             </div>
           </div>
         </section>

         {/* Specifications Section */}
         <section className="py-24">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Format Card */}
               <Card className="bg-black/20 border-neutral-700 hover:border-cosmic/50 transition-colors">
                 <CardContent className="p-8 text-center">
                   <div className="w-16 h-16 bg-cosmic/20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <BookOpen className="w-8 h-8 text-cosmic" />
                   </div>
                   <h3 className="font-mono text-xl font-semibold mb-2">Formaat</h3>
                   <p className="text-neutral-300">paspoort (A6)</p>
                 </CardContent>
               </Card>

               {/* Pages Card */}
               <Card className="bg-black/20 border-neutral-700 hover:border-cosmic/50 transition-colors">
                 <CardContent className="p-8 text-center">
                   <div className="w-16 h-16 bg-cosmic/20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Star className="w-8 h-8 text-cosmic" />
                   </div>
                   <h3 className="font-mono text-xl font-semibold mb-2">32 pagina's</h3>
                   <p className="text-neutral-300">met stempels en zinnen die alles doorboren</p>
                 </CardContent>
               </Card>

               {/* QR Card */}
               <Card className="bg-black/20 border-neutral-700 hover:border-cosmic/50 transition-colors">
                 <CardContent className="p-8 text-center">
                   <div className="w-16 h-16 bg-cosmic/20 rounded-full flex items-center justify-center mx-auto mb-4">
                     <QrCode className="w-8 h-8 text-cosmic" />
                   </div>
                   <h3 className="font-mono text-xl font-semibold mb-2">QR-stempel</h3>
                   <p className="text-neutral-300">voor onward travel</p>
                 </CardContent>
               </Card>
             </div>
           </div>
         </section>

         {/* Pricing Section */}
         <section className="py-24 bg-black/20">
           <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">
               Symbolische bijdrage
             </h2>
             
             <div className="mb-8">
               <span className="font-mono text-6xl md:text-7xl font-bold text-cosmic">
                 € 3,69
               </span>
             </div>
             
             <p className="text-xl text-neutral-300 mb-8">
               Niet als prijs, maar als sleutel.
             </p>
             
             <div className="text-neutral-400 space-y-2 mb-12 max-w-2xl mx-auto">
               <p>
                 Een bedrag klein genoeg om te vergeten,
                 <br />
                 en groot genoeg om een oneindige stroom op gang te brengen.
               </p>
               
               <p>
                 Iedere bijdrage voedt de volgende oplage.
                 <br />
                 Iedere oplage opent nieuwe deuren.
               </p>
             </div>
             
             <Button 
               size="lg" 
               className="bg-cosmic hover:bg-cosmic/90 text-white px-8 py-4 text-lg font-semibold group"
               asChild
             >
               <Link to="/checkout/passport">
                 Reserveer nu je paspoort
                 <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
               </Link>
             </Button>
           </div>
         </section>

         {/* Stamps Preview Section */}
         <section className="py-24">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
             <h2 className="font-mono text-3xl md:text-4xl font-bold text-center mb-16">
               Voorbeeld stempels
             </h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Stamp 1 */}
               <Card className="bg-black/20 border-neutral-700 hover:border-cosmic/50 transition-colors relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-cosmic/10 rounded-bl-full" />
                 <CardContent className="p-8">
                   <div className="mb-4">
                     <div className="inline-block font-mono text-xs border border-cosmic/30 text-cosmic bg-cosmic/10 px-3 py-1 rounded-full">
                       STAMP No. 1
                     </div>
                   </div>
                   <h3 className="font-mono text-lg font-semibold mb-3 text-cosmic">
                     De illusie van een afkorting
                   </h3>
                   <p className="font-mono text-sm text-neutral-300 leading-relaxed tracking-wide">
                     De enige ware afkorting kan niet genomen worden. Omdat er niemand is die hem kan nemen.
                   </p>
                 </CardContent>
               </Card>

               {/* Stamp 8 */}
               <Card className="bg-black/20 border-neutral-700 hover:border-cosmic/50 transition-colors relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-cosmic/10 rounded-bl-full" />
                 <CardContent className="p-8">
                   <div className="mb-4">
                     <div className="inline-block font-mono text-xs border border-cosmic/30 text-cosmic bg-cosmic/10 px-3 py-1 rounded-full">
                       STAMP No. 8
                     </div>
                   </div>
                   <h3 className="font-mono text-lg font-semibold mb-3 text-cosmic">
                     Niemand heeft ooit geleden
                   </h3>
                   <p className="font-mono text-sm text-neutral-300 leading-relaxed tracking-wide">
                     Op deze planeet heeft nog geen enkele ziel ooit geleden. Alleen ego's lijden. De ziel is altijd heel.
                   </p>
                 </CardContent>
               </Card>

               {/* Stamp 12 */}
               <Card className="bg-black/20 border-neutral-700 hover:border-cosmic/50 transition-colors relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-cosmic/10 rounded-bl-full" />
                 <CardContent className="p-8">
                   <div className="mb-4">
                     <div className="inline-block font-mono text-xs border border-cosmic/30 text-cosmic bg-cosmic/10 px-3 py-1 rounded-full">
                       STAMP No. 12
                     </div>
                   </div>
                   <h3 className="font-mono text-lg font-semibold mb-3 text-cosmic">
                     Niemand kan hem nemen
                   </h3>
                   <p className="font-mono text-sm text-neutral-300 leading-relaxed tracking-wide">
                     Niemand kan deze afkorting nemen. En toch lees jij deze woorden.
                   </p>
                 </CardContent>
               </Card>
             </div>
           </div>
         </section>

         {/* FAQ Section */}
         <section className="py-24 bg-black/20">
           <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
             <h2 className="font-mono text-3xl md:text-4xl font-bold text-center mb-16">
               FAQ
             </h2>
             
             <div className="space-y-8">
               <div className="text-center">
                 <h3 className="font-mono text-xl font-semibold mb-2 text-cosmic">
                   Is dit een boek?
                 </h3>
                 <p className="text-neutral-300">Nee. Het is een paspoort.</p>
               </div>
               
               <div className="text-center">
                 <h3 className="font-mono text-xl font-semibold mb-2 text-cosmic">
                   Waarom € 3,69?
                 </h3>
                                   <p className="text-neutral-300">Een sleutel, geen prijs. Oneindige stroom &gt; voorraad.</p>
               </div>
               
               <div className="text-center">
                 <h3 className="font-mono text-xl font-semibold mb-2 text-cosmic">
                   Wanneer ontvang ik het?
                 </h3>
                 <p className="text-neutral-300">Binnen NL: 3–7 werkdagen na de volgende drukronde.</p>
               </div>
             </div>
           </div>
         </section>

         {/* Final CTA Section */}
         <section className="py-24">
           <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="font-mono text-3xl md:text-4xl font-bold mb-8">
               Klaar voor de reis?
             </h2>
             
             <Button 
               size="lg" 
               className="bg-cosmic hover:bg-cosmic/90 text-white px-12 py-6 text-xl font-semibold group"
               asChild
             >
               <Link to="/checkout/passport">
                 Reserveer je Galactic Passport
                 <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
               </Link>
             </Button>
             
             <p className="text-neutral-400 mt-6">
               € 3,69 · 32 pagina's · Valid nowhere — 'Now' · 'Here'
             </p>
           </div>
         </section>

         {/* Preview Modal */}
         {showPreview && (
           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-[#0D0D1A] border border-neutral-700 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
               <div className="p-6 border-b border-neutral-700">
                 <div className="flex items-center justify-between">
                   <h3 className="font-mono text-xl font-semibold">Voorbeeld spreads</h3>
                   <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => setShowPreview(false)}
                     className="text-neutral-400 hover:text-white"
                   >
                     <X className="w-5 h-5" />
                   </Button>
                 </div>
               </div>
               
               <div className="p-6 space-y-8">
                 {/* Spread 1 */}
                 <div className="space-y-4">
                   <h4 className="font-mono text-lg font-semibold text-cosmic">Spread 1</h4>
                   <div className="bg-black/20 border border-neutral-700 rounded-lg p-6">
                     <p className="font-mono text-sm text-neutral-300 leading-relaxed tracking-wide">
                       "De illusie van een afkorting is dat er iemand is die hem kan nemen. 
                       Maar wie ben jij? Ben je de gedachte 'ik'? Ben je het lichaam? 
                       Ben je de herinneringen? Of ben je dat wat dit alles waarneemt?"
                     </p>
                   </div>
                 </div>
                 
                 {/* Spread 2 */}
                 <div className="space-y-4">
                   <h4 className="font-mono text-lg font-semibold text-cosmic">Spread 2</h4>
                   <div className="bg-black/20 border border-neutral-700 rounded-lg p-6">
                     <p className="font-mono text-sm text-neutral-300 leading-relaxed tracking-wide">
                       "Niemand heeft ooit geleden. Alleen ego's lijden. 
                       De ziel is altijd heel, altijd compleet, altijd vrij. 
                       Het lijden ontstaat wanneer je je identificeert met wat je niet bent."
                     </p>
                   </div>
                 </div>
                 
                 {/* Spread 3 */}
                 <div className="space-y-4">
                   <h4 className="font-mono text-lg font-semibold text-cosmic">Spread 3</h4>
                   <div className="bg-black/20 border border-neutral-700 rounded-lg p-6">
                     <p className="font-mono text-sm text-neutral-300 leading-relaxed tracking-wide">
                       "Niemand kan deze afkorting nemen. En toch lees jij deze woorden. 
                       Dat is de paradox van het ontwaken: je kunt het niet doen, 
                       maar je kunt het wel laten gebeuren."
                     </p>
                   </div>
                 </div>
               </div>
               
               <div className="p-6 border-t border-neutral-700">
                 <Button 
                   className="w-full bg-cosmic hover:bg-cosmic/90"
                   onClick={() => setShowPreview(false)}
                 >
                   Sluiten
                 </Button>
               </div>
             </div>
           </div>
         )}

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Passport;
