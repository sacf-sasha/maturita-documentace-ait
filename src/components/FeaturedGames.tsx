import React from 'react';

const FeaturedGames = () => {
  const games = [
    {
      title: "Cyber Warriors",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "A futuristic battle royale experience",
      status: "Coming Soon"
    },
    {
      title: "Mystery of Ancients",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "An epic adventure through mythical realms",
      status: "Popular"
    },
    {
      title: "Space Frontier",
      image: "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Explore the vast universe",
      status: "New Release"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Featured Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div key={game.title} className="bg-gray-800 rounded-xl overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48">
                <img 
                  src={game.image} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                    {game.status}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                <p className="text-gray-400 mb-4">{game.description}</p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;