import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Package, ShoppingBag, Home } from 'lucide-react';
import Header from '../components/Header';
import Toasts from '../components/Toasts';

const adminNavItems = [
  { path: '/admin', icon: BarChart3, label: 'Dashboard' },
  { path: '/admin/games', icon: Package, label: 'Juegos' },
  { path: '/admin/users', icon: Users, label: 'Usuarios' },
  { path: '/admin/orders', icon: ShoppingBag, label: 'Pedidos' }
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="main-layout">
      <Header />
      
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '250px',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          padding: 'var(--space-6) 0'
        }}>
          <div style={{ padding: '0 var(--space-6)' }}>
            <Link 
              to="/"
              className="btn btn-ghost"
              style={{ 
                marginBottom: 'var(--space-6)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                width: '100%',
                justifyContent: 'flex-start'
              }}
            >
              <Home size={20} />
              Volver a la tienda
            </Link>

            <h2 style={{ 
              color: 'var(--text-muted)', 
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: 'var(--space-4)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Administración
            </h2>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {adminNavItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                      padding: 'var(--space-3)',
                      borderRadius: 'var(--radius)',
                      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                      background: isActive ? 'rgba(90, 169, 255, 0.1)' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all var(--transition-fast)',
                      fontWeight: isActive ? '600' : '500'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.background = 'var(--surface-hover)';
                        e.target.style.color = 'var(--text)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--text-muted)';
                      }
                    }}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ 
          flex: 1, 
          padding: 'var(--space-6)',
          background: 'var(--bg)' 
        }}>
          {children}
        </main>
      </div>

      <Toasts />
    </div>
  );
}