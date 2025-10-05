import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/principal_supabase';
import { Search, SlidersHorizontal } from 'lucide-react';
import '../styles/principal_catalogo_juegos.css';

interface Game {
  id: string;
  slug: string;
  title: string;
  price: number;
  discount: number;
  cover: string;
  rating: number;
  tags: string[];
}

export function Catalog() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('title');

  const allTags = ['RPG', 'Mundo Abierto', 'Shooter', 'Battle Royale', 'Sandbox', 'Aventura', 'Fantasía', 'Futurista', 'Acción'];

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    try {
      let query = supabase
        .from('games')
        .select('*')
        .order(sortBy, { ascending: sortBy === 'price' });

      const { data, error } = await query;

      if (error) throw error;

      let filtered = data || [];

      if (search) {
        filtered = filtered.filter((game) =>
          game.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (selectedTags.length > 0) {
        filtered = filtered.filter((game) =>
          selectedTags.some((tag) => game.tags?.includes(tag))
        );
      }

      setGames(filtered);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGames();
  }, [search, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );
  };

  if (loading) {
    return (
      <div className="catalog">
        <div className="container">
          <div className="loading">Cargando catálogo...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog">
      <div className="container">
        <div className="catalog-header">
          <h1 className="catalog-title">Catálogo de juegos</h1>
          <p className="catalog-subtitle">Explora nuestra colección de {games.length} juegos</p>
        </div>

        <div className="catalog-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar juegos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-label">
              <SlidersHorizontal size={16} />
              <span>Filtros:</span>
            </div>
            <div className="tag-filters">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={selectedTags.includes(tag) ? 'tag-btn active' : 'tag-btn'}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="title">Título</option>
            <option value="price">Precio</option>
            <option value="rating">Valoración</option>
            <option value="release_date">Fecha de lanzamiento</option>
          </select>
        </div>

        <div className="game-grid">
          {games.map((game) => (
            <Link key={game.id} to={`/game/${game.slug}`} className="game-card">
              <img src={game.cover} alt={game.title} className="game-card-image" loading="lazy" />
              <div className="game-card-content">
                <h3 className="game-card-title">{game.title}</h3>
                <div className="game-card-tags">
                  {game.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="game-card-footer">
                  {game.discount > 0 ? (
                    <div className="price-group">
                      <span className="discount-badge">-{Math.round(game.discount * 100)}%</span>
                      <div className="price-stack">
                        <span className="price-original">S/ {game.price.toFixed(2)}</span>
                        <span className="price-final">
                          S/ {(game.price * (1 - game.discount)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : game.price > 0 ? (
                    <span className="price">S/ {game.price.toFixed(2)}</span>
                  ) : (
                    <span className="price-free">Gratis</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {games.length === 0 && (
          <div className="empty-state">
            <p>No se encontraron juegos con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
