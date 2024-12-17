import React from 'react';
import { GameCard } from './GameCard';
import { featuredGames } from '../../data/games';

const FeaturedGames = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Featured Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredGames.map((game) => (
            <GameCard key={game.title} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;