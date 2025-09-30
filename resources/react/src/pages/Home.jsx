import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, TrendingUp, Clock, Zap } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import GameCard from '../components/GameCard';
import { useCatalog } from '../contexts/CatalogContext';

export default function Home() {
  const { 
    featuredGames, 
    newReleases, 
    trending, 
    upcoming, 
    loadFeaturedContent 
  } = useCatalog();
  
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    loadFeaturedContent();
  }, [loadFeaturedContent]);

  // Auto-play del hero carousel
  useEffect(() => {
    if (autoPlay && featuredGames.length > 0) {
      const interval = setInterval(() => {
        setCurrentHeroIndex(prev => 
          prev === featuredGames.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoPlay, featuredGames.length]);

  const goToHeroSlide = (index) => {
    setCurrentHeroIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000); // Reanudar auto-play después de 10s
  };

  const goToPrevHero = () => {
    setCurrentHeroIndex(prev => 
      prev === 0 ? featuredGames.length - 1 : prev - 1
    );
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const goToNextHero = () => {
    setCurrentHeroIndex(prev => 
      prev === featuredGames.length - 1 ? 0 : prev + 1
    );
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const currentGame = featuredGames[currentHeroIndex];

  return (
    <MainLayout showBreadcrumbs={false}>
      {/* Hero Section */}
      {featuredGames.length > 0 && (
        <section style={{ 
          position: 'relative',
          height: '80vh',
          minHeight: '600px',
          marginBottom: 'var(--space-16)',
          borderRadius: 'var(--radius-2xl)',
          overflow: 'hidden'
        }}>
          {/* Background Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${currentGame?.gallery?.[0] || currentGame?.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'all 1s ease-in-out'
          }} />

          {/* Content */}
          <div className="container" style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            zIndex: 2
          }}>
            <div style={{ maxWidth: '600px' }}>
              <div className="animate-fade-in">
                <h1 style={{ 
                  fontSize: '3.5rem',
                  fontWeight: '700',
                  marginBottom: 'var(--space-6)',
                  lineHeight: 1.2,
                  color: 'white',
                  textShadow: '0 2px 20px rgba(0,0,0,0.8)'
                }}>
                  {currentGame?.title}
                </h1>

                <p style={{ 
                  fontSize: '1.25rem',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: 'var(--space-8)',
                  lineHeight: 1.6,
                  textShadow: '0 1px 10px rgba(0,0,0,0.8)'
                }}>
                  {currentGame?.about}
                </p>

                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--space-4)',
                  alignItems: 'center',
                  marginBottom: 'var(--space-8)'
                }}>
                  <Link
                    to={`/game/${currentGame?.slug}`}
                    className="btn btn-primary btn-lg"
                  >
                    <Play size={20} />
                    Ver Juego
                  </Link>

                  {currentGame?.youtubeId && (
                    <button className="btn btn-secondary btn-lg">
                      <Play size={20} />
                      Ver Tráiler
                    </button>
                  )}
                </div>

                {/* Game Info */}
                <div style={{ 
                  display: 'flex',
                  gap: 'var(--space-6)',
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  <div>
                    <strong>Desarrollador:</strong> {currentGame?.developer}
                  </div>
                  <div>
                    <strong>Género:</strong> {currentGame?.tags?.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          {featuredGames.length > 1 && (
            <>
              <button
                onClick={goToPrevHero}
                className="btn btn-icon"
                style={{
                  position: 'absolute',
                  left: 'var(--space-6)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 3,
                  width: '48px',
                  height: '48px'
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={goToNextHero}
                className="btn btn-icon"
                style={{
                  position: 'absolute',
                  right: 'var(--space-6)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 3,
                  width: '48px',
                  height: '48px'
                }}
              >
                <ChevronRight size={24} />
              </button>

              {/* Indicators */}
              <div style={{
                position: 'absolute',
                bottom: 'var(--space-6)',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 'var(--space-3)',
                zIndex: 3
              }}>
                {featuredGames.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToHeroSlide(index)}
                    style={{
                      width: index === currentHeroIndex ? '32px' : '12px',
                      height: '4px',
                      border: 'none',
                      borderRadius: '2px',
                      background: index === currentHeroIndex 
                        ? 'white' 
                        : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'all var(--transition)'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* New Releases */}
      <section className="container" style={{ marginBottom: 'var(--space-16)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-8)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Zap size={28} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
              Novedades
            </h2>
          </div>
          <Link to="/catalog?sort=release-date" className="btn btn-ghost">
            Ver todas
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)'
        }}>
          {newReleases.slice(0, 4).map((game, index) => (
            <div key={game.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="container" style={{ marginBottom: 'var(--space-16)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-8)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <TrendingUp size={28} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
              Tendencias
            </h2>
          </div>
          <Link to="/catalog?sort=rating" className="btn btn-ghost">
            Ver todas
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)'
        }}>
          {trending.slice(0, 4).map((game, index) => (
            <div key={game.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="container" style={{ marginBottom: 'var(--space-16)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-8)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <Clock size={28} style={{ color: 'var(--warning)' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
              Próximamente
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)'
        }}>
          {upcoming.slice(0, 4).map((game, index) => (
            <div key={game.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ 
        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
        margin: '0 var(--space-4)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-16) var(--space-8)',
        textAlign: 'center',
        marginBottom: 'var(--space-16)'
      }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: 'var(--space-4)',
            color: 'white'
          }}>
            No te pierdas ninguna oferta
          </h2>
          <p style={{ 
            fontSize: '1.125rem',
            marginBottom: 'var(--space-8)',
            color: 'rgba(255,255,255,0.9)'
          }}>
            Suscríbete a nuestro boletín y recibe las mejores ofertas directamente en tu email.
          </p>
          <form style={{ 
            display: 'flex', 
            gap: 'var(--space-4)',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <input
              type="email"
              placeholder="tu@email.com"
              style={{
                flex: 1,
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                fontSize: '1rem'
              }}
            />
            <button type="submit" className="btn btn-secondary" style={{ color: 'var(--bg)' }}>
              Suscribirse
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}