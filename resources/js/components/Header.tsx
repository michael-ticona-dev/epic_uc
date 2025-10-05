import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Library, Heart, Package } from 'lucide-react';
import { useAuth } from '../contexts/principal_sistema_de_autenticacion';
import { useCart } from '../contexts/principal_carrito';
import '../styles/Header.css';

export function Header() {
  const { isAuthenticated, profile, isAdmin, signOut } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="logo">
              <img src="/logoEpicUc.png" alt="EPIC-UC" className="logo-img" />
            </Link>
            <nav className="nav">
              <Link to="/" className={isActive('/') ? 'nav-link active' : 'nav-link'}>
                Inicio
              </Link>
              <Link to="/catalog" className={isActive('/catalog') ? 'nav-link active' : 'nav-link'}>
                Catálogo
              </Link>
              <Link to="/deals" className={isActive('/deals') ? 'nav-link active' : 'nav-link'}>
                Ofertas
              </Link>
              <Link to="/upcoming" className={isActive('/upcoming') ? 'nav-link active' : 'nav-link'}>
                Próximos
              </Link>
              <Link to="/news" className={isActive('/news') ? 'nav-link active' : 'nav-link'}>
                Noticias
              </Link>
              {isAdmin && (
                <Link to="/admin" className={isActive('/admin') ? 'nav-link active' : 'nav-link'}>
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="header-right">
            {isAuthenticated ? (
              <>
                <Link to="/wishlist" className="icon-btn" title="Lista de deseos">
                  <Heart size={20} />
                </Link>
                <Link to="/library" className="icon-btn" title="Biblioteca">
                  <Library size={20} />
                </Link>
                <Link to="/cart" className="icon-btn cart-btn" title="Carrito">
                  <ShoppingCart size={20} />
                  {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                </Link>
                <div className="user-menu">
                  <button className="user-btn">
                    <img src={profile?.avatar_url} alt={profile?.display_name} className="avatar" />
                    <span>{profile?.display_name}</span>
                  </button>
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item">
                      <User size={16} />
                      <span>Perfil</span>
                    </Link>
                    <Link to="/orders" className="dropdown-item">
                      <Package size={16} />
                      <span>Pedidos</span>
                    </Link>
                    <button onClick={signOut} className="dropdown-item">
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn-ghost">
                  Iniciar sesión
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
