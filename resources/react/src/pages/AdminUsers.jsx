import { useState, useEffect } from 'react';
import { Users, Search, Shield, Mail, Calendar, MoreVertical } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';
import { format } from '../utils/format';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Simular carga de usuarios
      const mockUsers = [
        {
          id: 'u-admin',
          displayName: 'Admin EPIC-UC',
          email: 'admin@epicuc.dev',
          role: 'admin',
          avatar: 'https://cdn.pixabay.com/photo/2015/04/04/07/35/v-706257_960_720.jpg',
          joinDate: '2024-01-01',
          lastLogin: '2024-01-15',
          status: 'active',
          totalOrders: 0,
          totalSpent: 0
        },
        {
          id: 'u-user',
          displayName: 'Gamer Pro',
          email: 'user@epicuc.dev',
          role: 'user',
          avatar: 'https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536_960_720.jpg',
          joinDate: '2024-01-05',
          lastLogin: '2024-01-14',
          status: 'active',
          totalOrders: 3,
          totalSpent: 149.97
        },
        {
          id: 'u-3',
          displayName: 'María García',
          email: 'maria@example.com',
          role: 'user',
          avatar: 'https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536_960_720.jpg',
          joinDate: '2024-01-10',
          lastLogin: '2024-01-13',
          status: 'active',
          totalOrders: 1,
          totalSpent: 59.99
        },
        {
          id: 'u-4',
          displayName: 'Carlos López',
          email: 'carlos@example.com',
          role: 'user',
          avatar: 'https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536_960_720.jpg',
          joinDate: '2024-01-08',
          lastLogin: '2024-01-12',
          status: 'inactive',
          totalOrders: 0,
          totalSpent: 0
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
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
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: 'var(--space-2)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)'
          }}>
            <Users size={32} style={{ color: 'var(--primary)' }} />
            Gestión de Usuarios
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {users.length} usuarios registrados
          </p>
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
                placeholder="Buscar usuarios..."
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
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--surface-2)',
                color: 'var(--text)',
                minWidth: '150px'
              }}
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="user">Usuarios</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Registro</th>
                  <th>Último acceso</th>
                  <th>Pedidos</th>
                  <th>Total gastado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {user.displayName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            ID: {user.id.split('-')[1]?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                        {user.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Shield size={14} style={{ 
                          color: user.role === 'admin' ? 'var(--warning)' : 'var(--primary)' 
                        }} />
                        <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
                          {user.role === 'admin' ? 'Admin' : 'Usuario'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Calendar size={12} />
                        {format.dateShort(user.joinDate)}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {format.dateShort(user.lastLogin)}
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>
                        {user.totalOrders}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: 'var(--success)' }}>
                        {format.currency(user.totalSpent)}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm btn-icon">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div style={{ 
              textAlign: 'center',
              padding: 'var(--space-16)',
              color: 'var(--text-muted)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>👥</div>
              <h3 style={{ marginBottom: 'var(--space-2)' }}>No se encontraron usuarios</h3>
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
              {users.length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Total usuarios
            </div>
          </div>

          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning)' }}>
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Administradores
            </div>
          </div>

          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success)' }}>
              {users.filter(u => u.status === 'active').length}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Usuarios activos
            </div>
          </div>

          <div className="card card-compact" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent)' }}>
              {format.currency(users.reduce((sum, u) => sum + u.totalSpent, 0))}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Ingresos totales
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}