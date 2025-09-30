export default function Tag({ 
  children, 
  variant = 'default',
  size = 'sm',
  className = '' 
}) {
  const baseClass = 'tag';
  const variantClass = variant !== 'default' ? `tag-${variant}` : '';
  const sizeClass = size === 'lg' ? 'text-sm p-2' : 'text-xs';
  
  return (
    <span className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
}