import { useUI } from '../contexts/principal_interfaz';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export function Toasts() {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className="toasts-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-icon">{icons[toast.type]}</span>
            <span className="toast-message">{toast.message}</span>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
