import { format } from '../utils/format';

export default function PriceTag({ 
  price, 
  originalPrice, 
  discount, 
  size = 'md',
  showFree = true 
}) {
  const finalPrice = originalPrice ? originalPrice * (1 - discount) : price;
  const hasDiscount = discount > 0 && originalPrice;
  
  if (price === 0 && showFree) {
    return (
      <div className="price-tag">
        <span className={`price-free ${size === 'lg' ? 'text-xl' : 'text-base'}`}>
          GRATIS
        </span>
      </div>
    );
  }

  return (
    <div className="price-tag">
      {hasDiscount && (
        <span className={`price-original ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {format.currency(originalPrice)}
        </span>
      )}
      <span className={`price-current ${size === 'lg' ? 'text-2xl' : 'text-lg'}`}>
        {format.currency(finalPrice)}
      </span>
    </div>
  );
}