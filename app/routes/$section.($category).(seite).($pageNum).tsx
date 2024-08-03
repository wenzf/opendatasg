import { LoaderFunction, MetaFunction, json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import { isbot } from "isbot";
import { Masonry } from "react-plock";
import FeedItem from "~/components/forPages/media/FeedItem";
import PaginationComp from "~/components/generics/PaginationComp";
import { PUBLIC_CONFIG } from "~/config";
import { contentTypesAndItemsPerRequestByParams } from "~/utils/serverOnly/forLoader/forLoaderUtils.server";
import { handleDataFeedRequest } from "~/utils/serverOnly/forLoader/handleDataFeedRequest.server";
import { prettyFeed } from "~/utils/forContent";
import { textAndMetasForFeedRoutesByParams } from "~/utils/forMetasAndTitles";
import { removeTrailingSlash } from "~/utils/misc";


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.FEED
}


export const meta: MetaFunction = ({ params, location }) => {
    const { DOMAIN_NAME, DEFAULT_OG_IMAGE } = PUBLIC_CONFIG
    const { title, metaDescription } = textAndMetasForFeedRoutesByParams(params)
    const { pathname } = location
    return [
        { title },
        { name: "description", content: metaDescription },
        {
            tagName: "link",
            rel: "canonical",
            href: DOMAIN_NAME + removeTrailingSlash(pathname),
        },
        {
            property: "og:image",
            content: DEFAULT_OG_IMAGE()
        }
    ]
}


export const loader: LoaderFunction = async ({ params, request }) => {
    const { ENTRIES_SHOWN_IN_FEED } = PUBLIC_CONFIG
    const { pageNum } = params
    const ua = request.headers.get('user-agent')
    const isBot = isbot(ua)
    const contentTypesAndItemsPerRequest = contentTypesAndItemsPerRequestByParams(params)
    const { requestedContentTypes, itemsPerRequest } = contentTypesAndItemsPerRequest
    const offset = parseInt(pageNum ?? '0') * ENTRIES_SHOWN_IN_FEED
    const res = await handleDataFeedRequest({
        requestedContentTypes,
        itemsPerRequest,
        offset
    })
    return json({ ...res, isBot })
}


export default function SectionRoute() {
    const { MASONRY_CONFIG } = PUBLIC_CONFIG
    const params = useParams()
    const loaderData = useLoaderData<typeof loader>()
    const feed = prettyFeed(loaderData?.feed)
    const isBot = loaderData?.isBot
    const { h1 } = textAndMetasForFeedRoutesByParams(params)

    return (
        <main className={`page_feed${isBot ? ' forbot' : ''}`}>
            <div className="title_frame">
                <h1 className="a_h1 sp">{h1}</h1>
            </div>

            {isBot ? (
                <>
                    {feed ? feed.map((it) => (
                        <FeedItem
                            position={111}
                            key={it.canonical}
                            contentItem={it}
                            showCatLink={true}
                        />
                    )) : null}
                </>
            ) : (
                <Masonry
                    className="masonry"
                    items={feed}
                    render={(it) => (
                        <FeedItem
                            position={111}
                            key={it.canonical}
                            contentItem={it}
                            showCatLink={true}
                        />
                    )}
                    config={MASONRY_CONFIG}
                />
            )}

            <PaginationComp idx={loaderData.idx} params={params} />
        </main>
    )
}