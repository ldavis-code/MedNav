/**
 * Stripe Webhook Handler
 * Handles subscription events from Stripe
 *
 * Environment variables required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret from Stripe Dashboard
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_SERVICE_KEY: Supabase service role key (for admin access)
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe environment variables not configured');
    return { statusCode: 500, body: 'Stripe not configured' };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Initialize Supabase with service role key for admin access
  const supabase = createClient(
    process.env.SUPABASE_URL || 'https://lhvemrazkwlmdaljrcln.supabase.co',
    process.env.SUPABASE_SERVICE_KEY
  );

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        console.log('Checkout completed:', session.id);

        // Get customer email and metadata
        const customerEmail = session.customer_email || session.customer_details?.email;
        const plan = session.metadata?.plan || 'pro';
        const userId = session.metadata?.userId;

        if (customerEmail) {
          // Update user profile with subscription info
          const { error } = await supabase
            .from('user_profiles')
            .update({
              plan: 'pro',
              stripe_customer_id: session.customer,
              stripe_subscription_id: session.subscription,
              subscription_status: 'active',
              subscription_plan: plan, // 'monthly' or 'yearly'
              updated_at: new Date().toISOString()
            })
            .eq('email', customerEmail);

          if (error) {
            console.error('Error updating user profile:', error);
          } else {
            console.log(`Updated subscription for ${customerEmail} to ${plan}`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object;
        console.log('Subscription updated:', subscription.id);

        const { error } = await supabase
          .from('user_profiles')
          .update({
            subscription_status: subscription.status,
            plan: subscription.status === 'active' ? 'pro' : 'free',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error updating subscription status:', error);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object;
        console.log('Subscription cancelled:', subscription.id);

        const { error } = await supabase
          .from('user_profiles')
          .update({
            plan: 'free',
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) {
          console.error('Error updating cancelled subscription:', error);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object;
        console.log('Payment failed for invoice:', invoice.id);

        const { error } = await supabase
          .from('user_profiles')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', invoice.customer);

        if (error) {
          console.error('Error updating payment failed status:', error);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error) {
    console.error('Webhook handler error:', error);
    return { statusCode: 500, body: `Webhook Error: ${error.message}` };
  }
}
