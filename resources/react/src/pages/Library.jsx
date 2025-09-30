import { useState, useEffect } from 'react';
import { Play, Download, Settings, Filter, Grid2x2 as Grid, List } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import GameCard from '../components/GameCard';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../utils/mockApi';
import { format } from '../utils/format';

export default function Library() {
  const { user } = useAuth();
  const [ownedGames, setOwnedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filter, setFilter] = useState('all'); // 'all' | 'installed' | 'not-installed'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name' | 'playtime'

  useEffect(() => {
    loadLibrary();
  }, [user]);

  const loadLibrary = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Simular juegos comprados basados en órdenes del usuario
      const orders = await mockApi.getUserOrders(user.id);
      const gameIds = orders.flatMap(order => 
        order.items.map(item => item.gameId)
      );
      
      // Obtener detalles de los juegos
      const { games } = await mockApi.getGames();
      const libraryGames = games
        .filter(game => gameIds.includes(game.id))
        .map(game => ({
          ...game,
          installed: Math.random() > 0.5, // Simular estado de instalación
          lastPlayed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          playtime: Math.floor(Math.random() * 100) // Horas jugadas
        }));
      
      setOwnedGames(libraryGames);
    } catch (error) {
      console.error('Error loading library:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = ownedGames.filter(game => {
    if (filter === 'installed') return game.installed;
    if (filter === 'not-installed') return !game.installed;
    return true;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'playtime':
        return b.playtime - a.playtime;
      case 'recent':
      default:
        return new Date(b.lastPlayed) - new Date(a.lastPlayed);
    }
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="container" style={{ padding: 'var(--space-8)' }}>
          <div className="animate-pulse">
            <div className="skeleton skeleton-title" style={{ width: '200px', marginBottom: 'var(--space-6)' }} />
            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '300px' }} />
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-8)'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)'
            }}>
              Mi Biblioteca
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {ownedGames.length} juegos en tu biblioteca
            </p>
          </div>

          {/* View Controls */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-icon ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-icon ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div style={{ 
          display: 'flex',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Filter size={16} style={{ color: 'var(--text-muted)' }} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 'var(--space-2) var(--space-3)',
                color: 'var(--text)',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">Todos los juegos</option>
              <option value="installed">Instalados</option>
              <option value="not-installed">No instalados</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: 'var(--space-2) var(--space-3)',
                color: 'var(--text)',
                fontSize: '0.875rem'
              }}
            >
              <option value="recent">Jugado recientemente</option>
              <option value="name">Nombre</option>
              <option value="playtime">Tiempo de juego</option>
            </select>
          </div>
        </div>

        {/* Games */}
        {sortedGames.length === 0 ? (
          <EmptyState
            title="Tu biblioteca está vacía"
            description="Compra algunos juegos para empezar a construir tu biblioteca"
            icon="🎮"
            action={
              <a href="/catalog" className="btn btn-primary">
                Explorar Tienda
              </a>
            }
          />
        ) : viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}>
            {sortedGames.map((game, index) => (
              <div key={game.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div style={{ position: 'relative' }}>
                  <GameCard game={game} showWishlist={false} />
                  
                  {/* Game Status Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 'var(--space-3)',
                    left: 'var(--space-3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)'
                  }}>
                    {game.installed ? (
                      <div className="badge badge-success">
                        Instalado
                      </div>
                    ) : (
                      <div className="badge badge-warning">
                        No instalado
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    position: 'absolute',
                    bottom: 'var(--space-4)',
                    left: 'var(--space-4)',
                    right: 'var(--space-4)',
                    display: 'flex',
                    gap: 'var(--space-2)'
                  }}>
                    {game.installed ? (
                      <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                        <Play size={16} />
                        Jugar
                      </button>
                    ) : (
                      <button className="btn btn-accent btn-sm" style={{ flex: 1 }}>
                        <Download size={16} />
                        Instalar
                      </button>
                    )}
                    <button className="btn btn-ghost btn-sm btn-icon">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {sortedGames.map((game, index) => (
              <div
                key={game.id}
                className="card animate-fade-in"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-4)',
                  padding: 'var(--space-4)'
                }}
              >
                <img
                  src={game.cover}
                  alt={game.title}
                  style={{
                    width: '80px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius)'
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 'var(--space-1)' }}>{game.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Última vez jugado: {format.dateShort(game.lastPlayed)}
                  </p>
                </div>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--space-4)',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem'
                }}>
                  <span>{game.playtime}h jugadas</span>
                  {game.installed ? (
                    <div className="badge badge-success">Instalado</div>
                  ) : (
                    <div className="badge badge-warning">No instalado</div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {game.installed ? (
                    <button className="btn btn-primary btn-sm">
                      <Play size={16} />
                      Jugar
                    </button>
                  ) : (
                    <button className="btn btn-accent btn-sm">
                      <Download size={16} />
                      Instalar
                    </button>
                  )}
                  <button className="btn btn-ghost btn-sm btn-icon">
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}