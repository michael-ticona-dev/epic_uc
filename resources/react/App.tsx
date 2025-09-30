import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { CatalogProvider } from './src/contexts/CatalogContext';
import { UIProvider } from './src/contexts/UIContext';
import Protected from './src/components/Protected';

// Import pages
import Home from './src/pages/Home';
import Catalog from './src/pages/Catalog';
import GameDetail from './src/pages/GameDetail';
import DealsHub from './src/pages/DealsHub';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Profile from './src/pages/Profile';
import Library from './src/pages/Library';
import Wishlist from './src/pages/Wishlist';
import Cart from './src/pages/Cart';
import Checkout from './src/pages/Checkout';
import Orders from './src/pages/Orders';
import AdminDashboard from './src/pages/AdminDashboard';
import AdminGames from './src/pages/AdminGames';
import AdminUsers from './src/pages/AdminUsers';
import AdminOrders from './src/pages/AdminOrders';

// CSS imports
import './src/styles/tokens.css';
import './src/styles/globals.css';
import './src/styles/layout.css';
import './src/styles/components.css';
import './src/styles/animations.css';



function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/game/:slug" element={<GameDetail />} />
                <Route path="/deals" element={<DealsHub />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* Protected User Routes */}
                <Route path="/profile" element={<Protected><Profile /></Protected>} />
                <Route path="/library" element={<Protected><Library /></Protected>} />
                <Route path="/wishlist" element={<Protected><Wishlist /></Protected>} />
                <Route path="/cart" element={<Protected><Cart /></Protected>} />
                <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
                <Route path="/orders" element={<Protected><Orders /></Protected>} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
                <Route path="/admin/games" element={<Protected role="admin"><AdminGames /></Protected>} />
                <Route path="/admin/users" element={<Protected role="admin"><AdminUsers /></Protected>} />
                <Route path="/admin/orders" element={<Protected role="admin"><AdminOrders /></Protected>} />
              </Routes>
            </Router>
          </CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </UIProvider>
  );
}

export default App;
