import { Game } from '../types/game';

export const games: Game[] = [
  {
    id: '1',
    title: 'Cyber Warriors',
    description: 'A futuristic battle royale experience where players compete in a neon-lit cyberpunk world.',
    price: 59.99,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'action',
    rating: 4.8,
    releaseDate: '2024-03-15',
    publisher: 'SACF Games',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    status: 'New Release'
  },
  {
    id: '2',
    title: 'Mystery of Ancients',
    description: 'Uncover ancient secrets and solve puzzles in this atmospheric adventure game.',
    price: 39.99,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'adventure',
    rating: 4.5,
    releaseDate: '2023-11-30',
    publisher: 'SACF Games',
    platforms: ['PC', 'PS5', 'Xbox Series X', 'Nintendo Switch'],
    status: 'Popular'
  },
  {
    id: '3',
    title: 'Space Frontier',
    description: 'Explore the vast universe, build colonies, and engage in epic space battles.',
    price: 49.99,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'strategy',
    rating: 4.7,
    releaseDate: '2024-01-20',
    publisher: 'SACF Games',
    platforms: ['PC'],
    status: 'Best Seller'
  },
  {
    id: '4',
    title: 'Dragon\'s Legacy',
    description: 'Embark on an epic journey in a vast fantasy world filled with dragons and magic.',
    price: 29.99,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'rpg',
    rating: 4.9,
    releaseDate: '2024-02-28',
    publisher: 'SACF Games',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    status: 'Coming Soon'
  },
  {
    id: '5',
    title: 'Championship Manager 2024',
    description: 'Lead your team to glory in the most comprehensive sports management simulation.',
    price: 34.99,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'sports',
    rating: 4.6,
    releaseDate: '2024-01-15',
    publisher: 'SACF Games',
    platforms: ['PC', 'PS5', 'Xbox Series X', 'Mobile'],
    status: 'Popular'
  },
  {
    id: '6',
    title: 'Urban Legends',
    description: 'Investigate supernatural phenomena in this atmospheric horror adventure.',
    price: 19.99,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'adventure',
    rating: 4.4,
    releaseDate: '2023-12-10',
    publisher: 'SACF Games',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    status: 'New'
  }
];

// Featured games are the top 3 highest rated games
export const getFeaturedGames = (): Game[] => {
  // Создаем копию массива игр
  const shuffledGames = [...games];
  
  // Перемешиваем массив случайным образом
  for (let i = shuffledGames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledGames[i], shuffledGames[j]] = [shuffledGames[j], shuffledGames[i]];
  }
  
  // Возвращаем первые 3 игры из перемешанного массива
  return shuffledGames.slice(0, 3);
};