import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/principal_sistema_de_autenticacion';
import { useUI } from '../contexts/principal_interfaz';
import '../styles/principal_iniciar_sesion.css';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      showToast('error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, displayName);
      showToast('success', 'Cuenta creada exitosamente');
      navigate('/');
    } catch (error: any) {
      showToast('error', error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">Únete a EPIC-UC</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="displayName" className="form-label">
                Nombre de usuario
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input"
                required
                autoComplete="name"
                placeholder="Tu nombre"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
                autoComplete="email"
                placeholder="tu@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                required
                autoComplete="new-password"
                placeholder="Repite tu contraseña"
                minLength={6}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg auth-submit">
              {loading ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link to="/signin" className="auth-link">
                Inicia sesión
              </Link>
            </p>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Registro rápido:</p>
            <p className="demo-item">
              Puedes usar cualquier correo electrónico. La confirmación está deshabilitada para pruebas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
