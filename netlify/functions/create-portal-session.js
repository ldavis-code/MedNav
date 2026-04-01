/**
 * Create Stripe Customer Portal Session
 * Allows subscribers to manage their billing, payment method, and subscription.
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
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Stripe not configured' }) };
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
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'No subscription found for this email' }) };
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${process.env.URL || 'https://medicationnavigator.com'}/account`,
    });

    return { statusCode: 200, headers, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error('Portal session error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to create portal session' }) };
  }
}
