import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/principal_sistema_de_autenticacion';
import { useCart } from '../contexts/principal_carrito';
import { useUI } from '../contexts/principal_interfaz';
import { supabase } from '../lib/principal_supabase';
import { ShoppingCart, Heart, Play, X, Calendar, HardDrive, Globe, Monitor } from 'lucide-react';
import '../styles/principal_detalle_juego.css'; 

interface Game {
  id: string;
  slug: string;
  title: string;
  price: number;
  discount: number;
  platforms: string[];
  tags: string[];
  rating: number;
  ratings_count: number;
  release_date: string;
  developer: string;
  publisher: string;
  languages: string[];
  size_gb: number;
  about: string;
  youtube_id: string;
  cover: string;
  gallery: string[];
  stores: string[];
  sys_req_min: any;
  sys_req_rec: any;
}

export function GameDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useUI();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (slug) {
      loadGame();
    }
  }, [slug]);

  async function loadGame() {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setGame(data);
      }
    } catch (error) {
      console.error('Error loading game:', error);
      showToast('error', 'Error al cargar el juego');
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    if (!game) return;

    addItem({
      gameId: game.id,
      title: game.title,
      price: game.price,
      discount: game.discount,
      cover: game.cover,
    });

    showToast('success', `${game.title} agregado al carrito`);
  }

  if (loading) {
    return (
      <div className="game-detail">
        <div className="container">
          <div className="loading">Cargando juego...</div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="game-detail">
        <div className="container">
          <div className="empty-state">
            <h2>Juego no encontrado</h2>
            <Link to="/catalog" className="btn btn-primary">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = game.price * (1 - game.discount);
  const images = [game.cover, ...game.gallery];

  return (
    <div className="game-detail">
      <div className="game-hero" style={{ backgroundImage: `url(${game.cover})` }}>
        <div className="game-hero-overlay" />
      </div>

      <div className="container">
        <div className="game-header">
          <div className="game-header-left">
            <h1 className="game-title">{game.title}</h1>
            <div className="game-meta">
              <span className="game-developer">{game.developer}</span>
              <span className="game-separator">•</span>
              <span className="game-publisher">{game.publisher}</span>
            </div>
            <div className="game-tags">
              {game.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <div className="game-header-right">
            <div className="game-rating">
              <div className="rating-value">{game.rating.toFixed(1)}</div>
              <div className="rating-label">
                {game.ratings_count.toLocaleString()} valoraciones
              </div>
            </div>
          </div>
        </div>

        <div className="game-content">
          <div className="game-main">
            <div className="game-media">
              <div className="game-gallery">
                <img
                  src={images[selectedImage]}
                  alt={game.title}
                  className="gallery-main-image"
                />
                {game.youtube_id && (
                  <button
                    className="play-video-btn"
                    onClick={() => setShowVideo(true)}
                  >
                    <Play size={32} fill="currentColor" />
                    Ver trailer
                  </button>
                )}
              </div>
              <div className="gallery-thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${game.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="game-description">
              <h2 className="section-heading">Acerca de este juego</h2>
              <p className="game-about">{game.about}</p>
            </div>

            <div className="game-requirements">
              <h2 className="section-heading">Requisitos del sistema</h2>
              <div className="requirements-grid">
                <div className="requirement-card">
                  <h3>Mínimos</h3>
                  {game.sys_req_min && (
                    <ul>
                      <li><strong>SO:</strong> {game.sys_req_min.OS}</li>
                      <li><strong>CPU:</strong> {game.sys_req_min.CPU}</li>
                      <li><strong>RAM:</strong> {game.sys_req_min.RAM}</li>
                      <li><strong>GPU:</strong> {game.sys_req_min.GPU}</li>
                      <li><strong>Almacenamiento:</strong> {game.sys_req_min.Storage}</li>
                    </ul>
                  )}
                </div>
                <div className="requirement-card">
                  <h3>Recomendados</h3>
                  {game.sys_req_rec && (
                    <ul>
                      <li><strong>SO:</strong> {game.sys_req_rec.OS}</li>
                      <li><strong>CPU:</strong> {game.sys_req_rec.CPU}</li>
                      <li><strong>RAM:</strong> {game.sys_req_rec.RAM}</li>
                      <li><strong>GPU:</strong> {game.sys_req_rec.GPU}</li>
                      <li><strong>Almacenamiento:</strong> {game.sys_req_rec.Storage}</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="game-sidebar">
            <div className="purchase-card">
              <div className="purchase-header">
                {game.discount > 0 ? (
                  <div className="price-section">
                    <div className="discount-badge-large">
                      -{Math.round(game.discount * 100)}%
                    </div>
                    <div className="price-info">
                      <div className="original-price">S/ {game.price.toFixed(2)}</div>
                      <div className="final-price">S/ {finalPrice.toFixed(2)}</div>
                    </div>
                  </div>
                ) : game.price > 0 ? (
                  <div className="final-price-single">S/ {game.price.toFixed(2)}</div>
                ) : (
                  <div className="free-tag">Gratis para jugar</div>
                )}
              </div>

              <div className="purchase-actions">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} />
                  Agregar al carrito
                </button>
                {isAuthenticated && (
                  <button className="btn btn-secondary">
                    <Heart size={20} />
                    Lista de deseos
                  </button>
                )}
              </div>
            </div>

            <div className="game-info-card">
              <div className="info-item">
                <Calendar size={20} className="info-icon" />
                <div>
                  <div className="info-label">Fecha de lanzamiento</div>
                  <div className="info-value">
                    {new Date(game.release_date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="info-item">
                <Monitor size={20} className="info-icon" />
                <div>
                  <div className="info-label">Plataformas</div>
                  <div className="info-value">{game.platforms.join(', ')}</div>
                </div>
              </div>

              <div className="info-item">
                <Globe size={20} className="info-icon" />
                <div>
                  <div className="info-label">Idiomas</div>
                  <div className="info-value">{game.languages.slice(0, 3).join(', ')}</div>
                </div>
              </div>

              <div className="info-item">
                <HardDrive size={20} className="info-icon" />
                <div>
                  <div className="info-label">Tamaño</div>
                  <div className="info-value">{game.size_gb} GB</div>
                </div>
              </div>
            </div>

            {game.stores.length > 0 && (
              <div className="stores-card">
                <h3>Disponible en:</h3>
                <div className="stores-list">
                  {game.stores.map((store) => (
                    <div key={store} className="store-badge">{store}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showVideo && game.youtube_id && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-close-btn" onClick={() => setShowVideo(false)}>
              <X size={24} />
            </button>
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${game.youtube_id}?autoplay=1`}
                title={game.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
