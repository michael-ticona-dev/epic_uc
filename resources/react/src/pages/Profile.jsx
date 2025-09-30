import { useState } from 'react';
import { User, Mail, Shield, Save, Camera } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { validators } from '../utils/validators';

export default function Profile() {
  const { user } = useAuth();
  const { showToast } = useUI();
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!validators.required(formData.displayName)) {
      newErrors.displayName = 'El nombre es requerido';
    }

    if (!validators.required(formData.email)) {
      newErrors.email = 'El email es requerido';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!validators.required(formData.currentPassword)) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }

    if (!validators.required(formData.newPassword)) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (!validators.password(formData.newPassword)) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateProfileForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      // Simular actualización de perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Perfil actualizado correctamente', 'success');
    } catch (error) {
      showToast('Error al actualizar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validatePasswordForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      // Simular cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      showToast('Contraseña actualizada correctamente', 'success');
    } catch (error) {
      showToast('Error al cambiar la contraseña', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: 'var(--space-2)'
          }}>
            Mi Perfil
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: 'var(--space-8)'
        }}>
          
          {/* Sidebar */}
          <div className="card">
            {/* Avatar */}
            <div style={{ 
              textAlign: 'center',
              marginBottom: 'var(--space-6)',
              paddingBottom: 'var(--space-6)',
              borderBottom: '1px solid var(--border)'
            }}>
              <div style={{ 
                position: 'relative',
                display: 'inline-block',
                marginBottom: 'var(--space-4)'
              }}>
                <img
                  src={user?.avatar}
                  alt={user?.displayName}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--primary)'
                  }}
                />
                <button
                  className="btn btn-primary btn-icon btn-sm"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '32px',
                    height: '32px'
                  }}
                >
                  <Camera size={16} />
                </button>
              </div>
              <h3 style={{ marginBottom: 'var(--space-1)' }}>{user?.displayName}</h3>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                color: 'var(--text-muted)',
                fontSize: '0.875rem'
              }}>
                <Shield size={14} />
                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </div>
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <button
                onClick={() => setActiveTab('profile')}
                className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ 
                  justifyContent: 'flex-start',
                  gap: 'var(--space-2)'
                }}
              >
                <User size={16} />
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`btn ${activeTab === 'security' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ 
                  justifyContent: 'flex-start',
                  gap: 'var(--space-2)'
                }}
              >
                <Shield size={16} />
                Seguridad
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="card">
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: 'var(--space-6)'
                }}>
                  Información Personal
                </h2>

                <form onSubmit={handleProfileSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="displayName">
                      Nombre completo
                    </label>
                    <input
                      id="displayName"
                      name="displayName"
                      type="text"
                      className="form-input"
                      value={formData.displayName}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.displayName && (
                      <div className="form-error">{errors.displayName}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.email && (
                      <div className="form-error">{errors.email}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <Save size={16} />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 style={{ 
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  marginBottom: 'var(--space-6)'
                }}>
                  Cambiar Contraseña
                </h2>

                <form onSubmit={handlePasswordSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="currentPassword">
                      Contraseña actual
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      className="form-input"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.currentPassword && (
                      <div className="form-error">{errors.currentPassword}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="newPassword">
                      Nueva contraseña
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      className="form-input"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.newPassword && (
                      <div className="form-error">{errors.newPassword}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="confirmPassword">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="form-input"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.confirmPassword && (
                      <div className="form-error">{errors.confirmPassword}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    <Shield size={16} />
                    {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}