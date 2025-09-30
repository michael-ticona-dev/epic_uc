import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EPIC-UC</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
              Tu plataforma favorita para descubrir y adquirir los mejores videojuegos del mercado.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <Mail size={16} />
              <span style={{ color: 'var(--text-muted)' }}>contacto@epicuc.dev</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <Phone size={16} />
              <span style={{ color: 'var(--text-muted)' }}>+34 900 123 456</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <MapPin size={16} />
              <span style={{ color: 'var(--text-muted)' }}>Madrid, España</span>
            </div>
          </div>

          <div className="footer-section">
            <h3>Tienda</h3>
            <ul>
              <li><Link to="/catalog">Explorar Juegos</Link></li>
              <li><Link to="/deals">Ofertas</Link></li>
              <li><Link to="/catalog?category=rpg">RPG</Link></li>
              <li><Link to="/catalog?category=action">Acción</Link></li>
              <li><Link to="/catalog?category=adventure">Aventura</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Soporte</h3>
            <ul>
              <li><a href="#help">Centro de Ayuda</a></li>
              <li><a href="#contact">Contacto</a></li>
              <li><a href="#returns">Devoluciones</a></li>
              <li><a href="#shipping">Envíos</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Empresa</h3>
            <ul>
              <li><a href="#about">Sobre Nosotros</a></li>
              <li><a href="#careers">Empleos</a></li>
              <li><a href="#press">Prensa</a></li>
              <li><a href="#news">Noticias</a></li>
              <li><a href="#investors">Inversores</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="#privacy">Privacidad</a></li>
              <li><a href="#terms">Términos de Uso</a></li>
              <li><a href="#cookies">Cookies</a></li>
              <li><a href="#eula">EULA</a></li>
              <li><a href="#licenses">Licencias</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 EPIC-UC. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}