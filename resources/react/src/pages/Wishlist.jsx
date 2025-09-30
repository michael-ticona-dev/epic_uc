import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import GameGrid from '../components/GameGrid';
import EmptyState from '../components/EmptyState';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { mockApi } from '../utils/mockApi';

export default function Wishlist() {
  const { isAuthenticated } = useAuth();
  const { wishlist, removeFromWishlist } = useCatalog();
  const { addToCart, isInCart } = useCart();
  const { showToast } = useUI();
  
  const [wishlistGames, setWishlistGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlistGames();
  }, [wishlist]);

  const loadWishlistGames = async () => {
    try {
      setLoading(true);
      const { games } = await mockApi.getGames();
      const filteredGames = games.filter(game => wishlist.includes(game.id));
      setWishlistGames(filteredGames);
    } catch (error) {
      console.error('Error loading wishlist games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (game) => {
    addToCart(game);
    showToast(`${game.title} añadido al carrito`, 'success');
  };

  const handleRemoveFromWishlist = (game) => {
    removeFromWishlist(game.id);
    showToast(`${game.title} eliminado de la lista de deseos`, 'success');
  };

  const handleAddAllToCart = () => {
    const availableGames = wishlistGames.filter(game => !isInCart(game.id));
    availableGames.forEach(game => addToCart(game));
    showToast(`${availableGames.length} juegos añadidos al carrito`, 'success');
  };

  const handleClearWishlist = () => {
    wishlistGames.forEach(game => removeFromWishlist(game.id));
    showToast('Lista de deseos vaciada', 'success');
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
          <EmptyState
            title="Inicia sesión para ver tu lista de deseos"
            description="Guarda tus juegos favoritos para comprarlos más tarde"
            icon="❤️"
            action={
              <a href="/signin" className="btn btn-primary">
                Iniciar Sesión
              </a>
            }
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-8)'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <Heart size={32} style={{ color: 'var(--error)' }} />
              Lista de Deseos
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {wishlistGames.length} {wishlistGames.length === 1 ? 'juego' : 'juegos'} en tu lista
            </p>
          </div>

          {/* Actions */}
          {wishlistGames.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                onClick={handleAddAllToCart}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                <ShoppingCart size={16} />
                Añadir Todo al Carrito
              </button>
              <button
                onClick={handleClearWishlist}
                className="btn btn-ghost"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-2)',
                  color: 'var(--error)'
                }}
              >
                <Trash2 size={16} />
                Vaciar Lista
              </button>
            </div>
          )}
        </div>

        {/* Games Grid */}
        {wishlistGames.length === 0 && !loading ? (
          <EmptyState
            title="Tu lista de deseos está vacía"
            description="Explora nuestro catálogo y añade juegos que te interesen"
            icon="💝"
            action={
              <a href="/catalog" className="btn btn-primary">
                Explorar Juegos
              </a>
            }
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton" style={{ height: '400px' }} />
              ))
            ) : (
              wishlistGames.map((game, index) => (
                <div key={game.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div style={{ position: 'relative' }}>
                    <div className="game-card">
                      <div className="game-card-image">
                        <img src={game.cover} alt={game.title} />
                        
                        {game.discount > 0 && (
                          <div className="game-card-discount">
                            -{Math.round(game.discount * 100)}%
                          </div>
                        )}

                        {/* Remove from wishlist button */}
                        <button
                          onClick={() => handleRemoveFromWishlist(game)}
                          className="btn btn-icon"
                          style={{
                            position: 'absolute',
                            top: 'var(--space-3)',
                            right: 'var(--space-3)',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'var(--error)',
                            width: '32px',
                            height: '32px'
                          }}
                        >
                          <Heart size={16} fill="currentColor" />
                        </button>
                      </div>

                      <div className="game-card-content">
                        <h3 className="game-card-title">{game.title}</h3>
                        <p className="game-card-developer">{game.developer}</p>

                        <div className="game-card-tags">
                          {game.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span key={tagIndex} className="tag">{tag}</span>
                          ))}
                        </div>

                        <div className="game-card-footer">
                          <div className="price-tag">
                            {game.discount > 0 && (
                              <span className="price-original">
                                €{game.price.toFixed(2)}
                              </span>
                            )}
                            <span className="price-current">
                              {game.price === 0 ? 'GRATIS' : `€${(game.price * (1 - game.discount)).toFixed(2)}`}
                            </span>
                          </div>

                          {!isInCart(game.id) ? (
                            <button
                              onClick={() => handleAddToCart(game)}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                            >
                              <ShoppingCart size={16} />
                              {game.price === 0 ? 'Obtener' : 'Añadir'}
                            </button>
                          ) : (
                            <span 
                              className="btn btn-secondary btn-sm"
                              style={{ cursor: 'default' }}
                            >
                              En el carrito
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Stats */}
        {wishlistGames.length > 0 && (
          <div style={{
            marginTop: 'var(--space-12)',
            padding: 'var(--space-6)',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Resumen de tu Lista de Deseos</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 'var(--space-6)'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                  {wishlistGames.length}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Juegos guardados
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
                  €{wishlistGames.reduce((total, game) => total + (game.price * (1 - game.discount)), 0).toFixed(2)}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Valor total
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                  €{wishlistGames.reduce((total, game) => total + (game.price * game.discount), 0).toFixed(2)}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Ahorros potenciales
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}