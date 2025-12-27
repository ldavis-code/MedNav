# Load Testing Analysis: 5000 Concurrent Users

## Executive Summary

Your Medication Navigator is a **React SPA + Netlify serverless + Neon PostgreSQL** application. Here's how it will handle 5000 concurrent users:

| Component | Rating | Notes |
|-----------|--------|-------|
| Static Frontend (CDN) | ✅ Excellent | Global CDN, aggressive caching |
| Client-side Search | ✅ Excellent | Zero server load |
| Medications API | ⚠️ Moderate Risk | DB connection limits |
| AI Chat Feature | ❌ High Risk | Slow responses + rate limits |
| Analytics Events | ⚠️ Moderate Risk | Write-heavy, connection pooling needed |
| Price Reports | ⚠️ Moderate Risk | DB writes under load |

---

## Detailed Component Analysis

### 1. Frontend / Static Assets ✅

**Capacity: UNLIMITED (via CDN)**

Your React SPA is served from Netlify's global CDN with:
- 1-year cache on all static assets (JS/CSS/images)
- Content-hash filenames for cache busting
- PWA Service Worker for offline support

**What happens with 5000 users:**
- Assets served from edge locations worldwide
- Near-zero origin load
- Sub-second load times for returning users

**No changes needed.**

---

### 2. Client-Side Search (Fuse.js) ✅

**Capacity: UNLIMITED**

Your medication search runs entirely in the browser:
- 320+ medications loaded once on page load
- Fuse.js handles fuzzy search client-side
- Zero API calls for search operations

**What happens with 5000 users:**
- Each user searches independently in their browser
- No server load whatsoever

**No changes needed.**

---

### 3. Medications API ⚠️

**File:** `netlify/functions/medications.js`

**Current Implementation:**
```javascript
// Creates a new connection per request
let sql = null;
const getDb = () => {
    if (!sql) {
        sql = neon(process.env.DATABASE_URL);
    }
    return sql;
};
```

**Bottlenecks:**
1. **Netlify Function Concurrency:**
   - Free: 10 concurrent
   - Pro: 50 concurrent
   - Business: 100 concurrent

2. **Neon Database Connections:**
   - Free: 100 max connections
   - Pro: 500 max connections

**What happens with 5000 users loading medications:**
- If 10% hit the API at once = 500 concurrent requests
- On Pro plan: Only 50 can execute, 450 queue or timeout
- Database gets hammered with connection requests

**Current Mitigation (Already in place):**
```javascript
'Cache-Control': 'public, max-age=300' // 5-minute cache
```

This helps significantly! Browsers will cache the response for 5 minutes.

---

### 4. AI Chat Feature ❌

**File:** `netlify/functions/chat.js`

**This is your biggest bottleneck.**

**Current Implementation:**
- Each chat calls Claude API (3-10 seconds response time)
- Multiple DB queries per chat (medications, savings_programs, how_to_steps)
- No response caching

**Rate Limits (Anthropic API):**
| Tier | Requests/min | Tokens/min |
|------|-------------|------------|
| Tier 1 | 60 | 80,000 |
| Tier 2 | 120 | 160,000 |
| Tier 3 | 1,000 | 400,000 |

**What happens with 5000 users chatting:**
- 100 concurrent chat requests = likely Tier 1/2 limit hit
- Each request ties up a Netlify function for 3-10 seconds
- On Pro plan (50 concurrent): Massive queueing and timeouts
- Users will see "Request timed out" errors

---

### 5. Analytics Events API ⚠️

**Current Implementation:** Each page view/click sends an event to the database.

**What happens with 5000 users:**
- Potentially thousands of write operations per minute
- DB connection pool exhaustion
- Possible data loss during peak load

---

## Scaling Recommendations

### Tier 1: Quick Wins (Do Before Launch)

#### 1.1 Increase API Cache Headers

**File:** `netlify/functions/medications.js:21`

```javascript
// Change from 5 minutes to 1 hour for medications list
'Cache-Control': 'public, max-age=3600, s-maxage=3600'
```

The medications list rarely changes - cache it aggressively.

#### 1.2 Add Stale-While-Revalidate

```javascript
'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400'
```

This serves cached content while fetching fresh data in background.

#### 1.3 Rate Limit Chat API (Client-Side)

Add debouncing to prevent chat spam:
```javascript
// In your React chat component
const [isRateLimited, setIsRateLimited] = useState(false);

const sendMessage = async () => {
  if (isRateLimited) return;
  setIsRateLimited(true);
  // ... send message
  setTimeout(() => setIsRateLimited(false), 3000); // 3 second cooldown
};
```

---

### Tier 2: Infrastructure Changes (If You Expect Sustained Load)

#### 2.1 Upgrade Netlify Plan

| Plan | Concurrent Functions | Cost |
|------|---------------------|------|
| Pro | 50 | $19/mo |
| Business | 100 | $99/mo |
| Enterprise | 1000+ | Custom |

**Recommendation:** Start with Business ($99/mo) for launch.

#### 2.2 Upgrade Neon Database Plan

| Plan | Connections | Compute | Cost |
|------|-------------|---------|------|
| Free | 100 | 0.25 CU | $0 |
| Pro | 500 | Up to 8 CU | $19/mo |
| Business | 1000+ | Up to 10 CU | Custom |

**Recommendation:** Pro plan minimum for 5000 users.

#### 2.3 Add Connection Pooling

Neon supports connection pooling. Update your DATABASE_URL:
```
postgresql://user:pass@pooler.region.neon.tech/db?sslmode=require
```

Note the `pooler` subdomain - this routes through PgBouncer.

---

### Tier 3: Architectural Improvements (For Long-Term Scale)

#### 3.1 Cache Chat Results

Add Redis/KV store for common queries:

```javascript
// Example with Netlify Blobs or Upstash Redis
const cacheKey = `chat:${insuranceType}:${medicationId}`;
const cached = await cache.get(cacheKey);
if (cached) return cached;

const result = await generateClaudeResponse(...);
await cache.set(cacheKey, result, { ttl: 3600 }); // 1 hour
```

#### 3.2 Queue Long-Running Tasks

For AI chat, consider a queue-based approach:
1. User sends message → Get queued
2. Return immediately with "Processing..."
3. Poll for completion
4. Display result when ready

#### 3.3 Pre-Generate Common Responses

Most users ask similar questions. Pre-generate responses for:
- Top 20 medications
- Each insurance type
- Common medication + insurance combinations

Store in database, serve instantly without hitting Claude API.

---

## Load Testing Commands

Before launch, run these tests:

### Using k6 (Recommended)

```bash
# Install k6
brew install k6  # macOS
# or
apt install k6   # Ubuntu

# Create test script: load-test.js
```

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Ramp up to 100 users
    { duration: '1m', target: 500 },    // Ramp up to 500 users
    { duration: '2m', target: 1000 },   // Ramp up to 1000 users
    { duration: '1m', target: 0 },      // Ramp down
  ],
};

export default function () {
  // Test static page load
  const homeRes = http.get('https://medicationnavigator.com/');
  check(homeRes, {
    'home page status 200': (r) => r.status === 200,
    'home page < 2s': (r) => r.timings.duration < 2000,
  });

  // Test medications API
  const medsRes = http.get('https://medicationnavigator.com/api/medications');
  check(medsRes, {
    'medications API 200': (r) => r.status === 200,
    'medications API < 3s': (r) => r.timings.duration < 3000,
  });

  sleep(1);
}
```

```bash
# Run the test
k6 run load-test.js
```

### Using Apache Bench (Quick Test)

```bash
# Test static assets (should handle easily)
ab -n 1000 -c 100 https://medicationnavigator.com/

# Test medications API (watch for failures)
ab -n 500 -c 50 https://medicationnavigator.com/api/medications
```

---

## Monitoring During Launch

### 1. Netlify Dashboard
- Go to Functions → Monitor real-time invocations
- Watch for 502/503 errors (function limit hit)
- Monitor execution duration (timeout warnings)

### 2. Neon Dashboard
- Monitor active connections
- Watch for connection limit warnings
- Check query performance

### 3. Anthropic Dashboard
- Monitor API usage
- Watch for rate limit errors

---

## Quick Reference: What to Monitor

| Metric | Warning Threshold | Critical Threshold |
|--------|-------------------|-------------------|
| Netlify Function Errors | > 1% | > 5% |
| Function Duration | > 5s avg | > 10s avg |
| Neon Connections | > 70% limit | > 90% limit |
| Anthropic Rate Limits | Any 429 errors | Sustained 429s |
| Page Load Time | > 3s | > 5s |

---

## Cost Projections

### Scenario: 5000 Daily Active Users

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| Netlify Pro | Functions + Hosting | ~$50-100 |
| Neon Pro | Database | $19 |
| Anthropic API | ~10,000 chat sessions | ~$50-200 |
| **Total** | | **~$120-320/mo** |

### Scenario: 5000 Concurrent Users (Peak Event)

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| Netlify Business | High concurrency | $99 |
| Neon Business | Connection pooling | $69+ |
| Anthropic Tier 2+ | Higher rate limits | ~$200-500 |
| **Total** | | **~$370-670/mo** |

---

## Summary Checklist

### Before Launch:
- [ ] Upgrade to Netlify Pro or Business
- [ ] Upgrade to Neon Pro with connection pooling
- [ ] Increase Cache-Control headers on medications API
- [ ] Add client-side rate limiting on chat
- [ ] Set up monitoring dashboards

### During Launch:
- [ ] Monitor Netlify function errors
- [ ] Watch Neon connection count
- [ ] Check Anthropic rate limits
- [ ] Have scaling plan ready if needed

### After Launch:
- [ ] Analyze load test results
- [ ] Implement caching for common chat queries
- [ ] Consider pre-generating popular responses
