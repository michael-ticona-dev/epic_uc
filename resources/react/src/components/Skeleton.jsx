export default function Skeleton({ variant = 'default', className = '' }) {
  const renderGameCard = () => (
    <div className={`card ${className}`}>
      <div className="skeleton skeleton-image" style={{ marginBottom: 'var(--space-4)' }} />
      <div className="skeleton skeleton-title" style={{ marginBottom: 'var(--space-2)' }} />
      <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: 'var(--space-4)' }} />
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        <div className="skeleton skeleton-text" style={{ width: '40px', height: '20px' }} />
        <div className="skeleton skeleton-text" style={{ width: '60px', height: '20px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton skeleton-text" style={{ width: '80px', height: '24px' }} />
        <div className="skeleton skeleton-text" style={{ width: '100px', height: '32px' }} />
      </div>
    </div>
  );

  const renderText = () => (
    <div className={`skeleton skeleton-text ${className}`} />
  );

  const renderTitle = () => (
    <div className={`skeleton skeleton-title ${className}`} />
  );

  const renderImage = () => (
    <div className={`skeleton skeleton-image ${className}`} />
  );

  const renderDefault = () => (
    <div className={`skeleton ${className}`} style={{ height: '20px' }} />
  );

  switch (variant) {
    case 'gameCard':
      return renderGameCard();
    case 'text':
      return renderText();
    case 'title':
      return renderTitle();
    case 'image':
      return renderImage();
    default:
      return renderDefault();
  }
}