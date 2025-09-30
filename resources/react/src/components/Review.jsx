import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import RatingStars from './RatingStars';
import { format } from '../utils/format';

export default function Review({ review, onLike }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likes || 0);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      if (onLike) onLike(review.id);
    }
  };

  return (
    <div className="card">
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 'var(--space-2)' 
        }}>
          <RatingStars rating={review.rating} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {format.dateShort(review.date)}
          </span>
        </div>
      </div>

      <p style={{ 
        marginBottom: 'var(--space-4)',
        lineHeight: 1.6,
        color: 'var(--text)'
      }}>
        {review.comment}
      </p>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Por {review.userName || 'Usuario anónimo'}
        </span>

        <button
          onClick={handleLike}
          className={`btn btn-sm ${liked ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <ThumbsUp size={16} />
          {likeCount}
        </button>
      </div>
    </div>
  );
}