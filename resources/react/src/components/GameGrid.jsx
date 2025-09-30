import GameCard from './GameCard';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';

export default function GameGrid({ 
  games, 
  loading = false, 
  showWishlist = true,
  emptyMessage = "No se encontraron juegos",
  emptyDescription = "Intenta ajustar los filtros o buscar otros términos"
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} variant="gameCard" />
        ))}
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
        icon="🎮"
      />
    );
  }

  return (
    <div 
      className="grid gap-6 animate-fade-in"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
      }}
    >
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          showWishlist={showWishlist}
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
}