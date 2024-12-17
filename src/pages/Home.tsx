import React, { useState } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedGames } from '../data/catalog';
import { GameCard } from '../components/games/GameCard';
import { CompanyStats } from '../components/home/CompanyStats';
import { HeroSection } from '../components/home/HeroSection';

const Home = () => {
  const [featuredGames, setFeaturedGames] = useState(getFeaturedGames());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Get new list of random games
    const newGames = getFeaturedGames();
    setFeaturedGames(newGames);
    
    // Reset animation state after 500ms
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="bg-gray-900">
      <HeroSection />

      {/* Featured Games Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Featured Games
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="text-purple-500 hover:text-purple-400 p-2 rounded-full hover:bg-purple-500/10 transition-colors"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-5 w-5 transition-transform duration-500 ${
                  isRefreshing ? 'rotate-180' : ''
                }`} />
              </button>
              <Link 
                to="/games"
                className="text-purple-500 hover:text-purple-400 flex items-center gap-2"
              >
                View All Games
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${
            isRefreshing ? 'opacity-50' : 'opacity-100'
          }`}>
            {featuredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </section>

      <CompanyStats />
    </div>
  );
};

export default Home;