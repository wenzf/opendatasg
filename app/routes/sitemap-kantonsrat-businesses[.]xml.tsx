import type { LoaderFunction } from "@remix-run/node";
import { PUBLIC_CONFIG } from "~/config";
import { BACKEND_CONFIG } from "~/config/backend.server";


export const loader: LoaderFunction = async () => {
    const { DOMAIN_NAME } = PUBLIC_CONFIG;

    const { DATA_API: { ENDPOINTS: { RATSINFO } } } = BACKEND_CONFIG
    const { ROUTE_FRAGMENTS: {KANTONSRAT, GESCHAEFT} } = PUBLIC_CONFIG

    const resRaw = await fetch(`${RATSINFO + '/businesses'}`)
    const resParsed = await resRaw.json()

    let urlSet = ''

    for (let i = 0; i < resParsed.length; i += 1) {
        urlSet += `<url><loc>${DOMAIN_NAME + `/${KANTONSRAT}/${GESCHAEFT}/id/${resParsed[i].id}`}</loc><lastmod>${resParsed[i].touched}</lastmod></url>`
    }

    const markup = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlSet}</urlset>`

    return new Response(markup, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "x-content-type-options": "nosniff",
            "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
        }
    });
}

