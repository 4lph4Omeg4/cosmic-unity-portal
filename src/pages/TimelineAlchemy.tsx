import React from 'react';

const TimelineAlchemy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated background with cosmic dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 mb-6">
            Timeline Alchemy
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">
            Where Technology Meets Spirit
          </p>
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-full backdrop-blur-sm">
            <span className="text-blue-300 font-semibold text-lg">Coming Soon</span>
          </div>
        </div>
      </section>

      {/* Teaser Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <p className="text-lg md:text-xl">
              Timeline Alchemy is méér dan software — het is een portaal. Een plek waar creators hun visie kunnen delen, zonder begrensd te worden door algoritmes of advertenties. Hier transformeert content in een levend ritme van creatie, waarde en verbinding.
            </p>
            <p className="text-lg md:text-xl">
              Met Timeline Alchemy bouw je jouw eigen universum: een abonnementsmodel dat je community voedt, terwijl jij je puur kunt richten op wat je het liefst doet — creëren. Wij zorgen voor de flow: planning, distributie en marketing die je bereik vergroten zonder dat jij energie verliest.
            </p>
            <p className="text-lg md:text-xl">
              Dit is de nieuwe economie van aandacht: eerlijk, direct en gedragen door echte verbinding. Geen ruis. Geen verspilling. Alleen essentie — tijd die je omzet in alchemie.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Blijf op de hoogte
            </h3>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
              Schrijf me in voor updates
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Timeline Alchemy
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TimelineAlchemy;
