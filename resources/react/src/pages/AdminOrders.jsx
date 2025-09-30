import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, Package, Calendar, DollarSign } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
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

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Simular carga de pedidos
      const mockOrders = [
        {
          id: 'ord-1',
          userId: 'u-user',
          userEmail: 'user@epicuc.dev',
          userName: 'Gamer Pro',
          items: [
            { gameId: 'g-cyberpunk2077', title: 'Cyberpunk 2077', price: 44.99, quantity: 1 }
          ],
          subtotal: 44.99,
          tax: 4.50,
          total: 49.49,
          status: 'completed',
          date: '2024-01-15',
          paymentMethod: 'Tarjeta **** 1234'
        },
        {
          id: 'ord-2',
          userId: 'u-3',
          userEmail: 'maria@example.com',
          userName: 'María García',
          items: [
            { gameId: 'g-witcher3', title: 'The Witcher 3', price: 19.99, quantity: 1 },
            { gameId: 'g-minecraft', title: 'Minecraft', price: 24.26, quantity: 1 }
          ],
          subtotal: 44.25,
          tax: 4.43,
          total: 48.68,
          status: 'processing',
          date: '2024-01-14',
          paymentMethod: 'Tarjeta **** 5678'
        },
        {
          id: 'ord-3',
          userId: 'u-user',
          userEmail: 'user@epicuc.dev',
          userName: 'Gamer Pro',
          items: [
            { gameId: 'g-gtav', title: 'GTA V', price: 19.49, quantity: 1 }
          ],
          subtotal: 19.49,
          tax: 1.95,
          total: 21.44,
          status: 'pending',
          date: '2024-01-13',
          paymentMethod: 'PayPal'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="skeleton skeleton-title" style={{ width: '200px', marginBottom: 'var(--space-6)' }} />
          <div className="skeleton" style={{ height: '400px' }} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
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
            <ShoppingBag size={32} style={{ color: 'var(--primary)' }} />
            Gestión de Pedidos
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {orders.length} pedidos registrados
          </p>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <Search size={20} style={{ 
                position: 'absolute',
                left: 'var(--space-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                placeholder="Buscar pedidos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: 'var(--space-10)',
                  padding: 'var(--space-3) var(--space-4)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--surface-2)',
                  color: 'var(--text)'
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--surface-2)',
                color: 'var(--text)',
                minWidth: '150px'
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="processing">Procesando</option>
              <option value="completed">Completados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Artículos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>
                          #{order.id.split('-')[1]?.toUpperCase() || order.id.slice(-6).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {order.id}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500', marginBottom: 'var(--space-1)' }}>
                          {order.userName}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          {order.userEmail}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>
                          {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {order.items.slice(0, 2).map(item => item.title).join(', ')}
                          {order.items.length > 2 && '...'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--success)' }}>
                        {format.currency(order.total)}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ 
                        background: `${statusColors[order.status]}20`,
                        color: statusColors[order.status],
                        border: `1px solid ${statusColors[order.status]}`
                      }}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Calendar size={12} />
                        {format.dateShort(order.date)}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {order.paymentMethod}
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm btn-icon" title="Ver detalles">
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div style={{ 
              textAlign: 'center',
              padding: 'var(--space-16)',
              color: 'var(--text-muted)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>📦</div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>No se encontraron pedidos</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{
          marginTop: 'var(--space-8)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
              {orders.length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Total pedidos
            </div>
          </div>

          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Completados
            </div>
          </div>

          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)' }}>
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Pendientes
            </div>
          </div>

          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
              {format.currency(orders.reduce((sum, o) => sum + o.total, 0))}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Ingresos totales
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}