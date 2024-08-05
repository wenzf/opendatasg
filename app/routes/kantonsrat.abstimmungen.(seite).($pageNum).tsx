import { HeadersFunction, json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import VotingFeed from "~/components/forPages/voting/VotingFeed"
import NoResponse from "~/components/generics/NoResponse"
import { PUBLIC_CONFIG } from "~/config"
import { BACKEND_CONFIG } from "~/config/backend.server"
import texts from "~/texts"
import { APIRatsinfoVotings } from "~/types/ratsinfoAPI"
import { metasAndTitlesForRatsinfoFeedRoutes } from "~/utils/forMetasAndTitles"
import { removeTrailingSlash } from "~/utils/misc"


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.KANTONSRAT_ABSTIMMUNGEN_FEED
}


export const headers: HeadersFunction = () => {
    return {
        "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
    };
};


export const meta: MetaFunction<typeof loader> = ({ location, data, params }) => {
    const { DOMAIN_NAME, DEFAULT_OG_IMAGE, ROUTE_FRAGMENTS: { SEARCH_PARAM_FRAGMENT } } = PUBLIC_CONFIG
    const { metasAndTitles: { kantonsrat_abstimmungen_feed,
        kantonsrat_abstimmungen_feed_search } } = texts
    const { pathname } = location;
    const { pageNum } = params
    const { title, metaDescription } = metasAndTitlesForRatsinfoFeedRoutes(
        pageNum,
        data,
        kantonsrat_abstimmungen_feed,
        kantonsrat_abstimmungen_feed_search
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
    const { ENTRIES_SHOWN_IN_RATSINFO, ROUTE_FRAGMENTS: { KANTONSRAT, ABSTIMMUNG } } = PUBLIC_CONFIG
    const { DATA_API: { ENDPOINTS: { RATSINFO, RATSINFO_FRAGMENT_VOTINGS } } } = BACKEND_CONFIG

    const { searchParams } = new URL(request.url);
    const keywordSearchParam = searchParams.get('search')
    const optionalKeywordParam = keywordSearchParam ? `&search=${keywordSearchParam}` : ''
    const { pageNum } = params
    const page = pageNum ? pageNum : 1

    if (pageNum === '0' || pageNum === '1') return redirect(`/${KANTONSRAT}/${ABSTIMMUNG}`, { status: 302 })

    try {
        const feedRaw = await fetch(`${RATSINFO + RATSINFO_FRAGMENT_VOTINGS}?${optionalKeywordParam}&page=${page}&page_size=${ENTRIES_SHOWN_IN_RATSINFO}`)
        const feed: APIRatsinfoVotings = await feedRaw.json()
        if (feed) {
            return json({ ...feed, keywordSearchParam }, {
                headers: {
                    "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
                }
            })
        } else {
            return null
        }
    } catch (err) {
        return json(null, { status: 404 })
    }
}


export default function KantonsratAbstimmungenFeed() {
    const loaderData = useLoaderData<typeof loader>()
    return (
        <>
            {loaderData?.results ? <VotingFeed feed={loaderData.results} count={loaderData.count} /> : <NoResponse />}
        </>
    )
}