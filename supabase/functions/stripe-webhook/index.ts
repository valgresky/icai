import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new (await import('https://esm.sh/stripe@14.21.0')).default(
      Deno.env.get('STRIPE_SECRET_KEY') ?? '',
      {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
      }
    )

    // Initialize Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    if (!signature) {
      throw new Error('No stripe signature')
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
    )

    console.log('Webhook event type:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Checkout session completed:', session.id)

        // Get the customer
        const customer = await stripe.customers.retrieve(session.customer as string)
        
        // Find the user in our database
        const { data: stripeCustomer } = await supabaseClient
          .from('stripe_customers')
          .select('user_id')
          .eq('customer_id', customer.id)
          .single()

        if (!stripeCustomer) {
          console.error('Customer not found in database:', customer.id)
          break
        }

        // Create order record
        await supabaseClient
          .from('stripe_orders')
          .insert({
            checkout_session_id: session.id,
            payment_intent_id: session.payment_intent as string,
            customer_id: customer.id,
            amount_subtotal: session.amount_subtotal || 0,
            amount_total: session.amount_total || 0,
            currency: session.currency || 'usd',
            payment_status: session.payment_status,
            status: 'completed',
          })

        console.log('Order created for user:', stripeCustomer.user_id)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        console.log('Subscription event:', subscription.id)

        // Get the customer
        const customer = await stripe.customers.retrieve(subscription.customer as string)
        
        // Find the user in our database
        const { data: stripeCustomer } = await supabaseClient
          .from('stripe_customers')
          .select('user_id')
          .eq('customer_id', customer.id)
          .single()

        if (!stripeCustomer) {
          console.error('Customer not found in database:', customer.id)
          break
        }

        // Get payment method details
        let paymentMethodBrand = null
        let paymentMethodLast4 = null
        
        if (subscription.default_payment_method) {
          const paymentMethod = await stripe.paymentMethods.retrieve(
            subscription.default_payment_method as string
          )
          paymentMethodBrand = paymentMethod.card?.brand
          paymentMethodLast4 = paymentMethod.card?.last4
        }

        // Upsert subscription record
        await supabaseClient
          .from('stripe_subscriptions')
          .upsert({
            customer_id: customer.id,
            subscription_id: subscription.id,
            price_id: subscription.items.data[0]?.price.id,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end,
            payment_method_brand: paymentMethodBrand,
            payment_method_last4: paymentMethodLast4,
            status: subscription.status,
          }, {
            onConflict: 'customer_id'
          })

        console.log('Subscription updated for user:', stripeCustomer.user_id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        console.log('Subscription deleted:', subscription.id)

        // Mark subscription as deleted
        await supabaseClient
          .from('stripe_subscriptions')
          .update({ 
            status: 'canceled',
            deleted_at: new Date().toISOString()
          })
          .eq('subscription_id', subscription.id)

        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})