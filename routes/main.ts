import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { supabase, resetDealsTable, insertDeal, getActiveDeals } from "./superbase_api/superbase_api.ts";
import { fetchRawgData } from "./rawg_api/rawg_api.ts";
import { fetchCheapSharkDeals, STORE_MAP } from "./cheapshark_api/cheapshark_api.ts";
import { fetchGameSpotNews } from "./gamespot_api/gamespot_api.ts";
import { fetchNewsAPI } from "./news_api/news_api.ts";
import { fetchGiantBombNews } from "./giantbomb_api/giantbomb_api.ts";

import { NewsArticle } from "./types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // 🎮 ENDPOINT DE NOTICIAS
    if (action === 'news' || req.method === 'GET' && !action) {
      console.log('📰 Solicitando noticias de videojuegos...');
      
      let articles: NewsArticle[] = [];

      // Prioridad: GameSpot → NewsAPI → GiantBomb
      articles = await fetchGameSpotNews();
      if (articles.length === 0) {
        articles = await fetchNewsAPI();
      }
      if (articles.length === 0) {
        articles = await fetchGiantBombNews();
      }

      // Ordenar por fecha (más recientes primero)
      articles.sort((a, b) => {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      });

      return new Response(
        JSON.stringify({
          success: true,
          news: articles.slice(0, 15),
          count: articles.length
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 🎯 ENDPOINT DE OFERTAS (POST)
    if (action === 'deals' || req.method === 'POST') {
      console.log('⚙️ Iniciando actualización de deals...');
      
      await resetDealsTable();
      let dealsCount = 0;

      // 🔹 Procesar lista local de ofertas
      const CURRENT_DEALS = [
        { title: 'Ghost of Tsushima DIRECTORS CUT', store: 'Steam', discount: 25 },
        { title: 'Sons Of The Forest', store: 'Steam', discount: 30 },
        { title: 'Cyberpunk 2077', store: 'Steam', discount: 50 },
        { title: 'Cyberpunk 2077', store: 'Epic Games', discount: 45 },
        { title: 'Red Dead Redemption 2', store: 'Steam', discount: 60 },
        { title: 'Red Dead Redemption 2', store: 'Epic Games', discount: 55 },
        { title: 'The Witcher 3', store: 'Steam', discount: 80 },
        { title: 'The Witcher 3', store: 'GOG', discount: 85 },
        { title: 'God of War', store: 'Steam', discount: 40 },
        { title: 'Elden Ring', store: 'Steam', discount: 30 },
        { title: 'Baldurs Gate 3', store: 'Steam', discount: 10 },
        { title: 'Hogwarts Legacy', store: 'Steam', discount: 50 },
        { title: 'Hogwarts Legacy', store: 'Epic Games', discount: 50 },
        { title: 'Starfield', store: 'Steam', discount: 33 },
        { title: 'Spider-Man Remastered', store: 'Steam', discount: 40 },
        { title: 'Spider-Man Remastered', store: 'Epic Games', discount: 35 },
        { title: 'Spider-Man Miles Morales', store: 'Steam', discount: 35 },
        { title: 'Grand Theft Auto V', store: 'Steam', discount: 67 },
        { title: 'Grand Theft Auto V', store: 'Epic Games', discount: 60 },
        { title: 'Resident Evil 4', store: 'Steam', discount: 40 },
        { title: 'Resident Evil Village', store: 'Steam', discount: 50 },
        { title: 'Resident Evil 2', store: 'Steam', discount: 60 },
        { title: 'Resident Evil 3', store: 'Steam', discount: 60 },
        { title: 'Dead Space', store: 'Steam', discount: 60 },
        { title: 'Dead Space', store: 'Epic Games', discount: 55 },
        { title: 'Dying Light 2', store: 'Steam', discount: 50 },
        { title: 'Dying Light 2', store: 'Epic Games', discount: 50 },
        { title: 'Hitman 3', store: 'Steam', discount: 80 },
        { title: 'Hitman 3', store: 'Epic Games', discount: 75 },
        { title: 'Control', store: 'Steam', discount: 80 },
        { title: 'Control', store: 'Epic Games', discount: 75 },
        { title: 'Death Stranding', store: 'Steam', discount: 70 },
        { title: 'Death Stranding', store: 'Epic Games', discount: 65 },
        { title: 'Horizon Zero Dawn', store: 'Steam', discount: 50 },
        { title: 'Horizon Zero Dawn', store: 'Epic Games', discount: 50 },
        { title: 'Days Gone', store: 'Steam', discount: 60 },
        { title: 'Alan Wake 2', store: 'Steam', discount: 25 },
        { title: 'Alan Wake 2', store: 'Epic Games', discount: 30 },
        { title: 'Lies of P', store: 'Steam', discount: 40 },
        { title: 'Remnant 2', store: 'Steam', discount: 35 },
        { title: 'Remnant 2', store: 'Epic Games', discount: 35 },
        { title: 'Atomic Heart', store: 'Steam', discount: 50 },
        { title: 'Forspoken', store: 'Steam', discount: 67 },
        { title: 'Forspoken', store: 'Epic Games', discount: 60 },
        { title: 'The Callisto Protocol', store: 'Steam', discount: 75 },
        { title: 'Star Wars Jedi Survivor', store: 'Steam', discount: 40 },
        { title: 'Star Wars Jedi Survivor', store: 'Epic Games', discount: 40 },
      ];

      for (const dealInfo of CURRENT_DEALS) {
        try {
          const game = await fetchRawgData(dealInfo.title);
          if (!game) continue;

          const basePrice = game.metacritic > 80 ? 249 : game.metacritic > 70 ? 199 : 149;
          const discountDecimal = dealInfo.discount / 100;
          const discountedPrice = basePrice * (1 - discountDecimal);

          // Generar URL de la tienda
          let storeUrl = '';
          if (dealInfo.store === 'Steam') {
            storeUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(game.name)}`;
          } else if (dealInfo.store === 'Epic Games') {
            storeUrl = `https://store.epicgames.com/es-ES/browse?q=${encodeURIComponent(game.name)}`;
          } else if (dealInfo.store === 'GOG') {
            storeUrl = `https://www.gog.com/games?query=${encodeURIComponent(game.name)}`;
          } else {
            storeUrl = `https://www.google.com/search?q=${encodeURIComponent(game.name + ' ' + dealInfo.store)}`;
          }

          const validUntil = new Date();
          validUntil.setDate(validUntil.getDate() + 30);

          await insertDeal({
            game_title: game.name,
            game_slug: game.slug,
            cover_image: game.cover,
            store: dealInfo.store,
            store_url: storeUrl,
            price_original: basePrice,
            price_discount: discountedPrice,
            discount_percent: dealInfo.discount,
            platforms: game.platforms,
            is_active: true,
            valid_until: validUntil.toISOString().split('T')[0],
          });

          dealsCount++;
          console.log(`✅ Added: ${game.name} on ${dealInfo.store} (${dealInfo.discount}% off)`);
        } catch (error) {
          console.error(`❌ Error with ${dealInfo.title}:`, error);
        }
      }

      // 🔹 Agregar ofertas de CheapShark
      console.log('🦈 Fetching CheapShark deals...');
      const cheapDeals = await fetchCheapSharkDeals();
      for (const deal of cheapDeals) {
        try {
          const savings = parseFloat(deal.savings);
          if (savings < 15) continue;

          const game = await fetchRawgData(deal.title);
          if (!game) continue;

          const validUntil = new Date();
          validUntil.setDate(validUntil.getDate() + 14);

          await insertDeal({
            game_title: game.name,
            game_slug: game.slug,
            cover_image: game.cover,
            store: STORE_MAP[deal.storeID] || 'Steam',
            store_url: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`,
            price_original: parseFloat(deal.normalPrice) * 3.75,
            price_discount: parseFloat(deal.salePrice) * 3.75,
            discount_percent: Math.round(savings),
            platforms: game.platforms,
            is_active: true,
            valid_until: validUntil.toISOString().split('T')[0],
          });

          dealsCount++;
        } catch (error) {
          console.error('❌ Error processing CheapShark deal:', error);
        }
      }

      const finalDeals = await getActiveDeals();
      console.log(`🎯 Total deals activos: ${finalDeals?.length || 0}`);

      return new Response(
        JSON.stringify({
          success: true,
          count: finalDeals?.length || 0,
          message: `Deals actualizados (${dealsCount} procesados).`,
          deals: finalDeals
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 🔄 ENDPOINT COMBINADO (deals + news)
    if (action === 'all' || (!action && req.method === 'POST')) {
      console.log('🔄 Ejecutando actualización completa...');
      
      // Ejecutar en paralelo
      const [dealsResult, newsArticles] = await Promise.all([
        (async () => {
          await resetDealsTable();
          let dealsCount = 0;
          
          // ... (código de deals igual que arriba)
          
          const finalDeals = await getActiveDeals();
          return {
            success: true,
            count: finalDeals?.length || 0,
            deals: finalDeals
          };
        })(),
        (async () => {
          let articles: NewsArticle[] = await fetchGameSpotNews();
          if (articles.length === 0) articles = await fetchNewsAPI();
          if (articles.length === 0) articles = await fetchGiantBombNews();
          
          articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          return articles.slice(0, 15);
        })()
      ]);

      return new Response(
        JSON.stringify({
          success: true,
          ...dealsResult,
          news: newsArticles,
          message: 'Actualización completa exitosa'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ❌ Acción no reconocida
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Acción no reconocida. Use: news, deals o all' 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('❌ Error general:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});