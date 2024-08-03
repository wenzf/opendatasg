import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { isbot } from "isbot";
import { Masonry } from "react-plock";
import FeedItem from "~/components/forPages/media/FeedItem";

import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config";
import { handleDataFeedRequest } from "~/utils/serverOnly/forLoader/handleDataFeedRequest.server";
import texts from "~/texts";
import { ContentCategoryKeys } from "~/types";
import { prettyFeed } from "~/utils/forContent";

const {
  PAGE_HANDLES: { HOME }, DOMAIN_NAME, DEFAULT_OG_IMAGE, MASONRY_CONFIG,
  ENTRIES_SHOWN_IN_FEED
} = PUBLIC_CONFIG


export const handle = {
  page: HOME
}


export const loader: LoaderFunction = async ({ request}) => {
  const ua = request.headers.get('user-agent')
  const { KTME, KTVE, STME, STPO } = NS_CONTENT_CATEGORY
  const requestedContentTypes: ContentCategoryKeys[] = [KTME, KTVE, STME, STPO]
  const isBot = isbot(ua)

  const res = await handleDataFeedRequest({
    requestedContentTypes,
    offset: 0,
    itemsPerRequest: ENTRIES_SHOWN_IN_FEED

  })


  return json({ ...res, isBot })
}


export const meta: MetaFunction = () => {
  const { metasAndTitles: { home: { metaDescription, title } } } = texts
  return [
    { title },
    { name: "description", content: metaDescription },
    {
      tagName: "link",
      rel: "canonical",
      href: DOMAIN_NAME,
    },
    {
      property: "og:image",
      content: DEFAULT_OG_IMAGE()
    }
  ];
};


export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  const feed = prettyFeed(loaderData?.feed)
  const isBot = loaderData?.isBot
 // console.log(loaderData?.idx, loaderData?.feed)
  const { metasAndTitles: { home: { h1 } } } = texts

  /**
   * CONDITIONAL RENDERING OF CRAWLERS AND HUMANS
   * REQUESTS ON ALL FEED ROUTES
   * 
   * react-plock/Masonry is used to show the article
   * preview snippets in masonry style. The markup is rendered
   * client-side to take window size into account. As a result,
   * the HTML markup is not server side rendered and therefor
   * harder for crawlers to read.
   * 
   * In order to deal with this, the client type (bot/human) is
   * detected in the loader and passed down to the client.
   * For request of crawlers a view is shown that doesn't use
   * react-plock, for human visitors the masonry style is shown.
   * See lines 86 - 111.
   */

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

    </main>
  );
}
