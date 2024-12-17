import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Game } from '../../types/game';
import { useCart } from '../../context/CartContext';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      id: Number(game.id),
      title: game.title,
      price: game.discount > 0 ? game.price * (1 - game.discount / 100) : game.price,
      image: game.image
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden transition-transform hover:scale-105">
      <div className="relative">
        <img 
          src={game.image} 
          alt={game.title}
          className="w-full h-48 object-cover"
        />
        {game.discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
            -{game.discount}%
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{game.title}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white ml-1">{game.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-400 mb-4 h-12 line-clamp-2">{game.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {game.discount > 0 ? (
              <>
                <span className="text-gray-400 line-through">${game.price.toFixed(2)}</span>
                <span className="text-white font-bold">
                  ${(game.price * (1 - game.discount / 100)).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-white font-bold">${game.price.toFixed(2)}</span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${
              isAdding 
                ? 'bg-green-600 scale-95'
                : 'bg-purple-600 hover:bg-purple-700 hover:scale-105'
            }`}
          >
            <ShoppingCart className={`h-4 w-4 transition-transform duration-300 ${
              isAdding ? 'rotate-12' : ''
            }`} />
            <span className="text-white">
              {isAdding ? 'Added!' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};