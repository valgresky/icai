import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing Stripe signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handleInvoicePayment(invoice);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionChange(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

async function handleCheckoutComplete(session) {
  // Get the user ID from the metadata
  const userId = session.metadata?.user_id;
  if (!userId) {
    console.error('No user ID found in session metadata');
    return;
  }
  
  // Record transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      stripe_payment_intent_id: session.payment_intent,
      amount: session.amount_total,
      currency: session.currency,
      status: 'completed',
      description: `Purchase from checkout session ${session.id}`,
      product_id: session.metadata?.product_id,
    })
    .select()
    .single();
  
  if (transactionError) {
    console.error('Error recording transaction:', transactionError);
    return;
  }
  
  // Award points (100 points per dollar)
  const pointsToAward = Math.floor(session.amount_total / 100) * 100;
  
  if (pointsToAward > 0) {
    const { error: pointsError } = await supabase.rpc('award_points', {
      user_id: userId,
      points_to_award: pointsToAward,
      description: `Earned ${pointsToAward} points from purchase`,
      transaction_id: transaction.id
    });
    
    if (pointsError) {
      console.error('Error awarding points:', pointsError);
    }
  }
  
  // If points were redeemed, record that as well
  const pointsRedeemed = parseInt(session.metadata?.points_redeemed || '0', 10);
  if (pointsRedeemed > 0) {
    // Points were already deducted at checkout time, just record the transaction
    await supabase.from('points_transactions').insert({
      user_id: userId,
      points: -pointsRedeemed,
      type: 'redeemed',
      description: `Redeemed ${pointsRedeemed} points for discount on order ${session.id}`,
      transaction_id: transaction.id
    });
  }
}

async function handleInvoicePayment(invoice) {
  // Only process paid invoices
  if (invoice.status !== 'paid') return;
  
  // Get the subscription
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  
  // Get the user ID from the metadata
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('No user ID found in subscription metadata');
    return;
  }
  
  // Record transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      stripe_invoice_id: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'completed',
      description: `Subscription payment for period ${new Date(invoice.period_start * 1000).toISOString()} to ${new Date(invoice.period_end * 1000).toISOString()}`,
      product_id: subscription.items.data[0].price.product,
    })
    .select()
    .single();
  
  if (transactionError) {
    console.error('Error recording transaction:', transactionError);
    return;
  }
  
  // Award points for subscription payment (100 points per dollar)
  const pointsToAward = Math.floor(invoice.amount_paid / 100) * 100;
  
  if (pointsToAward > 0) {
    const { error: pointsError } = await supabase.rpc('award_points', {
      user_id: userId,
      points_to_award: pointsToAward,
      description: `Earned ${pointsToAward} points from subscription payment`,
      transaction_id: transaction.id
    });
    
    if (pointsError) {
      console.error('Error awarding points:', pointsError);
    }
  }
}

async function handleSubscriptionChange(subscription) {
  // Get the user ID from the metadata
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('No user ID found in subscription metadata');
    return;
  }
  
  // Get payment method details if available
  let paymentMethodDetails = null;
  if (subscription.default_payment_method) {
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        subscription.default_payment_method
      );
      
      if (paymentMethod.type === 'card') {
        paymentMethodDetails = {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4
        };
      }
    } catch (error) {
      console.error('Error retrieving payment method:', error);
    }
  }
  
  // Update subscription in database
  const { error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      stripe_price_id: subscription.items.data[0].price.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    });
  
  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionCanceled(subscription) {
  // Get the user ID from the metadata
  const userId = subscription.metadata?.user_id;
  if (!userId) {
    console.error('No user ID found in subscription metadata');
    return;
  }
  
  // Update subscription status in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
  
  if (error) {
    console.error('Error updating subscription status:', error);
  }
}