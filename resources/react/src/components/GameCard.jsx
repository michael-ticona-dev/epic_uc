import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useUI } from '../contexts/UIContext';
import PriceTag from './PriceTag';
import Tag from './Tag';
import RatingStars from './RatingStars';

export default function GameCard({ game, showWishlist = true }) {
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useCatalog();
  const { showToast } = useUI();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showToast('Inicia sesión para añadir juegos al carrito', 'warning');
      return;
    }

    addToCart(game);
    showToast(`${game.title} añadido al carrito`, 'success');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showToast('Inicia sesión para usar la lista de deseos', 'warning');
      return;
    }

    toggleWishlist(game.id);
    const action = isInWishlist(game.id) ? 'eliminado de' : 'añadido a';
    showToast(`${game.title} ${action} la lista de deseos`, 'success');
  };

  return (
    <Link to={`/game/${game.slug}`} className="game-card">
      <div className="game-card-image">
        <img src={game.cover} alt={game.title} />
        
        {game.discount > 0 && (
          <div className="game-card-discount">
            -{Math.round(game.discount * 100)}%
          </div>
        )}

        {showWishlist && isAuthenticated && (
          <button
            onClick={handleToggleWishlist}
            className="btn btn-icon btn-ghost"
            style={{
              position: 'absolute',
              top: 'var(--space-3)',
              right: 'var(--space-3)',
              background: 'rgba(0, 0, 0, 0.7)',
              color: isInWishlist(game.id) ? 'var(--error)' : 'var(--text-muted)'
            }}
          >
            <Heart 
              size={20} 
              fill={isInWishlist(game.id) ? 'currentColor' : 'none'} 
            />
          </button>
        )}
      </div>

      <div className="game-card-content">
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-developer">{game.developer}</p>

        <div className="game-card-tags">
          {game.tags.slice(0, 3).map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <RatingStars rating={game.rating} />
        </div>

        <div className="game-card-footer">
          <PriceTag
            price={game.price * (1 - game.discount)}
            originalPrice={game.discount > 0 ? game.price : null}
            discount={game.discount}
          />

          {!isInCart(game.id) ? (
            <button
              onClick={handleAddToCart}
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
    </Link>
  );
}