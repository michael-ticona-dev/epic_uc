import { useState, useEffect } from 'react';
import { Package, Calendar, CreditCard, Download } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../utils/mockApi';
import { format } from '../utils/format';

const statusColors = {
  'pending': 'var(--warning)',
  'completed': 'var(--success)',
  'cancelled': 'var(--error)',
  'processing': 'var(--info)'
};

const statusLabels = {
  'pending': 'Pendiente',
  'completed': 'Completado',
  'cancelled': 'Cancelado',
  'processing': 'Procesando'
};

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userOrders = await mockApi.getUserOrders(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: 'var(--space-8)' }}>
          <div className="animate-pulse">
            <div className="skeleton skeleton-title" style={{ width: '200px', marginBottom: 'var(--space-6)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '150px' }} />
              ))}
            </div>
          </div>
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
            <Package size={32} style={{ color: 'var(--primary)' }} />
            Mis Pedidos
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Historial completo de tus compras
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <EmptyState
            title="No tienes pedidos aún"
            description="Cuando realices tu primera compra, aparecerá aquí"
            icon="📦"
            action={
              <a href="/catalog" className="btn btn-primary">
                Explorar Juegos
              </a>
            }
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Order Header */}
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--space-4)',
                  paddingBottom: 'var(--space-4)',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      marginBottom: 'var(--space-2)'
                    }}>
                      Pedido #{order.id.split('-')[1]?.toUpperCase() || order.id.slice(-6).toUpperCase()}
                    </h3>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)',
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Calendar size={14} />
                        {format.date(order.date)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <CreditCard size={14} />
                        {format.currency(order.total)}
                      </div>
                    </div>
                  </div>

                  <div className="badge" style={{ 
                    background: `${statusColors[order.status]}20`,
                    color: statusColors[order.status],
                    border: `1px solid ${statusColors[order.status]}`
                  }}>
                    {statusLabels[order.status]}
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h4 style={{ 
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: 'var(--space-3)',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Artículos ({order.items.length})
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {order.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          padding: 'var(--space-3)',
                          background: 'var(--surface-2)',
                          borderRadius: 'var(--radius)',
                          border: '1px solid var(--border)'
                        }}
                      >
                        <div style={{
                          width: '60px',
                          height: '45px',
                          background: 'var(--surface)',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}>
                          🎮
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
                            {item.title || `Juego ${item.gameId}`}
                          </div>
                          <div style={{ 
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)'
                          }}>
                            Cantidad: {item.quantity} • {format.currency(item.price)}
                          </div>
                        </div>

                        {order.status === 'completed' && (
                          <button className="btn btn-primary btn-sm">
                            <Download size={14} />
                            Descargar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--border)'
                }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {order.items.reduce((total, item) => total + item.quantity, 0)} artículos
                  </div>
                  
                  <div style={{ 
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    color: 'var(--primary)'
                  }}>
                    Total: {format.currency(order.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Stats */}
        {orders.length > 0 && (
          <div style={{
            marginTop: 'var(--space-12)',
            padding: 'var(--space-6)',
            background: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border)',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Resumen de Compras</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 'var(--space-6)'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                  {orders.length}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Pedidos realizados
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
                  {orders.reduce((total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0)}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Juegos comprados
                </div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
                  {format.currency(orders.reduce((total, order) => total + order.total, 0))}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Total gastado
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}