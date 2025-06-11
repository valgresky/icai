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
const DOMAIN = Deno.env.get('DOMAIN') || 'http://localhost:3000';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify the JWT token with Clerk
    const clerkResponse = await fetch('https://api.clerk.com/v1/sessions/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('CLERK_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: authHeader.replace('Bearer ', ''),
      }),
    });

    if (!clerkResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const clerkData = await clerkResponse.json();
    const userId = clerkData.data.user_id;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID not found in token' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse the request body
    const { 
      price_id, 
      mode = 'payment', 
      success_url, 
      cancel_url,
      points_to_redeem = 0 
    } = await req.json();

    if (!price_id) {
      return new Response(
        JSON.stringify({ error: 'Missing price_id parameter' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if the user already has a Stripe customer ID
    const { data: customerData, error: customerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    let customerId;

    if (customerError || !customerData) {
      // Get user email from Clerk
      const userResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('CLERK_SECRET_KEY')}`,
          'Content-Type': 'application/json',
        },
      });
      
      const userData = await userResponse.json();
      const userEmail = userData.email_addresses?.[0]?.email_address;

      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          user_id: userId,
        },
      });

      customerId = customer.id;

      // Store the customer ID in the database
      await supabase.from('stripe_customers').insert({
        user_id: userId,
        customer_id: customerId,
      });
    } else {
      customerId = customerData.customer_id;
    }

    // Check if user has enough points if they're trying to redeem
    let discountAmount = 0;
    if (points_to_redeem > 0) {
      const { data: userPoints } = await supabase
        .from('user_points')
        .select('available_points')
        .eq('user_id', userId)
        .single();
      
      if (!userPoints || userPoints.available_points < points_to_redeem) {
        return new Response(
          JSON.stringify({ error: 'Insufficient points' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Calculate discount (100 points = $1)
      discountAmount = Math.floor(points_to_redeem / 100) * 100; // in cents
    }

    // Create checkout session configuration
    const sessionConfig = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: success_url || `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${DOMAIN}/pricing`,
      metadata: {
        user_id: userId,
        points_redeemed: points_to_redeem.toString(),
      },
    };
    
    // Apply discount if points are being redeemed
    if (discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discountAmount,
        currency: 'usd',
        duration: 'once',
        metadata: {
          user_id: userId,
          points_redeemed: points_to_redeem.toString(),
        }
      });
      
      sessionConfig.discounts = [{ coupon: coupon.id }];
      
      // Deduct points immediately
      const { error: deductError } = await supabase.rpc('deduct_points', {
        user_id: userId,
        points_to_deduct: points_to_redeem,
      });
      
      if (deductError) {
        console.error('Error deducting points:', deductError);
        return new Response(
          JSON.stringify({ error: 'Failed to deduct points' }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});