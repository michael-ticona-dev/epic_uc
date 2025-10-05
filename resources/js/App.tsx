import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/principal_sistema_de_autenticacion';
import { CartProvider } from './contexts/principal_carrito';
import { UIProvider } from './contexts/principal_interfaz';
import { Header } from './components/Header';
import { Toasts } from './components/principal_notificaciones_flotantes';

import { Home } from './pages/principal_inicio';
import { Catalog } from './pages/principal_catalogo_juegos';
import { GameDetail } from './pages/principal_detalle_juego';
import { SignIn } from './pages/principal_iniciar_sesion';
import { SignUp } from './pages/principal_registro';
import { DealsHub } from './pages/principal_ofertas_descuentos';
import { News } from './pages/principal_noticias';
import { Library } from './pages/principal_biblioteca';
import { Upcoming } from './pages/principal_proximos_lanzamientos';

import './styles/globals.css';
import './styles/animations.css';
import './styles/components.css';

function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <AuthProvider>
          <CartProvider>
            <div className="app">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/game/:slug" element={<GameDetail />} />
                  <Route path="/deals" element={<DealsHub />} />
                  <Route path="/upcoming" element={<Upcoming />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                </Routes>
              </main>
              <Toasts />
            </div>
          </CartProvider>
        </AuthProvider>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
