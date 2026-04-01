/**
 * useSubscription Hook
 * Manages subscription state and provides helpers for feature gating
 */

import { useState, useEffect, useCallback } from 'react';

// Storage key for caching subscription data
const SUBSCRIPTION_CACHE_KEY = 'mednav_subscription';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useSubscription(email) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load subscription data
  const fetchSubscription = useCallback(async () => {
    if (!email) {
      setSubscription({ plan: 'free', has_subscription: false });
      setLoading(false);
      return;
    }

    // Check cache first
    const cached = localStorage.getItem(SUBSCRIPTION_CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp, cachedEmail } = JSON.parse(cached);
        if (cachedEmail === email && Date.now() - timestamp < CACHE_DURATION) {
          setSubscription(data);
          setLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
      }
    }

    try {
      const response = await fetch('/.netlify/functions/get-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      setSubscription(data);

      // Cache the result
      localStorage.setItem(
        SUBSCRIPTION_CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now(), cachedEmail: email })
      );
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err.message);
      setSubscription({ plan: 'free', has_subscription: false });
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Fetch on mount and when email changes
  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Refresh subscription data (clears cache)
  const refresh = useCallback(() => {
    localStorage.removeItem(SUBSCRIPTION_CACHE_KEY);
    setLoading(true);
    fetchSubscription();
  }, [fetchSubscription]);

  // Check if user has Pro access
  const isPro = subscription?.plan === 'pro' && subscription?.subscription_status === 'active';

  // Check if subscription is past due
  const isPastDue = subscription?.subscription_status === 'past_due';

  // Check if subscription is cancelled but still active
  const isCancelled = subscription?.subscription_status === 'cancelled';

  // Open Stripe Customer Portal
  const openPortal = useCallback(async () => {
    if (!email) {
      throw new Error('Email is required to open portal');
    }

    const response = await fetch('/.netlify/functions/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to open portal');
    }

    const { url } = await response.json();
    window.location.href = url;
  }, [email]);

  return {
    subscription,
    loading,
    error,
    isPro,
    isPastDue,
    isCancelled,
    hasSubscription: subscription?.has_subscription || false,
    refresh,
    openPortal,
  };
}

export default useSubscription;
