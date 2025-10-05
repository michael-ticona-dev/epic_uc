import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ExternalLink, TrendingDown, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/principal_supabase';
import { useUI } from '../contexts/principal_interfaz';
import '../styles/principal_ofertas_descuentos.css';

interface Deal {
  id: string;
  game_title: string;
  game_slug: string;
  cover_image: string;
  store: string;
  store_url: string;
  price_original: number;
  price_discount: number;
  discount_percent: number;
  platforms: string[];
  is_active: boolean;
}

const STORE_LOGOS: Record<string, string> = {
  'Steam': '🎮',
  'Epic Games': '🎯',
  'GOG': '🌟',
  'Humble Store': '📦',
  'Fanatical': '🔥',
  'GamersGate': '🎪',
  'GreenManGaming': '🌿',
  'Voidu': '💚',
};

export function DealsHub() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const { showToast } = useUI();

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    try {
      const { data: dealsData, error } = await supabase
        .from('deals_standalone')
        .select('*')
        .eq('is_active', true)
        .order('discount_percent', { ascending: false });

      if (error) throw error;

      setDeals(dealsData || []);

      if (!dealsData || dealsData.length === 0) {
        console.log('No deals found, updating automatically...');
        setTimeout(() => updateDeals(), 1000);
      }
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateDeals() {
    setUpdating(true);
    showToast('info', 'Actualizando ofertas desde las APIs...');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/deals`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        showToast('success', `Ofertas actualizadas: ${data.count} ofertas activas`);
        await loadDeals();
      } else {
        throw new Error('Error al actualizar ofertas');
      }
    } catch (error) {
      console.error('Error updating deals:', error);
      showToast('error', 'Error al actualizar las ofertas');
    } finally {
      setUpdating(false);
    }
  }

  const allStores = Array.from(new Set(deals.map(d => d.store)));

  const filteredDeals = selectedStore === 'all'
    ? deals
    : deals.filter(d => d.store === selectedStore);

  const groupedByGame = filteredDeals.reduce((acc: any, deal) => {
    if (!acc[deal.game_slug]) {
      acc[deal.game_slug] = {
        game_slug: deal.game_slug,
        game_title: deal.game_title,
        cover_image: deal.cover_image,
        deals: []
      };
    }
    acc[deal.game_slug].deals.push(deal);
    return acc;
  }, {});

  const groupedDeals = Object.values(groupedByGame);

  if (loading) {
    return (
      <div className="deals-hub">
        <div className="container">
          <div className="loading">Cargando ofertas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="deals-hub">
      <div className="container">
        <div className="deals-header">
          <div className="deals-header-content">
            <TrendingDown size={48} className="deals-icon" />
            <div>
              <h1 className="deals-title">Ofertas y Descuentos</h1>
              <p className="deals-subtitle">
                Compara precios en múltiples plataformas y encuentra las mejores ofertas
              </p>
            </div>
          </div>
          <button
            onClick={updateDeals}
            disabled={updating}
            className="btn btn-primary"
          >
            <RefreshCw size={20} className={updating ? 'spinning' : ''} />
            {updating ? 'Actualizando...' : 'Actualizar ofertas'}
          </button>
        </div>

        <div className="deals-stats">
          <div className="stat-card">
            <div className="stat-value">{groupedDeals.length}</div>
            <div className="stat-label">Juegos con ofertas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{allStores.length}</div>
            <div className="stat-label">Tiendas</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {deals.length > 0 ? Math.max(...deals.map(d => d.discount_percent)) : 0}%
            </div>
            <div className="stat-label">Descuento máximo</div>
          </div>
        </div>

        <div className="deals-filters">
          <div className="filter-label">
            <Tag size={16} />
            <span>Filtrar por tienda:</span>
          </div>
          <div className="store-filters">
            <button
              onClick={() => setSelectedStore('all')}
              className={selectedStore === 'all' ? 'store-btn active' : 'store-btn'}
            >
              Todas las tiendas
            </button>
            {allStores.map((store) => (
              <button
                key={store}
                onClick={() => setSelectedStore(store)}
                className={selectedStore === store ? 'store-btn active' : 'store-btn'}
              >
                <span className="store-emoji">{STORE_LOGOS[store] || '🎮'}</span>
                {store}
              </button>
            ))}
          </div>
        </div>

        {groupedDeals.length === 0 ? (
          <div className="empty-state">
            <p>No se encontraron ofertas. Haz clic en "Actualizar ofertas" para cargar las últimas ofertas.</p>
          </div>
        ) : (
          <div className="deals-list">
            {groupedDeals.map((gameDeal: any) => (
              <div key={gameDeal.game_slug} className="game-deals-card">
                <Link to={`/game/${gameDeal.game_slug}`} className="game-cover-link">
                  <img
                    src={gameDeal.cover_image}
                    alt={gameDeal.game_title}
                    className="game-cover-image"
                  />
                </Link>
                <div className="game-deals-content">
                  <div className="game-deals-header">
                    <Link to={`/game/${gameDeal.game_slug}`} className="game-deals-title">
                      {gameDeal.game_title}
                    </Link>
                    <span className="deals-count">{gameDeal.deals.length} ofertas</span>
                  </div>
                  <div className="deals-grid">
                    {gameDeal.deals.map((deal: Deal) => (
                      <div key={deal.id} className="deal-card">
                        <div className="deal-header">
                          <div className="deal-store">
                            <span className="store-emoji">{STORE_LOGOS[deal.store] || '🎮'}</span>
                            <span className="store-name">{deal.store}</span>
                          </div>
                          {deal.discount_percent > 0 && (
                            <span className="deal-discount">
                              -{deal.discount_percent}%
                            </span>
                          )}
                        </div>
                        <div className="deal-prices">
                          {deal.discount_percent > 0 && (
                            <span className="price-original">
                              S/ {deal.price_original.toFixed(2)}
                            </span>
                          )}
                          <span className="price-current">
                            S/ {deal.price_discount.toFixed(2)}
                          </span>
                        </div>
                        <a
                          href={deal.store_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm deal-btn"
                        >
                          Ver oferta
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
