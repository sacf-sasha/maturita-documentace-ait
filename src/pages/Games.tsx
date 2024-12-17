import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { GameList } from '../components/games/GameList';
import { GameFilters } from '../components/games/GameFilters';
import { games } from '../data/catalog';
import { GameCategory, PriceRange } from '../types/game';

const Games = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'all'>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | 'all'>('all');

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesPriceRange = selectedPriceRange === 'all' || isPriceInRange(game.price, selectedPriceRange);
    
    return matchesSearch && matchesCategory && matchesPriceRange;
  });

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Games Catalog</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <GameFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              setSelectedPriceRange={setSelectedPriceRange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {/* Results Count */}
            <p className="text-gray-400 mb-4">
              Showing {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
            </p>

            {/* Games Grid */}
            <GameList games={filteredGames} />
          </div>
        </div>
      </div>
    </div>
  );
};

const isPriceInRange = (price: number, range: PriceRange): boolean => {
  switch (range) {
    case 'under-20':
      return price < 20;
    case '20-40':
      return price >= 20 && price <= 40;
    case 'over-40':
      return price > 40;
    default:
      return true;
  }
};

export default Games;