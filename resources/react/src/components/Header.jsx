import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart, LogOut, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useCatalog } from '../contexts/CatalogContext';

export default function Header() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { getItemCount } = useCart();
  const { searchGames } = useCatalog();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchGames(searchQuery);
      if (location.pathname !== '/catalog') {
        navigate('/catalog');
      }
    }
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
    navigate('/');
  };

  const cartItemCount = getItemCount();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container header-content">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <div style={{ 
            background: 'linear-gradient(45deg, var(--primary), var(--accent))',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            E
          </div>
          EPIC-UC
        </Link>

        {/* Navegación */}
        <nav className="header-nav">
          <Link 
            to="/" 
            className={isActive('/') ? 'active' : ''}
          >
            Inicio
          </Link>
          <Link 
            to="/catalog" 
            className={isActive('/catalog') ? 'active' : ''}
          >
            Tienda
          </Link>
          <Link 
            to="/deals" 
            className={isActive('/deals') ? 'active' : ''}
          >
            Ofertas
          </Link>
        </nav>

        {/* Barra de búsqueda */}
        <form onSubmit={handleSearch} className="header-search">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Acciones */}
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              {/* Wishlist */}
              <Link to="/wishlist" className="btn btn-icon btn-ghost">
                <Heart size={20} />
              </Link>

              {/* Carrito */}
              <Link to="/cart" className="btn btn-icon btn-ghost" style={{ position: 'relative' }}>
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--primary)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600'
                  }}>
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Menú de usuario */}
              <div style={{ position: 'relative' }} ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="btn btn-icon btn-ghost"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-lg)'
                  }}
                >
                  <img
                    src={user?.avatar}
                    alt={user?.displayName}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: 'var(--space-2)',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3)',
                    minWidth: '200px',
                    zIndex: 'var(--z-dropdown)',
                    boxShadow: 'var(--shadow-2)'
                  }}>
                    <div style={{ 
                      paddingBottom: 'var(--space-3)', 
                      marginBottom: 'var(--space-3)',
                      borderBottom: '1px solid var(--border)'
                    }}>
                      <div style={{ fontWeight: '600' }}>{user?.displayName}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {user?.email}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          padding: 'var(--space-2)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--text-muted)',
                          textDecoration: 'none',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--surface-hover)';
                          e.target.style.color = 'var(--text)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = 'var(--text-muted)';
                        }}
                      >
                        <User size={16} />
                        Perfil
                      </Link>
                      
                      <Link
                        to="/library"
                        onClick={() => setShowUserMenu(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          padding: 'var(--space-2)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--text-muted)',
                          textDecoration: 'none',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--surface-hover)';
                          e.target.style.color = 'var(--text)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = 'var(--text-muted)';
                        }}
                      >
                        <Settings size={16} />
                        Biblioteca
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-2)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--text-muted)',
                            textDecoration: 'none',
                            transition: 'all var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--surface-hover)';
                            e.target.style.color = 'var(--text)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--text-muted)';
                          }}
                        >
                          <Settings size={16} />
                          Admin
                        </Link>
                      )}

                      <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--space-2) 0' }} />
                      
                      <button
                        onClick={handleSignOut}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          padding: 'var(--space-2)',
                          borderRadius: 'var(--radius)',
                          color: 'var(--error)',
                          background: 'transparent',
                          border: 'none',
                          width: '100%',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent';
                        }}
                      >
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn btn-ghost">
                Iniciar Sesión
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}