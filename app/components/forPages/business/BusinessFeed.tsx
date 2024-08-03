import { useParams, useSearchParams } from "@remix-run/react";
import { PUBLIC_CONFIG } from "~/config";
import { APIRatsinfoBusinessBase } from "~/types/ratsinfoAPI";
import PaginationComp2 from "~/components/generics/PaginationComp2";
import BusinessBaseTable from "./BusinessBaseTable";
import { metasAndTitlesForRatsinfoFeedRoutes } from "~/utils/forMetasAndTitles";
import texts from "~/texts";


export default function BusinessFeed({ feed, count }: {
    feed: APIRatsinfoBusinessBase[]
    count: number
}) {
    const params = useParams()
    const [searchParams] = useSearchParams()
    const keywordSearchParam = searchParams.get('search')
    const { ROUTE_FRAGMENTS: { KANTONSRAT, GESCHAEFT } } = PUBLIC_CONFIG
    const { metasAndTitles: { kantonsrat_geschaefte_feed, kantonsrat_abstimmungen_feed_search } } = texts

    const { h1 } = metasAndTitlesForRatsinfoFeedRoutes(
        params.pageNum,
        { keywordSearchParam },
        kantonsrat_geschaefte_feed,
        kantonsrat_abstimmungen_feed_search
    )

    return (
        <main className="a_main sp">
            <h1 className="a_h1">{h1}</h1>
            <section className="a_sec">
                <div className="a_sub_sec">
                    <BusinessBaseTable feed={feed}
                    />
                </div>
            </section>
            <PaginationComp2
                pageRootPath={`/${KANTONSRAT}/${GESCHAEFT}`}
                params={params}
                count={count}
            />
        </main>
    )
}