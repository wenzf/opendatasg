import { HeadersFunction, json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import PeopleFeed from "~/components/forPages/people/PeopleFeed";
import NoResponse from "~/components/generics/NoResponse";
import { PUBLIC_CONFIG } from "~/config";
import { BACKEND_CONFIG } from "~/config/backend.server";
import texts from "~/texts";
import { APIRatsinfoPeopleBase } from "~/types/ratsinfoAPI";
import { metasAndTitlesForRatsinfoFeedRoutes } from "~/utils/forMetasAndTitles";
import { removeTrailingSlash } from "~/utils/misc";


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.KANTONSRAT_PERSONEN_FEED
}


export const headers: HeadersFunction = () => {
    return {
        "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
    };
};


export const meta: MetaFunction<typeof loader> = ({ location, params, data }) => {
    const { DOMAIN_NAME, DEFAULT_OG_IMAGE, ROUTE_FRAGMENTS: { SEARCH_PARAM_FRAGMENT } } = PUBLIC_CONFIG
    const { metasAndTitles: { kantonsrat_personen_feed, kantonsrat_personen_feed_search } } = texts
    const { pathname } = location
    const { pageNum } = params
    const { title, metaDescription } = metasAndTitlesForRatsinfoFeedRoutes(
        pageNum,
        data,
        kantonsrat_personen_feed,
        kantonsrat_personen_feed_search
    )

    const optionalSearchParam = data?.keywordSearchParam ? SEARCH_PARAM_FRAGMENT + data.keywordSearchParam : ''
    return [
        { title },
        { name: "description", content: metaDescription },
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
    const { DATA_API: { ENDPOINTS: { RATSINFO } } } = BACKEND_CONFIG
    const { ENTRIES_SHOWN_IN_RATSINFO, ROUTE_FRAGMENTS: { KANTONSRAT, PERSONEN } } = PUBLIC_CONFIG
    const { pageNum } = params;
    const { searchParams } = new URL(request.url);
    const keywordSearchParam = searchParams.get('search')
    const optionalKeywordParam = keywordSearchParam ? `&search=${keywordSearchParam}` : ''

    if (pageNum === '0' || pageNum === '1') return redirect(`/${KANTONSRAT}/${PERSONEN}`, { status: 302 })

    try {
        const page = pageNum ? pageNum : 1
        const feedFromApiRaw = await fetch(RATSINFO + '/people' + `?${optionalKeywordParam}&page=${page}&page_size=${ENTRIES_SHOWN_IN_RATSINFO}&ordering=last_name`);
        const feedFromApi: { count: number, results: APIRatsinfoPeopleBase[] } = await feedFromApiRaw.json()
        if (feedFromApi) {
            return json({ ...feedFromApi, keywordSearchParam }, {
                headers: {
                    "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
                }
            })
        } else {
            return json(null)
        }
    } catch {
        return json(null, { status: 404 })
    }
}


export default function PersonenFeed() {
    const loaderData = useLoaderData<typeof loader>()

    return (
        <>
            {loaderData ? <PeopleFeed feed={loaderData.results} count={loaderData.count} /> : <NoResponse />}
        </>
    )
}