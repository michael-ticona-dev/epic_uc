import { createClient } from 'npm:@supabase/supabase-js@2';

export const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

export async function resetDealsTable() {
  await supabase.from('deals_standalone')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
}

export async function insertDeal(deal: any) {
  await supabase.from('deals_standalone').insert(deal);
}

export async function getActiveDeals() {
  const { data } = await supabase
    .from('deals_standalone')
    .select('*')
    .eq('is_active', true)
    .order('discount_percent', { ascending: false });
  return data;
}
