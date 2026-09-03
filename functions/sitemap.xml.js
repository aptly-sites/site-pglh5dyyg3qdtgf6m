// Cloudflare Pages Function — replaces app/sitemap.xml/route.ts. Builds the URL list against the
// request's own origin instead of a hardcoded domain, so it stays correct across the Pages.dev
// preview URL and any custom domain later attached. Drops the original's live-rental-listing
// fetch for now (fixed marketing pages only) — add it back here if the customer needs listing
// detail pages indexed.
const FIXED_PATHS = [
  '/',
  '/index.html',
  '/owner-faq.html',
  '/rental-search.html',
  '/resident-faq.html',
  '/vendors.html',
  '/agents.html',
  '/about.html',
  '/contact.html',
  '/privacy-policy.html',
  '/single-family-property-management.html',
  '/multi-family-property-management.html',
  '/tenant-placement.html',
  '/service-areas.html',
  '/self-managing-vs-property-manager-waco.html',
  '/property-management-waco-tx.html',
  '/property-management-woodway-tx.html',
  '/property-management-hewitt-tx.html',
  '/property-management-robinson-tx.html',
  '/property-management-china-spring-tx.html',
  '/property-management-bellmead-tx.html',
  '/property-management-lacy-lakeview-tx.html'
];

const xml = value =>
  String(value ?? '').replace(
    /[<>&'"]/g,
    character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character] || character)
  );

export async function onRequestGet({ request }) {
  const siteUrl = new URL(request.url).origin;
  const urls = FIXED_PATHS.map(
    path =>
      `<url><loc>${xml(`${siteUrl}${path}`)}</loc><changefreq>weekly</changefreq><priority>${
        path === '/' ? '1.0' : '0.8'
      }</priority></url>`
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } }
  );
}
