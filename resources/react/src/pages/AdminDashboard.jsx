import { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import ChartMini from '../components/ChartMini';
import { mockApi } from '../utils/mockApi';
import { format } from '../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await mockApi.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="skeleton skeleton-title" style={{ width: '300px', marginBottom: 'var(--space-8)' }} />
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-8)'
          }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '120px' }} />
            ))}
          </div>
          <div className="skeleton" style={{ height: '300px' }} />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Usuarios Totales',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'var(--primary)',
      change: '+12%'
    },
    {
      title: 'Juegos en Catálogo',
      value: stats?.totalGames || 0,
      icon: Package,
      color: 'var(--accent)',
      change: '+3%'
    },
    {
      title: 'Pedidos Totales',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'var(--success)',
      change: '+8%'
    },
    {
      title: 'Ingresos Totales',
      value: format.currency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'var(--warning)',
      change: '+15%'
    }
  ];

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: 'var(--space-2)'
          }}>
            Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Resumen general de la plataforma EPIC-UC
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}>
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="card animate-fade-in hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-4)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius)',
                    background: `${stat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                  
                  <div className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                    {stat.change}
                  </div>
                </div>

                <div>
                  <div style={{ 
                    fontSize: '2rem',
                    fontWeight: '700',
                    marginBottom: 'var(--space-1)',
                    color: stat.color
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ 
                    color: 'var(--text-muted)',
                    fontSize: '0.875rem'
                  }}>
                    {stat.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-8)'
        }}>
          {/* Monthly Stats Chart */}
          <div className="card">
            <h3 style={{ 
              marginBottom: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <TrendingUp size={20} />
              Estadísticas Mensuales
            </h3>
            
            {stats?.monthlyStats && (
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <ChartMini
                  data={stats.monthlyStats.map(month => ({
                    label: month.month,
                    value: month.sales
                  }))}
                  type="line"
                  width={500}
                  height={200}
                />
              </div>
            )}

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--space-4)',
              marginTop: 'var(--space-4)'
            }}>
              {stats?.monthlyStats?.map((month, index) => (
                <div key={month.month} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: 'var(--primary)'
                  }}>
                    {format.currency(month.sales)}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)'
                  }}>
                    {month.month}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 style={{ 
              marginBottom: 'var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <Calendar size={20} />
              Actividad Reciente
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {[
                { type: 'user', message: 'Nuevo usuario registrado', time: 'Hace 2 horas' },
                { type: 'order', message: 'Pedido completado', time: 'Hace 4 horas' },
                { type: 'game', message: 'Juego añadido al catálogo', time: 'Hace 1 día' },
                { type: 'user', message: '5 nuevos usuarios', time: 'Hace 2 días' }
              ].map((activity, index) => (
                <div key={index} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: activity.type === 'user' ? 'var(--primary)' : 
                               activity.type === 'order' ? 'var(--success)' : 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem'
                  }}>
                    {activity.type === 'user' ? '👤' : 
                     activity.type === 'order' ? '📦' : '🎮'}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                      {activity.message}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-6)' }}>Acciones Rápidas</h3>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            <button className="btn btn-primary" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              justifyContent: 'center'
            }}>
              <Package size={16} />
              Añadir Juego
            </button>
            
            <button className="btn btn-secondary" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              justifyContent: 'center'
            }}>
              <Users size={16} />
              Ver Usuarios
            </button>
            
            <button className="btn btn-accent" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={16} />
              Ver Pedidos
            </button>
            
            <button className="btn btn-ghost" style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              justifyContent: 'center'
            }}>
              <TrendingUp size={16} />
              Generar Reporte
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}