import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno';
import { corsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify admin authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get all active products from Stripe
    const products = await stripe.products.list({ 
      limit: 100, 
      active: true 
    });

    const syncResults = {
      total: products.data.length,
      synced: 0,
      skipped: 0,
      errors: 0,
      details: []
    };

    // Process each product
    for (const product of products.data) {
      try {
        // Get prices for this product
        const prices = await stripe.prices.list({ 
          product: product.id,
          active: true
        });

        if (prices.data.length === 0) {
          syncResults.skipped++;
          syncResults.details.push({
            product_id: product.id,
            name: product.name,
            status: 'skipped',
            reason: 'No active prices found'
          });
          continue;
        }

        // Process each price
        for (const price of prices.data) {
          const { error } = await supabase.from('products').upsert({
            stripe_product_id: product.id,
            stripe_price_id: price.id,
            name: product.name,
            description: product.description,
            price: price.unit_amount,
            type: price.type === 'recurring' ? 'subscription' : 'one_time',
            active: product.active,
            metadata: product.metadata,
            updated_at: new Date().toISOString()
          });

          if (error) {
            syncResults.errors++;
            syncResults.details.push({
              product_id: product.id,
              price_id: price.id,
              name: product.name,
              status: 'error',
              error: error.message
            });
          } else {
            syncResults.synced++;
            syncResults.details.push({
              product_id: product.id,
              price_id: price.id,
              name: product.name,
              status: 'synced'
            });
          }
        }
      } catch (error) {
        syncResults.errors++;
        syncResults.details.push({
          product_id: product.id,
          name: product.name,
          status: 'error',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synced ${syncResults.synced} products, skipped ${syncResults.skipped}, errors: ${syncResults.errors}`,
        results: syncResults
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error syncing products:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});