import { NavLink, useParams, useSearchParams } from "@remix-run/react";
import PaginationComp2 from "~/components/generics/PaginationComp2";
import { PUBLIC_CONFIG } from "~/config";
import CheckIconSVG from "~/resources/icons/CheckIconSVG";
import texts from "~/texts";
import { APIRatsinfoVotingsResult } from "~/types/ratsinfoAPI";

import { metasAndTitlesForRatsinfoFeedRoutes } from "~/utils/forMetasAndTitles";
import { formatDateShort } from "~/utils/time";


export default function VotingFeed({ feed, count }: { count: number, feed: APIRatsinfoVotingsResult[] }) {
    const { ROUTE_FRAGMENTS: { KANTONSRAT, ABSTIMMUNG } } = PUBLIC_CONFIG
    const { metasAndTitles: { kantonsrat_abstimmungen_feed, kantonsrat_abstimmungen_feed_search } } = texts
    const params = useParams()
    const [searchParams] = useSearchParams()
    const keywordSearchParam = searchParams.get('search')
    const { h1 } = metasAndTitlesForRatsinfoFeedRoutes(
        params.pageNum,
        { keywordSearchParam },
        kantonsrat_abstimmungen_feed,
        kantonsrat_abstimmungen_feed_search
    )

    const { labels: { generics: { oeffentlich, geschaeft, stizung, abstimmung, datum, session, nummer, title, typ } }, } = texts

    return (
        <main className="a_main sp">
            <h1 className="a_h1">{h1}</h1>

            <section className="a_sec">
                <div className="a_sub_sec">
                    <table className="t_1 la" width="100%">
                        <thead className="t_sticky_header">
                            <tr>
                                <th colSpan={3}>{abstimmung}</th>
                                <th colSpan={2}>{stizung}</th>
                                <th colSpan={3}>{geschaeft}</th>
                            </tr>
                            <tr>
                                <th>{datum}</th>
                                <th>{title}</th>
                                <th>{oeffentlich}</th>
                                <th>{session}</th>
                                <th>{title}</th>
                                <th>{nummer}</th>
                                <th>{title}</th>
                                <th>{typ}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feed.map((it) => (
                                <tr key={it.id}>
                                    <td>{formatDateShort(it.date)}</td>
                                    <td>
                                        <NavLink to={`/${KANTONSRAT}/${ABSTIMMUNG}/id/${it.id}`}>
                                            {it.title}
                                        </NavLink>
                                    </td>
                                    <td>{it.is_public ? <CheckIconSVG aria-label="Ja" /> : ''}</td>
                                    <td>{it.agenda_item.meeting.additional_title}</td>
                                    <td>{it.agenda_item.meeting.title}</td>
                                    <td>{it.agenda_item.business.number}</td>
                                    <td>{it.agenda_item.business.title}</td>
                                    <td>{it.agenda_item.business.type.title}</td>
                                </tr>
                            ))}
                            {!feed.length ? (<tr><td className="no_res" colSpan={8}>Keine Ergebnisse</td></tr>) : null}
                        </tbody>
                    </table>
                </div>
            </section>

            <PaginationComp2
                pageRootPath={`/${KANTONSRAT}/${ABSTIMMUNG}`}
                params={params}
                count={count}
            />

        </main>
    )
}