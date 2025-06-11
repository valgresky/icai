import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.10.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') as string,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { 
      price_id, 
      items = [], 
      mode = 'payment', 
      success_url, 
      cancel_url, 
      points_to_redeem = 0 
    } = await req.json()
    
    // Get user from Clerk token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Verify the Clerk token by making a request to Clerk's API
    const clerkResponse = await fetch('https://api.clerk.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!clerkResponse.ok) {
      throw new Error('Invalid Clerk token')
    }
    
    const clerkUser = await clerkResponse.json()
    const userId = clerkUser.id
    const userEmail = clerkUser.email_addresses[0]?.email_address
    
    if (!userId || !userEmail) {
      throw new Error('Unable to get user information from Clerk')
    }

    // Create or get Stripe customer
    let customer
    
    // First, try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    })
    
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          clerk_user_id: userId,
        },
      })
    }

    // Store customer mapping in Supabase
    await supabase
      .from('stripe_customers')
      .upsert({
        user_id: userId,
        customer_id: customer.id,
      })

    // Check if user has enough points if points_to_redeem > 0
    let discountAmount = 0
    if (points_to_redeem > 0) {
      const { data: userPoints } = await supabase
        .from('user_points')
        .select('available_points')
        .eq('user_id', userId)
        .single()
      
      if (!userPoints || userPoints.available_points < points_to_redeem) {
        throw new Error('Insufficient points')
      }
      
      // Calculate discount (100 points = $1)
      discountAmount = Math.floor(points_to_redeem / 100) * 100 // in cents
    }

    // Create checkout session
    const sessionConfig: any = {
      customer: customer.id,
      payment_method_types: ['card'],
      mode: mode,
      success_url: success_url || `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/pricing`,
      metadata: {
        clerk_user_id: userId,
        points_redeemed: points_to_redeem.toString(),
      },
    }

    // Handle line items - either from a single price_id or from items array
    if (price_id) {
      sessionConfig.line_items = [
        {
          price: price_id,
          quantity: 1,
        },
      ]
    } else if (items && items.length > 0) {
      sessionConfig.line_items = items.map((item: any) => ({
        price: item.price_id,
        quantity: item.quantity || 1,
      }))
    } else {
      throw new Error('No items specified for checkout')
    }
    
    // Apply discount if points are being redeemed
    if (discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discountAmount,
        currency: 'usd',
        duration: 'once',
        metadata: {
          userId,
          points_redeemed: points_to_redeem.toString(),
        }
      })
      
      sessionConfig.discounts = [{ coupon: coupon.id }]
      
      // Deduct points immediately
      await supabase.rpc('deduct_points', {
        user_id: userId,
        points_to_deduct: points_to_redeem,
      })
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Checkout error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})