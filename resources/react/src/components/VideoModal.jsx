import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function VideoModal({ youtubeId, title, onClose, isOpen }) {
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
    >
      <div 
        className="modal-content animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: '1000px',
          padding: '0',
          backgroundColor: 'black'
        }}
      >
        {/* Header */}
        <div className="modal-header" style={{ background: 'var(--surface)' }}>
          <h2 className="modal-title">Tráiler - {title}</h2>
          <button 
            onClick={onClose}
            className="modal-close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Video */}
        <div style={{ 
          position: 'relative',
          paddingTop: '56.25%', /* 16:9 aspect ratio */
          background: 'black'
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1&rel=0`}
            title={`Tráiler de ${title}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}