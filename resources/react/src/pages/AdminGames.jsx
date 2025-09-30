import { useState, useEffect } from 'react';
import { Plus, Search, CreditCard as Edit, Trash2, Eye } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import { mockApi } from '../utils/mockApi';
import { format } from '../utils/format';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      const { games: gamesData } = await mockApi.getGames();
      setGames(gamesData);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.developer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           game.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="skeleton skeleton-title" style={{ width: '200px', marginBottom: 'var(--space-6)' }} />
          <div className="skeleton" style={{ height: '400px' }} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
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
              Gestión de Juegos
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {games.length} juegos en el catálogo
            </p>
          </div>

          <button className="btn btn-primary" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}>
            <Plus size={16} />
            Añadir Juego
          </button>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ 
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <Search size={20} style={{ 
                position: 'absolute',
                left: 'var(--space-3)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: 'var(--space-10)',
                  padding: 'var(--space-3) var(--space-4)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--surface-2)',
                  color: 'var(--text)'
                }}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--surface-2)',
                color: 'var(--text)',
                minWidth: '150px'
              }}
            >
              <option value="all">Todas las categorías</option>
              <option value="rpg">RPG</option>
              <option value="accion">Acción</option>
              <option value="aventura">Aventura</option>
              <option value="sandbox">Sandbox</option>
            </select>
          </div>
        </div>

        {/* Games Table */}
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Juego</th>
                  <th>Desarrollador</th>
                  <th>Precio</th>
                  <th>Descuento</th>
                  <th>Rating</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game, index) => (
                  <tr key={game.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <img
                          src={game.cover}
                          alt={game.title}
                          style={{
                            width: '60px',
                            height: '45px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: 'var(--space-1)' }}>
                            {game.title}
                          </div>
                          <div style={{ 
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            gap: 'var(--space-2)'
                          }}>
                            {game.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{game.developer}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>
                        {game.price === 0 ? 'GRATIS' : format.currency(game.price)}
                      </div>
                    </td>
                    <td>
                      {game.discount > 0 ? (
                        <div className="badge badge-success">
                          -{Math.round(game.discount * 100)}%
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ fontWeight: '600' }}>{game.rating}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          ({format.number(game.ratingsCount)})
                        </span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {format.dateShort(game.releaseDate)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-ghost btn-sm btn-icon" title="Ver detalles">
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm btn-icon" title="Editar">
                          <Edit size={14} />
                        </button>
                        <button 
                          className="btn btn-ghost btn-sm btn-icon" 
                          title="Eliminar"
                          style={{ color: 'var(--error)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredGames.length === 0 && (
            <div style={{ 
              textAlign: 'center',
              padding: 'var(--space-16)',
              color: 'var(--text-muted)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🎮</div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>No se encontraron juegos</h3>
              <p>Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{
          marginTop: 'var(--space-8)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
              {games.length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Total de juegos
            </div>
          </div>

          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
              {games.filter(g => g.discount > 0).length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Con descuento
            </div>
          </div>

          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
              {games.filter(g => g.price === 0).length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Gratuitos
            </div>
          </div>

          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)' }}>
              {(games.reduce((sum, g) => sum + g.rating, 0) / games.length).toFixed(1)}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Rating promedio
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}