import { HeadersFunction, json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BusinessFeed from "~/components/forPages/business/BusinessFeed";
import { PUBLIC_CONFIG } from "~/config";
import { BACKEND_CONFIG } from "~/config/backend.server";
import { APIRatsinfoBusinessBase } from "~/types/ratsinfoAPI";
import texts from "~/texts";
import { removeTrailingSlash } from "~/utils/misc";
import { metasAndTitlesForRatsinfoFeedRoutes } from "~/utils/forMetasAndTitles";
import NoResponse from "~/components/generics/NoResponse";


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.KANTONSRAT_GESCHAEFT_FEED
}


export const headers: HeadersFunction = () => {
    return {
        "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
    };
};


export const meta: MetaFunction<typeof loader> = ({ location, data, params }) => {
    const { DOMAIN_NAME, DEFAULT_OG_IMAGE, ROUTE_FRAGMENTS: { SEARCH_PARAM_FRAGMENT } } = PUBLIC_CONFIG
    const { metasAndTitles: { kantonsrat_geschaefte_feed, kantonsrat_geschaefte_feed_search } } = texts
    const { pathname } = location
    const { pageNum } = params
    const optionalSearchParam = data?.keywordSearchParam ? SEARCH_PARAM_FRAGMENT + data.keywordSearchParam : ''
    const { title, metaDescription } = metasAndTitlesForRatsinfoFeedRoutes(
        pageNum,
        data,
        kantonsrat_geschaefte_feed,
        kantonsrat_geschaefte_feed_search
    )

    return [
        { title },
        {
            name: "description",
            content: metaDescription
        },
        {
            tagName: "link",
            rel: "canonical",
            href: DOMAIN_NAME + removeTrailingSlash(pathname) + optionalSearchParam,
        },
        {
            property: "og:image",
            content: DEFAULT_OG_IMAGE()
        }
    ]
}


export const loader: LoaderFunction = async ({ params, request }) => {
    const { ENTRIES_SHOWN_IN_RATSINFO, ROUTE_FRAGMENTS: { KANTONSRAT, GESCHAEFT } } = PUBLIC_CONFIG
    const { DATA_API: {
        ENDPOINTS: { RATSINFO, RATSINFO_FRAGMENT_BUSINESSES },
        PARAMS: { SEARCH }
    } } = BACKEND_CONFIG
    const { pageNum } = params;
    const { searchParams } = new URL(request.url);
    const keywordSearchParam = searchParams.get('search')
    const optionalKeywordParam = keywordSearchParam ? SEARCH + keywordSearchParam : ''
    const page = pageNum ? pageNum : 1

    if (pageNum === '0' || pageNum === '1') return redirect(`/${KANTONSRAT}/${GESCHAEFT}`, { status: 302 })

    try {
        const feedRaw = await fetch(RATSINFO + RATSINFO_FRAGMENT_BUSINESSES + `?${optionalKeywordParam}&date_max&ordering=date_max&page=${page}&page_size=${ENTRIES_SHOWN_IN_RATSINFO}`);
        const feed: { count: number, results: APIRatsinfoBusinessBase[] } = await feedRaw.json();

        if (feed) {
            return json({ feed, keywordSearchParam }, {
                headers: {
                    "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
                }
            })
        } else {
            return json({ feed: [] })
        }
    } catch {
        return json(null, { status: 404 })
    }
}


export default function Kantonsrat() {
    const loaderData = useLoaderData<typeof loader>()

    return (
        <>
            {loaderData?.feed ? <BusinessFeed feed={loaderData.feed.results} count={loaderData.feed.count} /> : <NoResponse />}
        </>
    )
}