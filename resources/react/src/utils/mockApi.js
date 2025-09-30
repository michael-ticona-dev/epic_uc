import gamesData from '../data/games.json';
import categoriesData from '../data/categories.json';
import usersData from '../data/users.json';
import reviewsData from '../data/reviews.json';
import ordersData from '../data/orders.json';
import dealsData from '../data/deals.json';

// Simular delay de red
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Games
  async getGames(filters = {}) {
    await delay();
    let games = [...gamesData];

    // Aplicar filtros
    if (filters.category) {
      games = games.filter(game => 
        game.tags.some(tag => 
          tag.toLowerCase().includes(filters.category.toLowerCase())
        )
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      games = games.filter(game =>
        game.title.toLowerCase().includes(searchTerm) ||
        game.developer.toLowerCase().includes(searchTerm) ||
        game.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.platform) {
      games = games.filter(game => 
        game.platforms.includes(filters.platform)
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      games = games.filter(game => {
        const finalPrice = game.price * (1 - game.discount);
        return finalPrice >= min && finalPrice <= max;
      });
    }

    if (filters.rating) {
      games = games.filter(game => game.rating >= filters.rating);
    }

    // Aplicar ordenamiento
    if (filters.sort) {
      switch (filters.sort) {
        case 'price-low':
          games.sort((a, b) => (a.price * (1 - a.discount)) - (b.price * (1 - b.discount)));
          break;
        case 'price-high':
          games.sort((a, b) => (b.price * (1 - b.discount)) - (a.price * (1 - a.discount)));
          break;
        case 'rating':
          games.sort((a, b) => b.rating - a.rating);
          break;
        case 'release-date':
          games.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
          break;
        case 'name':
          games.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          // relevance - mantener orden original
          break;
      }
    }

    return {
      games,
      total: games.length,
      page: filters.page || 1,
      pageSize: filters.pageSize || 12
    };
  },

  async getGameBySlug(slug) {
    await delay();
    return gamesData.find(game => game.slug === slug);
  },

  async getFeaturedGames() {
    await delay();
    return gamesData.slice(0, 6);
  },

  async getNewReleases() {
    await delay();
    return gamesData
      .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
      .slice(0, 8);
  },

  async getTrending() {
    await delay();
    return gamesData
      .sort((a, b) => b.ratingsCount - a.ratingsCount)
      .slice(0, 8);
  },

  async getUpcoming() {
    await delay();
    // Para demo, retornar algunos juegos como "próximos"
    return gamesData.slice(2, 6);
  },

  // Categories
  async getCategories() {
    await delay();
    return categoriesData;
  },

  // Users
  async authenticateUser(email, password) {
    await delay();
    const user = usersData.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  async registerUser(userData) {
    await delay();
    // En una app real, esto haría POST al backend
    const existingUser = usersData.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    
    const newUser = {
      id: `u-${Date.now()}`,
      ...userData,
      role: 'user',
      avatar: 'https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536_960_720.jpg'
    };
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  // Reviews
  async getGameReviews(gameId) {
    await delay();
    return reviewsData.filter(review => review.gameId === gameId);
  },

  // Orders
  async getUserOrders(userId) {
    await delay();
    return ordersData.filter(order => order.userId === userId);
  },

  async createOrder(orderData) {
    await delay();
    const newOrder = {
      id: `ord-${Date.now()}`,
      ...orderData,
      status: 'completed',
      date: new Date().toISOString()
    };
    return newOrder;
  },

  // Deals
  async getDeals() {
    await delay();
    return dealsData.map(deal => {
      const game = gamesData.find(g => g.id === deal.gameId);
      return {
        ...deal,
        game,
        originalPrice: game?.price || 0,
        finalPrice: game ? game.price * (1 - deal.discount) : 0
      };
    });
  },

  // Admin
  async getDashboardStats() {
    await delay();
    return {
      totalUsers: 1250,
      totalGames: gamesData.length,
      totalOrders: 890,
      totalRevenue: 45670.50,
      monthlyStats: [
        { month: 'Ene', users: 120, sales: 4500 },
        { month: 'Feb', users: 150, sales: 5200 },
        { month: 'Mar', users: 180, sales: 6800 },
        { month: 'Abr', users: 200, sales: 7200 }
      ]
    };
  }
};