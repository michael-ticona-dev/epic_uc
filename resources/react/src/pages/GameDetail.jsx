import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  Play, 
  Monitor, 
  HardDrive,
  Cpu,
  MemoryStick,
  Calendar,
  User,
  Building2,
  Globe,
  Star
} from 'lucide-react';

import MainLayout from '../layouts/MainLayout';
import MediaGallery from '../components/MediaGallery';
import VideoModal from '../components/VideoModal';
import PriceTag from '../components/PriceTag';
import Tag from '../components/Tag';
import RatingStars from '../components/RatingStars';
import Review from '../components/Review';
import GameGrid from '../components/GameGrid';
import { mockApi } from '../utils/mockApi';
import { format } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useUI } from '../contexts/UIContext';

export default function GameDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist, games } = useCatalog();
  const { showToast } = useUI();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedGames, setRelatedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    loadGameDetail();
  }, [slug]);

  const loadGameDetail = async () => {
    try {
      setLoading(true);
      const gameData = await mockApi.getGameBySlug(slug);
      
      if (!gameData) {
        navigate('/catalog');
        return;
      }

      setGame(gameData);

      // Cargar reseñas
      const reviewsData = await mockApi.getGameReviews(gameData.id);
      setReviews(reviewsData);

      // Cargar juegos relacionados (mismas etiquetas)
      const related = games
        .filter(g => 
          g.id !== gameData.id && 
          g.tags.some(tag => gameData.tags.includes(tag))
        )
        .slice(0, 4);
      setRelatedGames(related);

    } catch (error) {
      console.error('Error loading game:', error);
      showToast('Error al cargar el juego', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showToast('Inicia sesión para añadir juegos al carrito', 'warning');
      return;
    }

    addToCart(game);
    showToast(`${game.title} añadido al carrito`, 'success');
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      showToast('Inicia sesión para usar la lista de deseos', 'warning');
      return;
    }

    toggleWishlist(game.id);
    const action = isInWishlist(game.id) ? 'eliminado de' : 'añadido a';
    showToast(`${game.title} ${action} la lista de deseos`, 'success');
  };

  if (loading || !game) {
    return (
      <MainLayout>
        <div style={{ padding: 'var(--space-16)' }}>
          <div className="animate-pulse">
            <div className="skeleton skeleton-title" style={{ width: '300px', marginBottom: 'var(--space-4)' }} />
            <div className="skeleton skeleton-image" style={{ height: '400px', marginBottom: 'var(--space-6)' }} />
            <div className="skeleton skeleton-text" style={{ width: '100%', height: '100px' }} />
          </div>
        </div>
      </MainLayout>
    );
  }

  const breadcrumbItems = [
    { path: '/catalog', label: 'Tienda' },
    { path: `/game/${game.slug}`, label: game.title }
  ];

  return (
    <MainLayout breadcrumbItems={breadcrumbItems}>
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        
        {/* Game Header */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-8)'
        }}>
          {/* Media Gallery */}
          <div>
            <MediaGallery 
              images={[game.cover, ...(game.gallery || [])]}
              title={game.title}
            />
          </div>

          {/* Purchase Panel */}
          <div className="card">
            <h1 style={{ 
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: 'var(--space-4)'
            }}>
              {game.title}
            </h1>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <RatingStars 
                rating={game.rating} 
                showText={true}
                size={20}
              />
              <span style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.875rem',
                marginLeft: 'var(--space-2)'
              }}>
                ({format.number(game.ratingsCount)} valoraciones)
              </span>
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <PriceTag
                price={game.price * (1 - game.discount)}
                originalPrice={game.discount > 0 ? game.price : null}
                discount={game.discount}
                size="lg"
              />
            </div>

            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-6)'
            }}>
              {!isInCart(game.id) ? (
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                >
                  <ShoppingCart size={20} />
                  {game.price === 0 ? 'Obtener Gratis' : 'Añadir al Carrito'}
                </button>
              ) : (
                <div className="btn btn-secondary btn-lg" style={{ textAlign: 'center' }}>
                  ✓ En el carrito
                </div>
              )}

              <button
                onClick={handleToggleWishlist}
                className={`btn btn-lg ${isInWishlist(game.id) ? 'btn-accent' : 'btn-secondary'}`}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <Heart 
                  size={20} 
                  fill={isInWishlist(game.id) ? 'currentColor' : 'none'}
                />
                {isInWishlist(game.id) ? 'En Lista de Deseos' : 'Añadir a Lista'}
              </button>

              {game.youtubeId && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="btn btn-ghost btn-lg"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                >
                  <Play size={20} />
                  Ver Tráiler
                </button>
              )}
            </div>

            {/* Game Info */}
            <div style={{ 
              display: 'grid',
              gap: 'var(--space-3)',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <User size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Desarrollador:</span>
                <span>{game.developer}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Building2 size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Editor:</span>
                <span>{game.publisher}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Lanzamiento:</span>
                <span>{format.date(game.releaseDate)}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <HardDrive size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Tamaño:</span>
                <span>{format.fileSize(game.sizeGB * 1024 * 1024 * 1024)}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Globe size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-muted)' }}>Idiomas:</span>
                <span>{game.languages.join(', ')}</span>
              </div>
            </div>

            {/* Tags */}
            <div style={{ 
              marginTop: 'var(--space-6)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-2)'
            }}>
              {game.tags.map((tag, index) => (
                <Tag key={index} variant="primary">{tag}</Tag>
              ))}
            </div>
          </div>
        </div>

        {/* Game Details Tabs */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ 
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            marginBottom: 'var(--space-6)'
          }}>
            {[
              { id: 'about', label: 'Descripción' },
              { id: 'specs', label: 'Requisitos' },
              { id: 'reviews', label: `Reseñas (${reviews.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-ghost ${activeTab === tab.id ? 'btn-primary' : ''}`}
                style={{ 
                  borderRadius: '0',
                  borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: '-1px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'about' && (
              <div>
                <p style={{ 
                  fontSize: '1.125rem',
                  lineHeight: 1.7,
                  marginBottom: 'var(--space-6)'
                }}>
                  {game.about}
                </p>

                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--space-6)'
                }}>
                  <div className="card-compact">
                    <h3 style={{ marginBottom: 'var(--space-3)' }}>Plataformas</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {game.platforms.map(platform => (
                        <Tag key={platform}>{platform}</Tag>
                      ))}
                    </div>
                  </div>

                  <div className="card-compact">
                    <h3 style={{ marginBottom: 'var(--space-3)' }}>Disponible en</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {game.stores.map(store => (
                        <Tag key={store}>{store}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-6)'
              }}>
                <div className="card">
                  <h3 style={{ 
                    color: 'var(--success)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <Monitor size={20} />
                    Requisitos Mínimos
                  </h3>
                  <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Cpu size={16} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-muted)' }}>CPU:</span>
                      <span>{game.sysReqMin.cpu}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Monitor size={16} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-muted)' }}>GPU:</span>
                      <span>{game.sysReqMin.gpu}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <MemoryStick size={16} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-muted)' }}>RAM:</span>
                      <span>{game.sysReqMin.ram}</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 style={{ 
                    color: 'var(--primary)',
                    marginBottom: 'var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)'
                  }}>
                    <Monitor size={20} />
                    Requisitos Recomendados
                  </h3>
                  <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Cpu size={16} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-muted)' }}>CPU:</span>
                      <span>{game.sysReqRec.cpu}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Monitor size={16} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-muted)' }}>GPU:</span>
                      <span>{game.sysReqRec.gpu}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <MemoryStick size={16} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-muted)' }}>RAM:</span>
                      <span>{game.sysReqRec.ram}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviews.length > 0 ? (
                  <div style={{ 
                    display: 'grid',
                    gap: 'var(--space-4)'
                  }}>
                    {reviews.map(review => (
                      <Review key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center',
                    padding: 'var(--space-16)',
                    color: 'var(--text-muted)'
                  }}>
                    <Star size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
                    <p>Aún no hay reseñas para este juego.</p>
                    <p>¡Sé el primero en compartir tu opinión!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <section>
            <h2 style={{ 
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: 'var(--space-6)'
            }}>
              Juegos Relacionados
            </h2>
            <GameGrid games={relatedGames} showWishlist={true} />
          </section>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal
        youtubeId={game.youtubeId}
        title={game.title}
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />

      <style jsx>{`
        @media (max-width: 768px) {
          .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
          
          .card {
            order: 2;
          }
        }
      `}</style>
    </MainLayout>
  );
}