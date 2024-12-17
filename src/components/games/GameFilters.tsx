import React from 'react';
import { Filter } from 'lucide-react';
import { GameCategory, PriceRange } from '../../types/game';

interface GameFiltersProps {
  selectedCategory: GameCategory | 'all';
  setSelectedCategory: (category: GameCategory | 'all') => void;
  selectedPriceRange: PriceRange | 'all';
  setSelectedPriceRange: (range: PriceRange | 'all') => void;
}

export const GameFilters = ({
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setSelectedPriceRange
}: GameFiltersProps) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-purple-500" />
        <h2 className="text-xl font-bold text-white">Filters</h2>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-white font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {['all', 'action', 'adventure', 'rpg', 'strategy', 'sports'].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => setSelectedCategory(e.target.value as GameCategory | 'all')}
                className="form-radio text-purple-500 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-300 capitalize">
                {category === 'all' ? 'All Categories' : category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-white font-semibold mb-4">Price Range</h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All Prices' },
            { value: 'under-20', label: 'Under $20' },
            { value: '20-40', label: '$20 - $40' },
            { value: 'over-40', label: 'Over $40' }
          ].map((range) => (
            <label key={range.value} className="flex items-center">
              <input
                type="radio"
                name="price"
                value={range.value}
                checked={selectedPriceRange === range.value}
                onChange={(e) => setSelectedPriceRange(e.target.value as PriceRange | 'all')}
                className="form-radio text-purple-500 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-300">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};