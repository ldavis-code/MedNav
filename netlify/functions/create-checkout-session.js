/**
 * Stripe Checkout Session Creator
 * Creates a Stripe checkout session for subscription purchases
 *
 * Environment variables required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key
 * - STRIPE_MONTHLY_PRICE_ID: Price ID for monthly subscription
 * - STRIPE_YEARLY_PRICE_ID: Price ID for yearly subscription
 * - SITE_URL: Your site URL (e.g., https://medicationnavigator.com)
 */

import Stripe from 'stripe';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export async function handler(event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check for Stripe key
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Stripe is not configured' }),
    };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { plan, userId, email } = JSON.parse(event.body);

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid plan. Must be "monthly" or "yearly"' }),
      };
    }

    // Get the price ID based on plan
    const priceId = plan === 'monthly'
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;

    if (!priceId) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Price ID not configured for ${plan} plan` }),
      };
    }

    const siteUrl = process.env.SITE_URL || 'https://medicationnavigator.com';

    // Create checkout session options
    const sessionOptions = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/subscribe/cancel`,
      metadata: {
        userId: userId || '',
        plan: plan,
      },
      subscription_data: {
        metadata: {
          userId: userId || '',
          plan: plan,
        },
      },
    };

    // Add customer email if provided
    if (email) {
      sessionOptions.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      }),
    };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
