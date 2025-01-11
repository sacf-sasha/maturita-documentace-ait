import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Game } from '../../types/game';
import { GameCard } from './GameCard';

interface GameListProps {
  games: Game[];
}

export const GameList: React.FC<GameListProps> = ({ games }) => {
  const { addToCart } = useCart();
  const [clickedButtons, setClickedButtons] = useState<{ [key: string]: boolean }>({});

  const handleAddToCart = (game: Game) => {
    setClickedButtons(prev => ({ ...prev, [game.id]: true }));
    addToCart({
      id: parseInt(game.id),
      title: game.title,
      price: game.price,
      image: game.image
    });

    // Сброс анимации через 1 секунду
    setTimeout(() => {
      setClickedButtons(prev => ({ ...prev, [game.id]: false }));
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-2">{game.title}</h3>
            <p className="text-gray-400 mb-4">{game.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">${game.price}</span>
              <button
                onClick={() => handleAddToCart(game)}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-300 transform
                  ${clickedButtons[game.id] ? 'bg-green-600 scale-95' : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'}
                  text-white active:scale-95`}
                disabled={clickedButtons[game.id]}
              >
                <ShoppingCart className={`h-5 w-5 transition-transform duration-300
                  ${clickedButtons[game.id] ? 'rotate-12' : ''}`}
                />
                {clickedButtons[game.id] ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};