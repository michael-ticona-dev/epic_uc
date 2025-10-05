const CHEAPSHARK_API = 'https://www.cheapshark.com/api/1.0';

export const STORE_MAP: Record<string, string> = {
  '1': 'Steam',
  '25': 'Epic Games',
  '7': 'GOG',
  '11': 'Humble Store',
  '15': 'Fanatical',
  '3': 'GreenManGaming',
};

export async function fetchCheapSharkDeals() {
  const response = await fetch(`${CHEAPSHARK_API}/deals?pageSize=50&sortBy=Savings&storeID=1`);
  if (!response.ok) return [];

  const data = await response.json();
  return data.slice(0, 30).filter((deal: any) => parseFloat(deal.savings) >= 15);
}
