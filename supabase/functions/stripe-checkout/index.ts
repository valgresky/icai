import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CheckoutRequest {
  items: Array<{
    price_id: string;
    quantity: number;
  }>;
  success_url?: string;
  cancel_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get the user from the auth header
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    // Parse the request body
    const { items, success_url, cancel_url }: CheckoutRequest = await req.json()

    if (!items || items.length === 0) {
      throw new Error('No items provided')
    }

    // Initialize Stripe
    const stripe = new (await import('https://esm.sh/stripe@14.21.0')).default(
      Deno.env.get('STRIPE_SECRET_KEY') ?? '',
      {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
      }
    )

    // Get or create Stripe customer
    let customer
    const { data: existingCustomer } = await supabaseClient
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .single()

    if (existingCustomer) {
      customer = await stripe.customers.retrieve(existingCustomer.customer_id)
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })

      // Store customer in database
      await supabaseClient
        .from('stripe_customers')
        .insert({
          user_id: user.id,
          customer_id: customer.id,
        })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price: item.price_id,
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: success_url || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/marketplace`,
      metadata: {
        user_id: user.id,
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})