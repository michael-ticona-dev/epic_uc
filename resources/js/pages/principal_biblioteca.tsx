import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/principal_sistema_de_autenticacion';
import { supabase } from '../lib/principal_supabase';
import { Library as LibraryIcon, Play, Download, Clock } from 'lucide-react';
import '../styles/principal_biblioteca.css';

interface LibraryGame {
  id: string;
  game_id: string;
  acquired_at: string;
  games: {
    slug: string;
    title: string;
    cover: string;
    size_gb: number;
    platforms: string[];
  };
}

export function Library() {
  const { user } = useAuth();
  const [libraryGames, setLibraryGames] = useState<LibraryGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'installed' | 'recent'>('all');

  useEffect(() => {
    if (user) {
      loadLibrary();
    }
  }, [user]);

  async function loadLibrary() {
    try {
      const { data, error } = await supabase
        .from('library')
        .select(`
          id,
          game_id,
          acquired_at,
          games (
            slug,
            title,
            cover,
            size_gb,
            platforms
          )
        `)
        .eq('user_id', user?.id)
        .order('acquired_at', { ascending: false });

      if (error) throw error;
      setLibraryGames(data || []);
    } catch (error) {
      console.error('Error loading library:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredGames = libraryGames.filter((item) => {
    if (filter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(item.acquired_at) >= weekAgo;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="library-page">
        <div className="container">
          <div className="loading">Cargando biblioteca...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="container">
        <div className="library-header">
          <div className="library-header-content">
            <LibraryIcon size={48} className="library-icon" />
            <div>
              <h1 className="library-title">Mi Biblioteca</h1>
              <p className="library-subtitle">
                {libraryGames.length} {libraryGames.length === 1 ? 'juego' : 'juegos'} en tu colección
              </p>
            </div>
          </div>
        </div>

        <div className="library-stats">
          <div className="stat-card">
            <div className="stat-value">{libraryGames.length}</div>
            <div className="stat-label">Total de juegos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {libraryGames.reduce((sum, item) => sum + (item.games?.size_gb || 0), 0).toFixed(1)} GB
            </div>
            <div className="stat-label">Espacio total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {libraryGames.filter(item => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(item.acquired_at) >= weekAgo;
              }).length}
            </div>
            <div className="stat-label">Agregados esta semana</div>
          </div>
        </div>

        <div className="library-filters">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={filter === 'recent' ? 'filter-btn active' : 'filter-btn'}
          >
            <Clock size={16} />
            Recientes
          </button>
        </div>

        {filteredGames.length === 0 ? (
          <div className="empty-library">
            <LibraryIcon size={64} className="empty-icon" />
            <h3>Tu biblioteca está vacía</h3>
            <p>Comienza a agregar juegos desde el catálogo</p>
            <Link to="/catalog" className="btn btn-primary">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="library-grid">
            {filteredGames.map((item) => (
              <div key={item.id} className="library-game-card">
                <Link to={`/game/${item.games?.slug}`} className="library-game-image-wrapper">
                  <img
                    src={item.games?.cover}
                    alt={item.games?.title}
                    className="library-game-image"
                    loading="lazy"
                  />
                  <div className="library-game-overlay">
                    <button className="play-btn">
                      <Play size={24} fill="currentColor" />
                    </button>
                  </div>
                </Link>
                <div className="library-game-content">
                  <Link to={`/game/${item.games?.slug}`} className="library-game-title">
                    {item.games?.title}
                  </Link>
                  <div className="library-game-meta">
                    <span className="library-game-size">
                      <Download size={14} />
                      {item.games?.size_gb} GB
                    </span>
                    <span className="library-game-date">
                      Agregado: {new Date(item.acquired_at).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="library-game-platforms">
                    {item.games?.platforms?.slice(0, 3).map((platform) => (
                      <span key={platform} className="platform-badge">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
