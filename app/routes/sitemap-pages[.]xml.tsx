import type { LoaderFunction } from "@remix-run/node";
import { PUBLIC_CONFIG } from "~/config";

export const loader: LoaderFunction = async () => {
    const {
        DOMAIN_NAME,
        ROUTE_FRAGMENTS: {
            KANTON, STADT, MITTEILUNGEN, VERNEHMLASSUNGEN,
            POLIZEI, SUCHE, IMPRESSUM, KANTONSRAT, GREMIEN,
            ABSTIMMUNG, PERSONEN, GESCHAEFT
        }
    } = PUBLIC_CONFIG;
    const allRoutes: string[] = [
        `/${KANTON}`,
        `/${STADT}`,
        `/${SUCHE}`,
        `/${IMPRESSUM}`,
        `/${KANTON}/${MITTEILUNGEN}`,
        `/${KANTON}/${VERNEHMLASSUNGEN}`,
        `/${STADT}/${POLIZEI}`,
        `/${STADT}/${MITTEILUNGEN}`,
        `/${KANTONSRAT}`,
        `/${KANTONSRAT}/${GREMIEN}`,
        `/${KANTONSRAT}/${ABSTIMMUNG}`,
        `/${KANTONSRAT}/${PERSONEN}`,
        `/${KANTONSRAT}/${GESCHAEFT}`,
    ]

    let urlSet = ''
    for (let i = 0; i < allRoutes.length; i += 1) {
        const oneEntry = `<url><loc>${DOMAIN_NAME + allRoutes[i]}</loc></url>`
        urlSet += oneEntry
    }

    const markup = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlSet}</urlset>`

    return new Response(markup, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "x-content-type-options": "nosniff",
            "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
        },
    });
}

