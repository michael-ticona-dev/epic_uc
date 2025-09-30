import { Star } from 'lucide-react';

export default function RatingStars({ 
  rating, 
  maxRating = 5, 
  showText = true,
  size = 16 
}) {
  const stars = [];
  
  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Star
        key={i}
        size={size}
        className={`rating-star ${i <= Math.round(rating) ? 'active' : ''}`}
      />
    );
  }

  return (
    <div className="rating-stars">
      {stars}
      {showText && (
        <span className="rating-text">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}