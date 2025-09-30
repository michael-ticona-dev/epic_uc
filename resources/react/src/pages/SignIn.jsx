import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { validators } from '../utils/validators';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { showToast } = useUI();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando se empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validators.required(formData.email)) {
      newErrors.email = 'El email es requerido';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!validators.required(formData.password)) {
      newErrors.password = 'La contraseña es requerida';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        showToast('¡Bienvenido de vuelta!', 'success');
        navigate(from, { replace: true });
      } else {
        setErrors({ form: result.error });
        showToast(result.error, 'error');
      }
    } catch (error) {
      const errorMessage = 'Error inesperado. Por favor, inténtalo de nuevo.';
      setErrors({ form: errorMessage });
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type) => {
    const credentials = type === 'admin' 
      ? { email: 'admin@epicuc.dev', password: 'Admin123!' }
      : { email: 'user@epicuc.dev', password: 'User123!' };
    
    setFormData(credentials);
    
    setLoading(true);
    try {
      const result = await signIn(credentials.email, credentials.password);
      
      if (result.success) {
        showToast(`¡Bienvenido como ${type}!`, 'success');
        navigate(from, { replace: true });
      } else {
        showToast(result.error, 'error');
      }
    } catch (error) {
      showToast('Error en el login de demostración', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container" style={{ 
        paddingTop: 'var(--space-16)', 
        paddingBottom: 'var(--space-16)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h1 style={{ 
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: 'var(--space-2)'
            }}>
              Iniciar Sesión
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Accede a tu cuenta de EPIC-UC
            </p>
          </div>

          {/* Demo Cards */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)'
          }}>
            <div className="card card-compact" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>
                Demo Usuario
              </h3>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-3)'
              }}>
                user@epicuc.dev
              </p>
              <button
                onClick={() => handleDemoLogin('user')}
                className="btn btn-secondary btn-sm"
                disabled={loading}
                style={{ width: '100%' }}
              >
                Probar
              </button>
            </div>

            <div className="card card-compact" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>
                Demo Admin
              </h3>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-3)'
              }}>
                admin@epicuc.dev
              </p>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="btn btn-accent btn-sm"
                disabled={loading}
                style={{ width: '100%' }}
              >
                Probar
              </button>
            </div>
          </div>

          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)'
          }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              O inicia sesión manualmente
            </span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card">
            {errors.form && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--error)',
                color: 'var(--error)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius)',
                marginBottom: 'var(--space-6)',
                fontSize: '0.875rem'
              }}>
                {errors.form}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail 
                  size={20} 
                  style={{ 
                    position: 'absolute',
                    left: 'var(--space-3)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 'var(--space-10)' }}
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <div className="form-error">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock 
                  size={20} 
                  style={{ 
                    position: 'absolute',
                    left: 'var(--space-3)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 'var(--space-10)', paddingRight: 'var(--space-10)' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 'var(--space-3)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="form-error">{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ 
                width: '100%',
                marginTop: 'var(--space-4)'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div className="animate-spin" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%'
                  }} />
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            <div style={{ 
              textAlign: 'center',
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--border)'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                ¿No tienes una cuenta?{' '}
                <Link to="/signup" style={{ color: 'var(--primary)' }}>
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}