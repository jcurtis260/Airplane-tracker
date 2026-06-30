import { NextResponse } from 'next/server';

/**
 * Admin endpoint to clear server-side cache
 * Protected - should only be called by authorized users
 * 
 * Usage: POST /api/admin/clear-cache with X-Admin-Secret header
 */
export async function POST(request: Request) {
  // Check for admin secret (set in environment variables)
  const adminSecret = request.headers.get('X-Admin-Secret');
  const expectedSecret = process.env.ADMIN_SECRET || 'change-me-in-production';
  
  if (adminSecret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // In production with Redis/KV, you would clear the cache here
  // For in-memory cache, it clears on deployment/restart anyway
  
  return NextResponse.json({
    success: true,
    message: 'Server cache will clear on next deployment. Client caches managed locally.',
    note: 'In-memory cache is ephemeral and clears on serverless function cold starts.',
  });
}

export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed',
    message: 'Use POST with X-Admin-Secret header',
  }, { status: 405 });
}
