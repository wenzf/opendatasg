import { useParams, useSearchParams } from "@remix-run/react";
import { APIRatsinfoPeopleBase } from "~/types/ratsinfoAPI";
import { PUBLIC_CONFIG } from "~/config";
import PaginationComp2 from "~/components/generics/PaginationComp2";
import PeopleBaseTable from "./PeopleBaseTable";
import texts from "~/texts";
import { metasAndTitlesForRatsinfoFeedRoutes } from "~/utils/forMetasAndTitles";


export default function PeopleFeed({ feed, count }: { feed: APIRatsinfoPeopleBase[], count: number }) {

    const params = useParams()
    const [searchParams] = useSearchParams()

    const keywordSearchParam = searchParams.get('search')
    const { ROUTE_FRAGMENTS: { KANTONSRAT, PERSONEN } } = PUBLIC_CONFIG
    const { metasAndTitles: { kantonsrat_personen_feed_search, kantonsrat_personen_feed } } = texts

    const { h1 } = metasAndTitlesForRatsinfoFeedRoutes(
        params.pageNum,
        { keywordSearchParam },
        kantonsrat_personen_feed,
        kantonsrat_personen_feed_search
    )

    return (
        <main className="a_main sp">
            <h1 className="a_h1">{h1}</h1>
            <section className="a_sec">
                <div className="a_sub_sec">
                    <PeopleBaseTable feed={feed} />
                </div>
            </section>
            <PaginationComp2
                pageRootPath={`/${KANTONSRAT}/${PERSONEN}`}
                params={params}
                count={count}
            />
        </main>
    )
}