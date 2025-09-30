import { useState, useEffect } from 'react';
import { ExternalLink, Percent } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import PriceTag from '../components/PriceTag';
import Tag from '../components/Tag';
import { mockApi } from '../utils/mockApi';
import { format } from '../utils/format';

const storeColors = {
  'Steam': '#1b2838',
  'Epic': '#0078f2',
  'GOG': '#86328a',
  'Rockstar': '#fcaf17',
  'Microsoft': '#00bcf2',
  'Mojang': '#62c05a'
};

export default function DealsHub() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState('all');

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const dealsData = await mockApi.getDeals();
      setDeals(dealsData);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = selectedStore === 'all' 
    ? deals 
    : deals.filter(deal => deal.store === selectedStore);

  const stores = [...new Set(deals.map(deal => deal.store))];

  if (loading) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: 'var(--space-8)' }}>
          <div className="animate-pulse">
            <div className="skeleton skeleton-title" style={{ width: '300px', marginBottom: 'var(--space-6)' }} />
            <div className="grid grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '200px' }} />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        
        {/* Header */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: 'var(--space-12)'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-4)'
          }}>
            <Percent size={32} style={{ color: 'var(--accent)' }} />
            <h1 style={{ 
              fontSize: '3rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              Centro de Ofertas
            </h1>
          </div>
          
          <p style={{ 
            fontSize: '1.125rem',
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Descubre las mejores ofertas de videojuegos de todas las tiendas digitales. 
            Próximamente podrás acceder directamente a las ofertas externas.
          </p>
        </div>

        {/* Store Filter */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-8)',
          gap: 'var(--space-3)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setSelectedStore('all')}
            className={`btn ${selectedStore === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Todas las tiendas
          </button>
          {stores.map(store => (
            <button
              key={store}
              onClick={() => setSelectedStore(store)}
              className={`btn ${selectedStore === store ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                background: selectedStore === store 
                  ? storeColors[store] || 'var(--primary)'
                  : 'var(--surface)',
                borderColor: storeColors[store] || 'var(--border)'
              }}
            >
              {store}
            </button>
          ))}
        </div>

        {/* Deals Grid */}
        {filteredDeals.length === 0 ? (
          <div style={{ 
            textAlign: 'center',
            padding: 'var(--space-16)',
            color: 'var(--text-muted)'
          }}>
            <Percent size={64} style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
            <h3 style={{ marginBottom: 'var(--space-2)' }}>No hay ofertas disponibles</h3>
            <p>Vuelve pronto para ver las mejores ofertas.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {filteredDeals.map((deal, index) => (
              <div
                key={deal.id}
                className="card hover-lift animate-fade-in"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Store Badge */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  right: 'var(--space-3)',
                  background: storeColors[deal.store] || 'var(--primary)',
                  color: 'white',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  zIndex: 2
                }}>
                  {deal.store}
                </div>

                {/* Discount Badge */}
                <div style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  left: 'var(--space-3)',
                  background: 'var(--success)',
                  color: 'white',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  zIndex: 2
                }}>
                  -{Math.round(deal.discount * 100)}%
                </div>

                {/* Game Image */}
                <div style={{
                  height: '200px',
                  backgroundImage: `url(${deal.game?.cover})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: 'var(--space-4)',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                    padding: 'var(--space-4)',
                    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
                  }}>
                    <h3 style={{ 
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                      margin: 0
                    }}>
                      {deal.game?.title}
                    </h3>
                  </div>
                </div>

                {/* Deal Info */}
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: 'var(--space-3)'
                  }}>
                    <PriceTag
                      price={deal.finalPrice}
                      originalPrice={deal.originalPrice}
                      discount={deal.discount}
                      size="md"
                    />
                    <span style={{ 
                      color: 'var(--text-muted)',
                      fontSize: '0.875rem'
                    }}>
                      Ahorra {format.currency(deal.originalPrice - deal.finalPrice)}
                    </span>
                  </div>

                  {/* Game Tags */}
                  {deal.game?.tags && (
                    <div style={{ 
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--space-2)',
                      marginBottom: 'var(--space-4)'
                    }}>
                      {deal.game.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Tag key={tagIndex} size="sm">{tag}</Tag>
                      ))}
                    </div>
                  )}

                  {/* Deal End Date */}
                  {deal.endDate && (
                    <p style={{ 
                      color: 'var(--warning)',
                      fontSize: '0.875rem',
                      marginBottom: 'var(--space-4)'
                    }}>
                      Oferta válida hasta: {format.date(deal.endDate)}
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className="btn btn-primary"
                  style={{ 
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    justifyContent: 'center',
                    opacity: 0.7,
                    cursor: 'not-allowed'
                  }}
                  disabled
                  title="Integración con API en próxima fase"
                >
                  <ExternalLink size={16} />
                  Ver Oferta en {deal.store}
                </button>

                <p style={{ 
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  marginTop: 'var(--space-2)',
                  fontStyle: 'italic'
                }}>
                  Próximamente disponible
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          marginTop: 'var(--space-16)',
          textAlign: 'center',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: 'var(--space-4)',
            color: 'var(--primary)'
          }}>
            🚀 Próximamente: Integración Completa
          </h2>
          <p style={{ 
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Estamos trabajando en la integración con las APIs de las principales tiendas digitales 
            para ofrecerte acceso directo a las mejores ofertas del mercado. Pronto podrás navegar 
            directamente a Steam, Epic Games Store, GOG y más con un solo clic.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}