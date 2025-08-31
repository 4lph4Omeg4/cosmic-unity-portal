// src/services/stripeService.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // Harde, duidelijke fout in dev
  console.error('Supabase env mist. Check VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CheckoutRequest {
  org_id: string;
  price_id?: string;
}
export interface CheckoutResponse {
  url: string;
}

export class StripeService {
  static async createCheckoutSession({ org_id, price_id }: CheckoutRequest): Promise<CheckoutResponse> {
    if (!org_id) throw new Error('org_id ontbreekt');

    const { data, error } = await supabase.functions.invoke('swift-task', {
      body: { org_id, price_id },
    });

    if (error) {
      // Geeft nette fout door aan UI
      throw new Error(error.message || 'Checkout mislukt');
    }
    if (!data?.url) throw new Error('Geen checkout URL ontvangen');

    return data as CheckoutResponse;
  }
}
