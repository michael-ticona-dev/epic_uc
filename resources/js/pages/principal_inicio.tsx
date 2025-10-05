import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/principal_supabase';
import { ChevronRight, Star, TrendingUp, Zap, Calendar, ChevronLeft } from 'lucide-react';
import '../styles/principal_inicio.css';

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

export function Home() {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);
  const [freeGames, setFreeGames] = useState<Game[]>([]);
  const [discountedGames, setDiscountedGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<any[]>([]);
  const [recentReleases, setRecentReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const { data: topRated } = await supabase
        .from('games')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);

      const { data: recentReleasesData } = await supabase
        .from('recent_releases')
        .select('*')
        .order('release_date', { ascending: false })
        .limit(12);

      const { data: newest } = await supabase
        .from('games')
        .select('*')
        .order('release_date', { ascending: false })
        .limit(6);

      const { data: free } = await supabase
        .from('games')
        .select('*')
        .eq('price', 0)
        .limit(6);

      const { data: discounted } = await supabase
        .from('games')
        .select('*')
        .gt('discount', 0)
        .order('discount', { ascending: false })
        .limit(6);

      setFeaturedGames(topRated || []);
      setNewGames(newest || []);
      setFreeGames(free || []);
      setDiscountedGames(discounted || []);
      setRecentReleases(recentReleasesData || []);

      const { data: upcomingData } = await supabase
        .from('upcoming_releases')
        .select('*')
        .order('hype_score', { ascending: false })
        .limit(12);

      setUpcomingGames(upcomingData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  const renderGameCard = (game: Game) => (
    <Link key={game.id} to={`/game/${game.slug}`} className="game-card">
      <img src={game.cover} alt={game.title} className="game-card-image" loading="lazy" />
      <div className="game-card-content">
        <h3 className="game-card-title">{game.title}</h3>
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
  );

  if (loading) {
    return (
      <div className="home">
        <div className="container">
          <div className="loading">Cargando...</div>
        </div>
      </div>
    );
  }

  const heroGames = featuredGames.slice(0, 3);

  return (
    <div className="home">
      <section className="hero-carousel">
        <div className="carousel-wrapper">
          {heroGames.map((game, index) => (
            <div
              key={game.id}
              className={`hero-slide ${index === heroIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${game.cover})` }}
            >
              <div className="hero-overlay" />
              <div className="container">
                <div className="hero-content">
                  <div className="hero-badge">Destacado</div>
                  <h1 className="hero-title">{game.title}</h1>
                  <div className="hero-rating">
                    <Star size={20} fill="var(--warning)" stroke="var(--warning)" />
                    <span>{game.rating.toFixed(1)}</span>
                  </div>
                  <div className="hero-actions">
                    <Link to={`/game/${game.slug}`} className="btn btn-primary btn-lg">
                      Ver detalles
                    </Link>
                    <Link to="/catalog" className="btn btn-secondary btn-lg">
                      Explorar más
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            className="carousel-btn prev"
            onClick={() => setHeroIndex((prev) => (prev - 1 + heroGames.length) % heroGames.length)}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="carousel-btn next"
            onClick={() => setHeroIndex((prev) => (prev + 1) % heroGames.length)}
          >
            <ChevronRight size={24} />
          </button>
          <div className="carousel-dots">
            {heroGames.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === heroIndex ? 'active' : ''}`}
                onClick={() => setHeroIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {discountedGames.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-header-left">
                <Zap className="section-icon" />
                <h2 className="section-title">Ofertas especiales</h2>
              </div>
              <Link to="/deals" className="section-link">
                Ver todas <ChevronRight size={16} />
              </Link>
            </div>
            <div className="game-grid">
              {discountedGames.map(renderGameCard)}
            </div>
          </div>
        </section>
      )}

      {freeGames.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <div className="section-header-left">
                <TrendingUp className="section-icon" />
                <h2 className="section-title">Juegos gratis</h2>
              </div>
              <Link to="/catalog" className="section-link">
                Ver todos <ChevronRight size={16} />
              </Link>
            </div>
            <div className="game-grid">
              {freeGames.map(renderGameCard)}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <Star className="section-icon" />
              <h2 className="section-title">Mejor valorados</h2>
            </div>
            <Link to="/catalog" className="section-link">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
          <div className="game-grid">
            {featuredGames.map(renderGameCard)}
          </div>
        </div>
      </section>

      {recentReleases.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <div className="section-header-left">
                <Calendar className="section-icon" />
                <h2 className="section-title">Recién lanzados 2024-2025</h2>
              </div>
              <Link to="/catalog" className="section-link">
                Ver todos <ChevronRight size={16} />
              </Link>
            </div>
            <div className="game-grid">
              {recentReleases.map((game) => (
                <Link key={game.id} to={`/game/${game.game_slug}`} className="game-card">
                  <img src={game.cover_image} alt={game.game_title} className="game-card-image" loading="lazy" />
                  <div className="game-card-content">
                    <h3 className="game-card-title">{game.game_title}</h3>
                    <div className="game-card-footer">
                      <span className="price">S/ {game.price.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {upcomingGames.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-header-left">
                <Calendar className="section-icon" />
                <h2 className="section-title">Próximos lanzamientos 2025-2026</h2>
              </div>
              <Link to="/upcoming" className="section-link">
                Ver todos <ChevronRight size={16} />
              </Link>
            </div>
            <div className="game-grid">
              {upcomingGames.map((game) => (
                <Link key={game.id} to={`/game/${game.game_slug}`} className="game-card">
                  <img
                    src={game.cover_image}
                    alt={game.game_title}
                    className="game-card-image"
                    loading="lazy"
                  />
                  <div className="game-card-content">
                    <h3 className="game-card-title">{game.game_title}</h3>
                    <p className="game-card-date">
                      {game.release_date ? new Date(game.release_date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }) : 'TBA'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
