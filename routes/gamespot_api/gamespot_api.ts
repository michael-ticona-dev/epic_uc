import { NewsArticle } from "../types.ts";

const GAMESPOT_API_KEY = '2ffc879bb0611613bb83822abacde073da181eb3';

export async function fetchGameSpotNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `https://www.gamespot.com/api/articles/?api_key=${GAMESPOT_API_KEY}&format=json&limit=20&sort=publish_date:desc`,
      { headers: { 'User-Agent': 'EPIC-UC/1.0' } }
    );

    if (!response.ok) return [];

    const data = await response.json();

    return data.results?.slice(0, 10).map((article: any) => ({
      title: article.title,
      url: article.site_detail_url,
      source: 'GameSpot',
      publishedAt: article.publish_date,
      imageUrl: article.image?.screen_url || article.image?.medium_url,
    })) || [];
  } catch (error) {
    console.error('GameSpot API error:', error);
    return [];
  }
}
