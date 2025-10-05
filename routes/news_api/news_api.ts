import { NewsArticle } from "../types.ts";

const NEWS_API_KEY = '3024eb746e9b4e4abb441613277face6';

export async function fetchNewsAPI(): Promise<NewsArticle[]> {
  try {
    const domains = 'ign.com,gamespot.com,pcgamer.com,polygon.com,eurogamer.net';
    const response = await fetch(
      `https://newsapi.org/v2/everything?domains=${domains}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}&pageSize=20`
    );

    if (!response.ok) return [];

    const data = await response.json();

    return data.articles?.slice(0, 10).map((article: any) => ({
      title: article.title,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      imageUrl: article.urlToImage,
    })) || [];
  } catch (error) {
    console.error('NewsAPI error:', error);
    return [];
  }
}
