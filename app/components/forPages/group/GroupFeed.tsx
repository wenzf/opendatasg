import { NavLink, useParams, useSearchParams } from "@remix-run/react";
import { APIRatsinfoGroupBase } from "~/types/ratsinfoAPI";

import { PUBLIC_CONFIG } from "~/config";
import PaginationComp2 from "~/components/generics/PaginationComp2";
import texts from "~/texts";
import { metasAndTitlesForRatsinfoFeedRoutes } from "~/utils/forMetasAndTitles";
import CheckIconSVG from "~/resources/icons/CheckIconSVG";



export default function GroupFeed({ feed, count }: { feed: APIRatsinfoGroupBase[], count: number }) {
    const params = useParams()
    const [searchParams] = useSearchParams()
    const keywordSearchParam = searchParams.get('search')
    const { metasAndTitles: { kantonsrat_gremien_feed, kantonsrat_gremien_feed_search }, labels: { generics: {
        name, typ, aktiv
    } } } = texts
    const { ROUTE_FRAGMENTS: { KANTONSRAT, GREMIEN } } = PUBLIC_CONFIG
    const { h1 } = metasAndTitlesForRatsinfoFeedRoutes(
        params.pageNum,
        { keywordSearchParam },
        kantonsrat_gremien_feed,
        kantonsrat_gremien_feed_search
    )

    return (
        <main className="a_main sp">
            <h1 className="a_h1">{h1}</h1>
            <section className="a_sec">
                <div className="a_sub_sec">
                    <table className="t_1 la" width="100%">
                        <thead className="t_sticky_header">
                            <tr>
                                <th>{name}</th>
                                <th>{typ}</th>
                                <th>{aktiv}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feed.map((it) => (
                                <tr key={it.id}>
                                    <td>
                                        <NavLink to={`/${KANTONSRAT}/${GREMIEN}/id/${it.id}`}>
                                            {it.title}
                                        </NavLink>
                                    </td>
                                    <td>{it.type.title}</td>
                                    <td>{it.is_active ? <CheckIconSVG aria-label="Ja" /> : ''}</td>
                                </tr>
                            ))}
                            {!feed.length ? (<tr><td className="no_res" colSpan={3}>Keine Ergebnisse</td></tr>) : null}
                        </tbody>
                    </table>
                </div>
            </section>

            <PaginationComp2
                pageRootPath={`/${KANTONSRAT}/${GREMIEN}`}
                params={params}
                count={count}
            />

        </main>
    )
}