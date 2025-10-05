import { NewsArticle } from "../types.ts";

const GIANTBOMB_API_KEY = '4d0aa575d934eb5feb898286010db017a7a7a4c0';

export async function fetchGiantBombNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `https://www.giantbomb.com/api/articles/?api_key=${GIANTBOMB_API_KEY}&format=json&limit=10`
    );

    if (!response.ok) return [];

    const data = await response.json();

    return data.results?.map((article: any) => ({
      title: article.title,
      url: article.site_detail_url,
      source: 'GiantBomb',
      publishedAt: article.publish_date,
      imageUrl: article.image?.medium_url,
    })) || [];
  } catch (error) {
    console.error('GiantBomb API error:', error);
    return [];
  }
}
