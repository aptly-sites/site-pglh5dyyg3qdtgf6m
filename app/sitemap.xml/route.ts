const FEED_URL = "https://app.getaptly.com/api/portal/listings/yDgjRcz9hTcv4iav4";
const SITE_URL = "https://jr-grace-realty-review.sshekou.chatgpt.site";
const xml = (value: unknown) => String(value ?? "").replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '\"': "&quot;" }[character] || character));

export async function GET() {
  let listings: { _id?: string; updatedAt?: string }[] = [];
  try {
    const response = await fetch(FEED_URL);
    if (response.ok) listings = ((await response.json())?.data || []);
  } catch {}
  const fixed = ["/", "/index.html", "/owner-faq", "/rental-search.html", "/resident-faq.html", "/vendors.html", "/agents.html", "/about.html", "/contact.html", "/privacy-policy.html", "/single-family-property-management.html", "/multi-family-property-management.html", "/tenant-placement.html", "/service-areas.html", "/self-managing-vs-property-manager-waco.html", "/property-management-waco-tx.html", "/property-management-woodway-tx.html", "/property-management-hewitt-tx.html", "/property-management-robinson-tx.html", "/property-management-china-spring-tx.html", "/property-management-bellmead-tx.html", "/property-management-lacy-lakeview-tx.html"];
  const urls = [
    ...fixed.map((path) => `<url><loc>${xml(`${SITE_URL}${path}`)}</loc><changefreq>weekly</changefreq><priority>${path === "/" ? "1.0" : "0.8"}</priority></url>`),
    ...listings.filter((listing) => listing._id).map((listing) => `<url><loc>${xml(`${SITE_URL}/rental-detail.html?id=${encodeURIComponent(listing._id!)}`)}</loc>${listing.updatedAt ? `<lastmod>${xml(new Date(listing.updatedAt).toISOString())}</lastmod>` : ""}<changefreq>daily</changefreq><priority>0.9</priority></url>`),
  ];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
