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

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  
  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!)
    
    console.log('Received Stripe webhook:', event.type)
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session)
        break
        
      case 'invoice.payment_succeeded':
        await handleInvoicePayment(event.data.object as Stripe.Invoice)
        break
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break
    }
    
    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    )
  }
})

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  console.log('Processing checkout completion:', session.id)
  
  const clerkUserId = session.metadata?.clerk_user_id
  if (!clerkUserId) {
    console.error('No clerk_user_id in session metadata')
    return
  }

  // Record order for one-time payments
  if (session.mode === 'payment') {
    await supabase
      .from('stripe_orders')
      .insert({
        checkout_session_id: session.id,
        payment_intent_id: session.payment_intent as string,
        customer_id: session.customer as string,
        amount_subtotal: session.amount_subtotal!,
        amount_total: session.amount_total!,
        currency: session.currency!,
        payment_status: session.payment_status,
        status: 'completed',
      })
  }
}

async function handleInvoicePayment(invoice: Stripe.Invoice) {
  console.log('Processing invoice payment:', invoice.id)
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    const clerkUserId = subscription.metadata?.clerk_user_id
    
    if (clerkUserId) {
      // Update subscription data
      await handleSubscriptionChange(subscription)
    }
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Processing subscription change:', subscription.id)
  
  const clerkUserId = subscription.metadata?.clerk_user_id
  if (!clerkUserId) {
    console.error('No clerk_user_id in subscription metadata')
    return
  }

  // Get payment method details
  let paymentMethodBrand = null
  let paymentMethodLast4 = null
  
  if (subscription.default_payment_method) {
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        subscription.default_payment_method as string
      )
      paymentMethodBrand = paymentMethod.card?.brand
      paymentMethodLast4 = paymentMethod.card?.last4
    } catch (error) {
      console.error('Error fetching payment method:', error)
    }
  }

  await supabase
    .from('stripe_subscriptions')
    .upsert({
      customer_id: subscription.customer as string,
      subscription_id: subscription.id,
      price_id: subscription.items.data[0]?.price.id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      payment_method_brand: paymentMethodBrand,
      payment_method_last4: paymentMethodLast4,
    })
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  console.log('Processing subscription cancellation:', subscription.id)
  
  await supabase
    .from('stripe_subscriptions')
    .update({
      status: 'canceled',
      deleted_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscription.id)
}