/**
 * Get Subscription Status
 * Checks Stripe subscription status for a given email.
 */

import Stripe from 'stripe';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { statusCode: 200, headers, body: JSON.stringify({ plan: 'free', has_subscription: false }) };
  }

  try {
    const { email } = JSON.parse(event.body || '{}');
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Find customer by email
    const customers = await stripe.customers.list({ email: email.toLowerCase(), limit: 1 });
    if (customers.data.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ plan: 'free', has_subscription: false }) };
    }

    const customer = customers.data[0];

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ plan: 'free', has_subscription: false }) };
    }

    const sub = subscriptions.data[0];
    const isActive = ['active', 'trialing'].includes(sub.status);
    const interval = sub.items.data[0]?.plan?.interval;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        plan: isActive ? 'pro' : 'free',
        has_subscription: true,
        subscription_status: sub.status,
        plan_type: interval === 'year' ? 'yearly' : 'monthly',
        current_period_end: sub.current_period_end,
        cancel_at_period_end: sub.cancel_at_period_end,
      }),
    };
  } catch (err) {
    console.error('Get subscription error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
}
