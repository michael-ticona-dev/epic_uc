import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels = {
  '': 'Inicio',
  'catalog': 'Tienda',
  'deals': 'Ofertas',
  'game': 'Juego',
  'signin': 'Iniciar Sesión',
  'signup': 'Registrarse',
  'profile': 'Perfil',
  'library': 'Biblioteca',
  'wishlist': 'Lista de Deseos',
  'cart': 'Carrito',
  'checkout': 'Pagar',
  'orders': 'Pedidos',
  'admin': 'Administración'
};

export default function Breadcrumbs({ customItems = null }) {
  const location = useLocation();
  
  if (location.pathname === '/') {
    return null; // No mostrar breadcrumbs en la página de inicio
  }

  let breadcrumbItems;
  
  if (customItems) {
    breadcrumbItems = [{ path: '/', label: 'Inicio' }, ...customItems];
  } else {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    breadcrumbItems = [{ path: '/', label: 'Inicio' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels[segment] || segment;
      breadcrumbItems.push({
        path: currentPath,
        label: label.charAt(0).toUpperCase() + label.slice(1)
      });
    });
  }

  return (
    <nav className="breadcrumbs">
      <div className="container">
        <ol className="breadcrumbs-list">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path}>
              {index === 0 && <Home size={14} style={{ marginRight: 'var(--space-1)' }} />}
              {index < breadcrumbItems.length - 1 ? (
                <Link to={item.path}>{item.label}</Link>
              ) : (
                <span style={{ color: 'var(--text)' }}>{item.label}</span>
              )}
              {index < breadcrumbItems.length - 1 && (
                <ChevronRight size={14} className="separator" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}