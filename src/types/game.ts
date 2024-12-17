export type GameCategory = 'action' | 'adventure' | 'rpg' | 'strategy' | 'sports';
export type PriceRange = 'under-20' | '20-40' | 'over-40';

export interface Game {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  image: string;
  category: GameCategory;
  rating: number;
  releaseDate: string;
  publisher: string;
  platforms: string[];
  status: string;
}