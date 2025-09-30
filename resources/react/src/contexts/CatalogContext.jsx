import { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';

const CatalogContext = createContext();

export function CatalogProvider({ children }) {
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  
  // Filtros y búsqueda
  const [filters, setFilters] = useState({
    category: '',
    platform: '',
    priceRange: [0, 100],
    rating: 0,
    search: '',
    sort: 'relevance',
    page: 1,
    pageSize: 12
  });

  const [totalResults, setTotalResults] = useState(0);
  
  const { user } = useAuth();

  // Cargar categorías al inicializar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await mockApi.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Cargar wishlist del usuario
  useEffect(() => {
    if (user) {
      const savedWishlist = storage.get(`wishlist_${user.id}`) || [];
      setWishlist(savedWishlist);
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Guardar wishlist en localStorage
  useEffect(() => {
    if (user) {
      storage.set(`wishlist_${user.id}`, wishlist);
    }
  }, [wishlist, user]);

  // Cargar juegos cuando cambian los filtros
  useEffect(() => {
    loadGames();
  }, [filters]);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mockApi.getGames(filters);
      setGames(result.games);
      setTotalResults(result.total);
    } catch (err) {
      setError(err.message);
      console.error('Error loading games:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1 // Reset page when other filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      platform: '',
      priceRange: [0, 100],
      rating: 0,
      search: '',
      sort: 'relevance',
      page: 1,
      pageSize: 12
    });
  };

  const searchGames = (query) => {
    updateFilter('search', query);
  };

  // Wishlist functions
  const addToWishlist = (gameId) => {
    if (user && !wishlist.includes(gameId)) {
      setWishlist(prev => [...prev, gameId]);
    }
  };

  const removeFromWishlist = (gameId) => {
    setWishlist(prev => prev.filter(id => id !== gameId));
  };

  const isInWishlist = (gameId) => {
    return wishlist.includes(gameId);
  };

  const toggleWishlist = (gameId) => {
    if (isInWishlist(gameId)) {
      removeFromWishlist(gameId);
    } else {
      addToWishlist(gameId);
    }
  };

  // Featured content
  const [featuredGames, setFeaturedGames] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const loadFeaturedContent = async () => {
    try {
      const [featured, releases, trendingGames, upcomingGames] = await Promise.all([
        mockApi.getFeaturedGames(),
        mockApi.getNewReleases(),
        mockApi.getTrending(),
        mockApi.getUpcoming()
      ]);
      
      setFeaturedGames(featured);
      setNewReleases(releases);
      setTrending(trendingGames);
      setUpcoming(upcomingGames);
    } catch (err) {
      console.error('Error loading featured content:', err);
    }
  };

  // Cargar contenido destacado al inicializar
  useEffect(() => {
    loadFeaturedContent();
  }, []);

  const value = {
    // Games and categories
    games,
    categories,
    loading,
    error,
    totalResults,
    
    // Filters
    filters,
    updateFilter,
    resetFilters,
    searchGames,
    loadGames,
    
    // Wishlist
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    
    // Featured content
    featuredGames,
    newReleases,
    trending,
    upcoming,
    loadFeaturedContent
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}