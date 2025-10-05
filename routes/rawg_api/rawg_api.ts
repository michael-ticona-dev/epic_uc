const RAWG_API = 'https://api.rawg.io/api';
const RAWG_KEY = 'bb0b7487053f47ca80fe77bf0bc6e899';

export async function fetchRawgData(title: string) {
  const response = await fetch(
    `${RAWG_API}/games?key=${RAWG_KEY}&search=${encodeURIComponent(title)}&page_size=1`
  );

  if (!response.ok) return null;

  const data = await response.json();
  if (!data.results || data.results.length === 0) return null;

  const game = data.results[0];
  return {
    name: game.name,
    slug: game.slug,
    cover: game.background_image || 'https://via.placeholder.com/800x450',
    platforms: game.platforms?.map((p: any) => p.platform.name) || ['PC'],
    metacritic: game.metacritic,
  };
}
