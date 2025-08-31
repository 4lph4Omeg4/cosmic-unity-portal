import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">🎉 Test Page Werkt!</h1>
        <p className="text-xl mb-8">De basis setup is OK</p>
        
        <div className="space-y-4">
          <a 
            href="/timeline-alchemy" 
            className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            → Ga naar Timeline Alchemy
          </a>
          
          <a 
            href="/" 
            className="block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            → Ga naar Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
