import React from 'react';
import { Game } from '../../types/game';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden transition-transform hover:scale-105">
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
  );
};