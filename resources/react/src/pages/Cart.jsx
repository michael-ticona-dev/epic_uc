import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Tag as TagIcon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import EmptyState from '../components/EmptyState';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { format } from '../utils/format';

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { 
    items, 
    subtotal, 
    tax, 
    discount, 
    total, 
    coupon,
    updateQuantity, 
    removeFromCart, 
    applyCoupon, 
    removeCoupon 
  } = useCart();
  const { showToast } = useUI();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleQuantityChange = (gameId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(gameId);
      return;
    }
    updateQuantity(gameId, newQuantity);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponLoading(true);
    try {
      const result = applyCoupon(couponCode);
      if (result.success) {
        showToast(result.message, 'success');
        setCouponCode('');
      } else {
        showToast(result.message, 'error');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    showToast('Cupón eliminado', 'success');
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
          <EmptyState
            title="Inicia sesión para ver tu carrito"
            description="Guarda tus juegos favoritos y procede con la compra"
            icon="🛒"
            action={
              <Link to="/signin" className="btn btn-primary">
                Iniciar Sesión
              </Link>
            }
          />
        </div>
      </MainLayout>
    );
  }

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
          <EmptyState
            title="Tu carrito está vacío"
            description="Explora nuestro catálogo y añade algunos juegos increíbles"
            icon="🛒"
            action={
              <Link to="/catalog" className="btn btn-primary">
                Explorar Juegos
              </Link>
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
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: 'var(--space-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}>
            <ShoppingCart size={32} style={{ color: 'var(--primary)' }} />
            Carrito de Compras
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {items.length} {items.length === 1 ? 'artículo' : 'artículos'} en tu carrito
          </p>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: 'var(--space-8)'
        }}>
          
          {/* Cart Items */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {items.map((item, index) => (
                <div
                  key={item.gameId}
                  className="card animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    display: 'flex',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-4)'
                  }}
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    style={{
                      width: '120px',
                      height: '90px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      marginBottom: 'var(--space-2)',
                      fontSize: '1.125rem'
                    }}>
                      {item.title}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      marginBottom: 'var(--space-3)'
                    }}>
                      <div className="price-tag">
                        {item.discount > 0 && (
                          <span className="price-original">
                            {format.currency(item.originalPrice)}
                          </span>
                        )}
                        <span className="price-current">
                          {format.currency(item.price)}
                        </span>
                      </div>
                      
                      {item.discount > 0 && (
                        <div className="badge badge-success">
                          -{Math.round(item.discount * 100)}%
                        </div>
                      )}
                    </div>

                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      {/* Quantity Controls */}
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)'
                      }}>
                        <button
                          onClick={() => handleQuantityChange(item.gameId, item.quantity - 1)}
                          className="btn btn-ghost btn-sm btn-icon"
                        >
                          <Minus size={16} />
                        </button>
                        <span style={{ 
                          minWidth: '40px',
                          textAlign: 'center',
                          fontWeight: '600'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.gameId, item.quantity + 1)}
                          className="btn btn-ghost btn-sm btn-icon"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.gameId)}
                        className="btn btn-ghost btn-sm"
                        style={{ 
                          color: 'var(--error)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)'
                        }}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div style={{ 
                    textAlign: 'right',
                    minWidth: '100px'
                  }}>
                    <div style={{ 
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: 'var(--primary)'
                    }}>
                      {format.currency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: 'var(--space-6)'
            }}>
              Resumen del Pedido
            </h2>

            {/* Coupon Section */}
            <div style={{ 
              marginBottom: 'var(--space-6)',
              paddingBottom: 'var(--space-6)',
              borderBottom: '1px solid var(--border)'
            }}>
              {coupon ? (
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--success)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--success)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <TagIcon size={16} />
                    <span style={{ fontWeight: '600' }}>{coupon.code}</span>
                    <span style={{ fontSize: '0.875rem' }}>({coupon.description})</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--error)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <div>
                  <label style={{ 
                    display: 'block',
                    marginBottom: 'var(--space-2)',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    Código de cupón
                  </label>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <input
                      type="text"
                      placeholder="Ej: EPIC10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      style={{
                        flex: 1,
                        padding: 'var(--space-2) var(--space-3)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        background: 'var(--surface-2)',
                        color: 'var(--text)',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="btn btn-primary btn-sm"
                      disabled={couponLoading || !couponCode.trim()}
                    >
                      {couponLoading ? 'Aplicando...' : 'Aplicar'}
                    </button>
                  </div>
                  <p style={{ 
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: 'var(--space-2)'
                  }}>
                    Prueba con: EPIC10 (10% de descuento)
                  </p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-3)'
              }}>
                <span>Subtotal:</span>
                <span>{format.currency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-3)',
                  color: 'var(--success)'
                }}>
                  <span>Descuento:</span>
                  <span>-{format.currency(discount)}</span>
                </div>
              )}

              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-3)',
                color: 'var(--text-muted)',
                fontSize: '0.875rem'
              }}>
                <span>IVA (21%):</span>
                <span>{format.currency(tax)}</span>
              </div>

              <hr style={{ 
                border: 'none',
                borderTop: '1px solid var(--border)',
                margin: 'var(--space-4) 0'
              }} />

              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--primary)'
              }}>
                <span>Total:</span>
                <span>{format.currency(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              to="/checkout"
              className="btn btn-primary"
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-4)'
              }}
            >
              Proceder al Pago
            </Link>

            <Link
              to="/catalog"
              className="btn btn-ghost"
              style={{ 
                width: '100%',
                textAlign: 'center'
              }}
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}