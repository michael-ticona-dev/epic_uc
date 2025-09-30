import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MediaGallery({ images = [], title }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setSelectedIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Imagen principal */}
      <div style={{ 
        position: 'relative',
        aspectRatio: '16/9',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginBottom: 'var(--space-4)'
      }}>
        <img
          src={images[selectedIndex]}
          alt={`${title} - Imagen ${selectedIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="btn btn-icon"
              style={{
                position: 'absolute',
                left: 'var(--space-4)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none'
              }}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={goToNext}
              className="btn btn-icon"
              style={{
                position: 'absolute',
                right: 'var(--space-4)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none'
              }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicadores */}
            <div style={{
              position: 'absolute',
              bottom: 'var(--space-4)',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 'var(--space-2)'
            }}>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    background: index === selectedIndex 
                      ? 'white' 
                      : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div style={{
          display: 'flex',
          gap: 'var(--space-2)',
          overflowX: 'auto',
          paddingBottom: 'var(--space-2)'
        }}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              style={{
                minWidth: '80px',
                height: '60px',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                border: index === selectedIndex 
                  ? '2px solid var(--primary)' 
                  : '2px solid transparent',
                padding: '0',
                background: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}