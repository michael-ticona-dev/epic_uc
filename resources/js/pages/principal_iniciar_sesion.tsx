import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/principal_sistema_de_autenticacion';
import { useUI } from '../contexts/principal_interfaz';
import '../styles/principal_iniciar_sesion.css';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      showToast('success', 'Sesión iniciada correctamente');
      navigate('/');
    } catch (error: any) {
      showToast('error', error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Iniciar sesión</h1>
          <p className="auth-subtitle">Accede a tu cuenta de EPIC-UC</p>

          <form onSubmit={handleSubmit} className="auth-form">
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
                autoComplete="current-password"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg auth-submit">
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              ¿No tienes cuenta?{' '}
              <Link to="/signup" className="auth-link">
                Regístrate
              </Link>
            </p>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Para probar la aplicación:</p>
            <p className="demo-item">
              Regístrate con cualquier correo electrónico válido o usa una cuenta temporal.
            </p>
            <p className="demo-item">
              <strong>Nota:</strong> La confirmación de email está deshabilitada para facilitar las pruebas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
