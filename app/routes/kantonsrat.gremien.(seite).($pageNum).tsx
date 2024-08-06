import { HeadersFunction, json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import GroupFeed from "~/components/forPages/group/GroupFeed";
import NoResponse from "~/components/generics/NoResponse";

import { PUBLIC_CONFIG } from "~/config";
import { BACKEND_CONFIG } from "~/config/backend.server";
import texts from "~/texts";
import { APIRatsinfoGroupBase } from "~/types/ratsinfoAPI";
import { metasAndTitlesForRatsinfoFeedRoutes } from "~/utils/forMetasAndTitles";
import { removeTrailingSlash } from "~/utils/misc";


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.KANTONSRAT_GREMIEN_FEED
}


export const headers: HeadersFunction = () => {
    return {
        "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
    };
};


export const meta: MetaFunction<typeof loader> = ({ location, params, data }) => {
    const { DOMAIN_NAME, DEFAULT_OG_IMAGE, ROUTE_FRAGMENTS: { SEARCH_PARAM_FRAGMENT } } = PUBLIC_CONFIG
    const { metasAndTitles: { kantonsrat_gremien_feed, kantonsrat_gremien_feed_search } } = texts
    const { pathname } = location
    const { pageNum } = params
    const { title, metaDescription } = metasAndTitlesForRatsinfoFeedRoutes(
        pageNum,
        data,
        kantonsrat_gremien_feed,
        kantonsrat_gremien_feed_search
    )

    const optionalSearchParam = data?.keywordSearchParam ? SEARCH_PARAM_FRAGMENT + data.keywordSearchParam : ''
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
    const { DATA_API: { ENDPOINTS: { RATSINFO, RATSINFO_FRAGMENT_GROUPS }, PARAMS: { SEARCH } } } = BACKEND_CONFIG
    const { ENTRIES_SHOWN_IN_RATSINFO, ROUTE_FRAGMENTS: { KANTONSRAT, GREMIEN } } = PUBLIC_CONFIG
    const { pageNum } = params;
    const page = pageNum ? pageNum : 1
    const { searchParams } = new URL(request.url);
    const keywordSearchParam = searchParams.get('search')
    const optionalKeywordParam = keywordSearchParam ? SEARCH + keywordSearchParam : ''

    if (pageNum === '0' || pageNum === '1') return redirect(`/${KANTONSRAT}/${GREMIEN}`, { status: 302 })

    try {
        const feedFromApiRaw = await fetch(encodeURI(RATSINFO + RATSINFO_FRAGMENT_GROUPS + `?${optionalKeywordParam}&page=${page}&page_size=${ENTRIES_SHOWN_IN_RATSINFO}`));
        const feedFromApi: { count: number, results: APIRatsinfoGroupBase[] } = await feedFromApiRaw.json()
        if (feedFromApi.results) {
            return json({ ...feedFromApi, keywordSearchParam }, {
                headers: {
                    "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
                }
            })
        } else {
            return json({ feed: null, count: null })
        }
    } catch {
        return json(null, { status: 404 })
    }
}


export default function GroupsFeed() {
    const loaderData = useLoaderData<typeof loader>()

    return (
        <>
            {loaderData?.results ? <GroupFeed feed={loaderData.results} count={loaderData.count} /> : <NoResponse />}
        </>
    )
}