import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Gamepad2, Download, ShieldCheck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const CasinoCollection = () => {
  const { t } = useLanguage();

  const trinities = [
    {
      title: t('casino.firstTrinity'),
      description: t('casino.firstTrinityDesc'),
      games: [
        {
          title: t('casino.games.universalSlots.title'),
          description: t('casino.games.universalSlots.desc'),
          apkLink: '#',
          isPlaceholder: false,
          icon: <img src="/images/universal-slots.png" alt="Cosmic Casino" className="w-24 h-24 object-contain rounded-xl drop-shadow-lg" />
        },
        {
          title: t('casino.games.blackholeBlackjack.title'),
          description: t('casino.games.blackholeBlackjack.desc'),
          apkLink: '#',
          isPlaceholder: false,
          icon: <img src="/images/blackhole-blackjack.png" alt="BlackHole Blackjack" className="w-24 h-24 object-contain rounded-xl drop-shadow-lg" />
        },
        {
          title: t('casino.games.galacticPoker.title'),
          description: t('casino.games.galacticPoker.desc'),
          apkLink: '#',
          isPlaceholder: false,
          icon: <img src="/images/galactic-poker.png" alt="Galactic Poker" className="w-24 h-24 object-contain rounded-xl drop-shadow-lg" />
        }
      ]
    },
    {
      title: t('casino.secondTrinity'),
      description: t('casino.secondTrinityDesc'),
      games: [
        {
          title: t('casino.games.innerSpace.title'),
          description: t('casino.games.innerSpace.desc'),
          apkLink: '#',
          isPlaceholder: false,
          icon: <Gamepad2 className="w-16 h-16 text-mystical" />
        },
        {
          title: t('casino.games.placeholder2.title'),
          description: t('casino.games.placeholder2.desc'),
          apkLink: '#',
          isPlaceholder: true,
          icon: <Gamepad2 className="w-16 h-16 text-muted-foreground opacity-50" />
        },
        {
          title: t('casino.games.placeholder3.title'),
          description: t('casino.games.placeholder3.desc'),
          apkLink: '#',
          isPlaceholder: true,
          icon: <Gamepad2 className="w-16 h-16 text-muted-foreground opacity-50" />
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-grow relative overflow-hidden py-24">
        {/* Sacred Geometry Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-cosmic rounded-full animate-mystical-float"></div>
          <div className="absolute top-3/4 right-1/4 w-48 h-48 border border-accent rotate-45 animate-cosmic-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-cosmic text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-cosmic-gradient">{t('casino.title')}</span>
            </h1>
            <p className="font-mystical text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('casino.welcome')}
            </p>
            <div className="flex justify-center items-center gap-4 mt-6 text-sm text-muted-foreground font-mystical">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-500" /> {t('casino.secureApk')}</span>
              <span className="flex items-center gap-1"><CreditCard className="w-4 h-4 text-blue-500" /> {t('casino.stripeOnly')}</span>
            </div>
          </div>

          <div className="space-y-24">
            {trinities.map((trinity, tIdx) => (
              <div key={tIdx} className="relative">
                <div className="text-center mb-12">
                  <h2 className="font-cosmic text-3xl font-bold text-mystical-gradient mb-4">{trinity.title}</h2>
                  <p className="font-mystical text-muted-foreground text-lg">{trinity.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {trinity.games.map((game, idx) => (
                    <div key={idx} className="bg-card/50 backdrop-blur-md border border-border p-8 rounded-2xl cosmic-hover group flex flex-col">
                      <div className="flex flex-col items-center text-center h-full">
                        <div className="p-4 bg-background/50 rounded-[2rem] mb-6 group-hover:scale-110 transition-transform duration-300 shadow-cosmic flex items-center justify-center overflow-hidden">
                          {game.icon}
                        </div>
                        <h3 className="font-cosmic text-2xl font-semibold text-mystical-gradient mb-4">
                          {game.title}
                        </h3>
                        <p className="font-mystical text-muted-foreground mb-8 flex-grow">
                          {game.description}
                        </p>
                        <Button asChild className={`w-full ${game.isPlaceholder ? 'bg-muted text-muted-foreground pointer-events-none' : 'cosmic-hover bg-cosmic-gradient text-white border-none cursor-pointer'}`}>
                          <a href={game.apkLink} download={!game.isPlaceholder}>
                            <Download className="w-4 h-4 mr-2" />
                            {game.isPlaceholder ? t('casino.comingSoon') : t('casino.downloadApk')}
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Ecosystem Section */}
          <div className="mt-32 max-w-5xl mx-auto text-center">
            <h2 className="font-cosmic text-3xl md:text-4xl font-bold text-cosmic-gradient mb-6">
              {t('casino.ecosystemTitle')}
            </h2>
            <p className="font-mystical text-lg text-muted-foreground mb-16 leading-relaxed max-w-3xl mx-auto">
              {t('casino.ecosystemDesc')}
            </p>

            <h3 className="font-cosmic text-2xl font-bold text-mystical-gradient mb-8">
              {t('casino.creditPacks')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 'pack3', isFeatured: false },
                { id: 'pack2', isFeatured: true },
                { id: 'pack1', isFeatured: false },
                { id: 'pack6', isFeatured: false },
                { id: 'pack5', isFeatured: true },
                { id: 'pack4', isFeatured: false },
              ].map((pack) => (
                <div key={pack.id} className={`bg-card/50 backdrop-blur-md border p-6 rounded-2xl cosmic-hover group relative ${pack.isFeatured ? 'border-cosmic/50' : 'border-border'}`}>
                  {pack.isFeatured && (
                    <div className="absolute -inset-1 bg-cosmic-gradient opacity-20 group-hover:opacity-40 blur rounded-2xl transition-opacity duration-500 pointer-events-none"></div>
                  )}
                  <div className="relative z-10 w-full">
                    <div className={`rounded-xl overflow-hidden mb-6 shadow-md ${pack.isFeatured ? 'border border-cosmic/50 shadow-cosmic' : 'border border-cosmic/30'}`}>
                      <img src={`/images/${pack.id}.jpg`} alt={t(`casino.packs.${pack.id}.title` as any)} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="font-cosmic text-xl font-bold text-cosmic-gradient mb-2">{t(`casino.packs.${pack.id}.title` as any)}</h4>
                    <p className="font-mystical text-lg text-secondary mb-4">{t(`casino.packs.${pack.id}.desc` as any)}</p>
                    <Button className={`w-full cosmic-hover text-white border-none cursor-pointer ${pack.isFeatured ? 'bg-mystical-gradient' : 'bg-cosmic-gradient'}`}>
                      {t('common.buyNow')} - {t(`casino.packs.${pack.id}.price` as any)}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CasinoCollection;
