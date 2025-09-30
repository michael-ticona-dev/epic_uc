import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { validators } from '../utils/validators';

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { showToast } = useUI();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (!validators.required(formData.displayName)) {
      newErrors.displayName = 'El nombre es requerido';
    } else if (!validators.minLength(formData.displayName, 2)) {
      newErrors.displayName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!validators.required(formData.email)) {
      newErrors.email = 'El email es requerido';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    if (!validators.required(formData.password)) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validators.password(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos';
    }

    if (!validators.required(formData.confirmPassword)) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      const result = await signUp({
        displayName: formData.displayName,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        showToast('¡Cuenta creada exitosamente! Bienvenido a EPIC-UC', 'success');
        navigate('/');
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
              Crear Cuenta
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Únete a la comunidad de EPIC-UC
            </p>
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
              <label className="form-label" htmlFor="displayName">
                Nombre completo
              </label>
              <div style={{ position: 'relative' }}>
                <User 
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
                  id="displayName"
                  name="displayName"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: 'var(--space-10)' }}
                  placeholder="Tu nombre completo"
                  value={formData.displayName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.displayName && (
                <div className="form-error">{errors.displayName}</div>
              )}
            </div>

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

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirmar contraseña
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
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 'var(--space-10)', paddingRight: 'var(--space-10)' }}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="form-error">{errors.confirmPassword}</div>
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
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>

            <div style={{ 
              textAlign: 'center',
              marginTop: 'var(--space-6)',
              paddingTop: 'var(--space-6)',
              borderTop: '1px solid var(--border)'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/signin" style={{ color: 'var(--primary)' }}>
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>

          {/* Password requirements */}
          <div style={{ 
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ 
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: 'var(--space-3)',
              color: 'var(--text-muted)'
            }}>
              Requisitos de la contraseña:
            </h3>
            <ul style={{ 
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              listStyle: 'none',
              padding: 0
            }}>
              <li>• Al menos 8 caracteres</li>
              <li>• Una letra mayúscula y una minúscula</li>
              <li>• Al menos un número</li>
              <li>• Al menos un símbolo (@$!%*?&)</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}