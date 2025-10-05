import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Gamepad2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/principal_supabase';
import { useUI } from '../contexts/principal_interfaz';
import '../styles/principal_proximos_lanzamientos.css';

interface UpcomingGame {
  id: string;
  game_title: string;
  game_slug: string;
  cover_image: string;
  release_date: string | null;
  release_year: number;
  platforms: string[];
  expected_price: number;
  hype_score: number;
  developer: string;
  publisher: string;
  description: string;
  trailer_url: string | null;
}

export function Upcoming() {
  const [games, setGames] = useState<UpcomingGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const { showToast } = useUI();

  useEffect(() => {
    loadGames();
  }, []);

  async function loadGames() {
    try {
      const { data, error } = await supabase
        .from('upcoming_releases')
        .select('*')
        .order('hype_score', { ascending: false });

      if (error) throw error;

      setGames(data || []);

      if (!data || data.length === 0) {
        console.log('No upcoming games found, updating automatically...');
        setTimeout(() => updateGames(), 1000);
      }
    } catch (error) {
      console.error('Error loading upcoming games:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateGames() {
    setUpdating(true);
    showToast('info', 'Actualizando próximos lanzamientos...');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upcoming`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        showToast('success', `Actualizados: ${data.count} próximos lanzamientos`);
        await loadGames();
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (error) {
      console.error('Error updating:', error);
      showToast('error', 'Error al actualizar');
    } finally {
      setUpdating(false);
    }
  }

  const years = Array.from(new Set(games.map(g => g.release_year))).sort();

  const filteredGames = selectedYear === 'all'
    ? games
    : games.filter(g => g.release_year === selectedYear);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'TBA';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="upcoming-page">
        <div className="container">
          <div className="loading">Cargando próximos lanzamientos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-page">
      <div className="container">
        <div className="upcoming-header">
          <div className="upcoming-header-content">
            <Gamepad2 size={48} className="upcoming-icon" />
            <div>
              <h1 className="upcoming-title">Próximos Lanzamientos 2025-2026</h1>
              <p className="upcoming-subtitle">
                Los juegos más esperados de PC, PlayStation 5 y Xbox Series X/S
              </p>
            </div>
          </div>
          <button
            onClick={updateGames}
            disabled={updating}
            className="btn btn-primary"
          >
            <RefreshCw size={20} className={updating ? 'spinning' : ''} />
            {updating ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        <div className="upcoming-stats">
          <div className="stat-card">
            <div className="stat-value">{games.length}</div>
            <div className="stat-label">Juegos próximos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{years.length}</div>
            <div className="stat-label">Años</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {games.filter(g => g.release_date).length}
            </div>
            <div className="stat-label">Con fecha confirmada</div>
          </div>
        </div>

        <div className="year-filters">
          <button
            onClick={() => setSelectedYear('all')}
            className={selectedYear === 'all' ? 'year-btn active' : 'year-btn'}
          >
            Todos
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={selectedYear === year ? 'year-btn active' : 'year-btn'}
            >
              {year}
            </button>
          ))}
        </div>

        {filteredGames.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron juegos próximos. Haz clic en "Actualizar" para cargar los datos.</p>
          </div>
        ) : (
          <div className="upcoming-grid">
            {filteredGames.map((game) => (
              <div key={game.id} className="upcoming-card">
                <Link to={`/game/${game.game_slug}`} className="game-cover">
                  <img src={game.cover_image} alt={game.game_title} />
                  <div className="hype-badge">
                    Hype: {game.hype_score.toLocaleString()}
                  </div>
                </Link>
                <div className="game-info">
                  <Link to={`/game/${game.game_slug}`} className="game-title">
                    {game.game_title}
                  </Link>
                  <div className="game-meta">
                    <div className="meta-item">
                      <Calendar size={14} />
                      <span>{formatDate(game.release_date)}</span>
                    </div>
                    <div className="platforms-list">
                      {game.platforms.slice(0, 3).map((platform, idx) => (
                        <span key={idx} className="platform-badge">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="game-developers">
                    <span className="developer">{game.developer}</span>
                    {game.publisher !== game.developer && (
                      <span className="publisher"> • {game.publisher}</span>
                    )}
                  </div>
                  {game.description && (
                    <p className="game-description">
                      {game.description.substring(0, 150)}...
                    </p>
                  )}
                  <div className="game-footer">
                    <span className="price">
                      S/ {game.expected_price.toFixed(2)}
                    </span>
                    <Link
                      to={`/game/${game.game_slug}`}
                      className="btn btn-primary btn-sm"
                    >
                      Ver detalles
                    </Link>
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
