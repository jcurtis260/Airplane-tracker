# Caching Strategy

This app implements a **multi-layer caching strategy** to minimize API calls and improve performance.

## 📊 Current Implementation

### Layer 1: Browser Cache (Client-Side)
**Location**: `lib/local-cache.ts`
- **TTL**: 24 hours for routes
- **Storage**: localStorage (5-10MB browser storage)
- **Scope**: Per-user, persists across sessions
- **Benefits**: 
  - Instant load for previously seen flights
  - Works offline
  - Zero API calls for cached data

### Layer 2: Server Memory Cache
**Location**: `app/api/route/route.ts`
- **TTL**: 24 hours for successful lookups, 1 hour for failures
- **Storage**: In-memory Map (per serverless function instance)
- **Scope**: Per-function-instance (lost on cold starts)
- **Benefits**:
  - Fast server-side lookups
  - Reduces API spam
  - Shared across users on same instance

### Layer 3: CDN/Edge Cache (Vercel)
**Headers**: 
```
Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800
```
- **TTL**: 24 hours fresh, 7 days stale-while-revalidate
- **Storage**: Vercel's edge network
- **Scope**: Global, shared across all users
- **Benefits**:
  - Ultra-fast edge responses
  - Lowest latency worldwide
  - Massive scale

## 📈 Cache Performance

### Monitoring
Check response headers:
- `X-Cache-Status`: HIT or MISS
- `X-Cache-Age`: Seconds since cached
- `X-Cache-Hits`: Times this entry was served
- `X-Cache-Size`: Total cache entries

### Expected Hit Rates
- **First-time users**: 0% (cold start)
- **After 30 mins**: 60-80% (common flights cached)
- **After 24 hours**: 90%+ (most routes cached)

### API Call Reduction
**Without caching**: 
- 100 flights × 30s refresh = ~120 route API calls/hour

**With caching**:
- First visit: ~100 calls
- Subsequent visits: ~5-10 calls (only new flights)
- **95% reduction** in API calls!

## 🚀 Optional: Upgrade to Persistent Cache

For production apps with high traffic, consider **Vercel KV (Redis)**:

### Benefits
- ✅ Persistent across deployments
- ✅ Shared across all function instances
- ✅ Sub-millisecond lookups
- ✅ Built-in TTL management
- ✅ 256MB storage on free tier

### Implementation
```bash
# 1. Install Vercel KV
npm install @vercel/kv

# 2. Create KV database in Vercel dashboard
# 3. Update app/api/route/route.ts:

import { kv } from '@vercel/kv';

// Replace in-memory cache with:
const cached = await kv.get(`route:${cleanCallsign}`);
if (cached) return NextResponse.json(cached);

// After fetching:
await kv.set(`route:${cleanCallsign}`, route, { ex: 86400 });
```

### Cost
- **Hobby**: Free (256MB, 3,000 commands/day)
- **Pro**: $1/month (512MB, 10,000 commands/day)

## 🎯 Best Practices

1. **Always cache negative results** (failed lookups) with shorter TTL
2. **Use stale-while-revalidate** for better UX
3. **Monitor cache hit rates** via headers
4. **Clean up expired entries** periodically
5. **Consider Redis/KV** for production scale

## 📝 Cache Invalidation

Routes rarely change, so aggressive caching is safe:
- **Flight routes**: Change seasonally (~quarterly)
- **Aircraft types**: Almost never change
- **Airport data**: Very stable

**When to clear cache:**
- Major airline route changes (rare)
- User reports stale data
- Manual clear via cache stats component

## 🔍 Debugging Cache Issues

Check browser console for:
- `[CLIENT][ROUTE] 💾 Using cached route`
- `[SERVER][ROUTE] 💾 CACHE HIT`

Check Network tab response headers:
- `X-Cache-Status: HIT` = served from cache
- `X-Cache-Status: MISS` = fresh API call
- `Age: 3600` = CDN cache age in seconds
