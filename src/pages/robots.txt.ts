import type { APIRoute } from 'astro';

// Search and AI-search crawlers are explicitly allowed (Cloudflare may block
// AI bots by default at the zone level; that setting is turned off at setup).
export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      'User-agent: Googlebot',
      'Allow: /',
      '',
      'User-agent: Bingbot',
      'Allow: /',
      '',
      'User-agent: OAI-SearchBot',
      'Allow: /',
      '',
      'User-agent: PerplexityBot',
      'Allow: /',
      '',
      `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
