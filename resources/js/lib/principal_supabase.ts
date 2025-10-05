import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
      };
      games: {
        Row: {
          id: string;
          slug: string;
          title: string;
          price: number;
          discount: number;
          platforms: string[];
          tags: string[];
          rating: number;
          ratings_count: number;
          release_date: string;
          developer: string;
          publisher: string;
          languages: string[];
          size_gb: number;
          about: string;
          youtube_id: string;
          cover: string;
          gallery: string[];
          stores: string[];
          sys_req_min: Record<string, string>;
          sys_req_rec: Record<string, string>;
          created_at: string;
          updated_at: string;
        };
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          game_id: string;
          created_at: string;
        };
      };
      library: {
        Row: {
          id: string;
          user_id: string;
          game_id: string;
          acquired_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          items: any[];
          subtotal: number;
          discount_amount: number;
          coupon_code: string | null;
          total: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
