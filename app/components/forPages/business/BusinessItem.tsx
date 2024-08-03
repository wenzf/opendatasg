/* eslint-disable jsx-a11y/media-has-caption */
import { Link, NavLink } from "@remix-run/react";
import { PUBLIC_CONFIG } from "~/config";
import { ratsinfo_business_types, ratsinfo_topics } from "~/resources/api_statics/ratsInfo_api_statics";
import texts from "~/texts";
// import { APIRatsinfoBusinessesExtended } from "~/types";
import { APIRatsinfoBusinessFull } from "~/types/ratsinfoAPI";
import { getLabelById } from "~/utils/misc";
import { formatDateShort } from "~/utils/time";


export default function BusinessItem({ item }: { item: APIRatsinfoBusinessFull }) {
    const { labels: {
        geschaeft: { federfuehrung, geschaeft_uebersicht, dokumente, publiziert, datei,
            beteiligungen, abstimmungen, sitzungs_titel, abstimmungs_gegenstand,
            geschaefts_titel, abstimmungs_ergebnisse },
        generics: { thema, wortlaut, statements, session, person, gremium,
            akteur, yes, no, vertraulich, oeffentlich, dringend, datum, geschaeft,
            eroeffnung, abschluss, komitee, nummer, title, typ, art, letzte_aenderung }
    } } = texts;

    const { RATSINFO_ROOT, ROUTE_FRAGMENTS: {
        ABSTIMMUNG, KANTONSRAT, GREMIEN, PERSONEN } } = PUBLIC_CONFIG

    return (
        <main className="a_main sp">
            <h1 className="a_h1">{geschaeft}: {item?.title}</h1>

            <section className="a_sec">
                <div className="a_sub_sec">
                    <table className="t_1">
                        <caption>
                            <span>
                                {geschaeft_uebersicht}
                            </span>
                        </caption>
                        <tbody>
                            <tr>
                                <th>{komitee}</th>
                                <td>{item.groups['g_' + item?.committee_id]?.title}</td>
                            </tr>
                            <tr>
                                <th>{nummer}</th>
                                <td>{item.number}</td>
                            </tr>
                            <tr>
                                <th>{title}</th>
                                <td>{item?.title}</td>
                            </tr>
                            <tr>
                                <th>{art}</th>
                                <td>{getLabelById(ratsinfo_business_types, item?.type_id)}</td>
                            </tr>
                            <tr>
                                <th>{thema}</th>
                                <td>{getLabelById(ratsinfo_topics, item.topic_id)}</td>
                            </tr>
                            <tr>
                                <th>{federfuehrung}</th>
                                <td>{item.groups['g_' + item?.responsible_id].title}</td>
                            </tr>
                            <tr>
                                <th>{eroeffnung}</th>
                                <td>{formatDateShort(item.begin_date)}</td>
                            </tr>
                            <tr>
                                <th>{abschluss}</th>
                                <td>{item?.end_date ? formatDateShort(item.end_date) : 'pendent'}</td>
                            </tr>
                            <tr>
                                <th>{letzte_aenderung}</th>
                                <td>{formatDateShort(item?.touched)}</td>
                            </tr>

                            <tr>
                                <th>{vertraulich}</th>
                                <td>{item.is_confidential ? yes : no}</td>
                            </tr>
                            <tr>
                                <th>{oeffentlich}</th>
                                <td>{item?.is_public ? yes : no}</td>
                            </tr>
                            <tr>
                                <th>{dringend}</th>
                                <td>{item.is_urgent ? yes : no}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {item.dokumente?.length ? (
                    <div className="a_sub_sec">
                        <table className="t_1 la">
                            <caption>{dokumente}</caption>
                            <thead>
                                <tr>
                                    <th>{publiziert}</th>
                                    <th>{typ}</th>
                                    <th>{title}</th>
                                    <th>{datei}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.dokumente.map((it, ind) => (
                                    <tr key={ind}>
                                        <td>{formatDateShort(it.published_date)}</td>
                                        <td>{it.document_type_name}</td>
                                        <td>{it.title}</td>
                                        <td><Link target="_blank" rel="noopener noreferrer" to={RATSINFO_ROOT + it.file}>{it.file.endsWith('.pdf') ? 'PDF' : datei}</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </section>

            {item.beteiligungen?.length ? (
                <section className="a_sec">
                    <div className="a_sub_sec">
                        <table className="t_1" width="100%">
                            <caption>{beteiligungen}</caption>
                            <thead>
                                <tr>
                                    <th>{datum}</th>
                                    <th>{akteur}</th>
                                    <th>{title}</th>
                                    <th>{letzte_aenderung}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.beteiligungen.map((it, ind) => (
                                    <tr key={ind}>
                                        <td>{formatDateShort(it.created)}</td>
                                        <td>
                                            {it.content_type === "group" ? gremium : null}
                                            {it.content_type === "person" ? person : null}
                                        </td>
                                        <td>
                                            {it.content_type === "group" ? (
                                                <NavLink to={`/${KANTONSRAT}/${GREMIEN}/id/${it.target_id}`}>
                                                    {it.title}
                                                </NavLink>
                                            ) : null}

                                            {it.content_type === "person" ? (
                                                <NavLink to={`/${KANTONSRAT}/${PERSONEN}/id/${it.target_id}`}>
                                                    {it.title}
                                                </NavLink>
                                            ) : null}
                                        </td>
                                        <td>{formatDateShort(it.modified)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}

            {item.abstimmungen?.length ? (
                <section className="a_sec">
                    <div className="a_sub_sec">
                        <table className="t_1">
                            <caption>{abstimmungen}</caption>
                            <thead>
                                <tr>
                                    <th>{datum}</th>
                                    <th>{abstimmungs_gegenstand}</th>
                                    <th>{sitzungs_titel}</th>
                                    <th>{geschaefts_titel}</th>
                                    <th>{abstimmungs_ergebnisse}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.abstimmungen.map((it, ind) => (
                                    <tr key={ind}>
                                        <td>{formatDateShort(it.abstimmungsdatum)}</td>
                                        <td>{it.abstimmungsgegenstand}</td>
                                        <td>{it.sitzungstitel}</td>
                                        <td>{it.geschaftstitel}</td>
                                        <th><NavLink to={`/${KANTONSRAT}/${ABSTIMMUNG}/id/${it.abstimmungs_id}`}>{abstimmungs_ergebnisse}</NavLink></th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}

            {item?.statements?.length ? (
                <section className="a_sec">
                    <div className="a_sub_sec">
                        <table className="t_1" width="100%">
                            <caption>{statements}</caption>
                            <thead className="t_sticky_header">
                                <tr>
                                    <th>{datum}</th>
                                    <th>{typ}</th>
                                    <th style={{ minWidth: '22rem' }}>{wortlaut}</th>
                                    <th>{session}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.statements.map((it, ind) => (
                                    <tr key={ind}>
                                        <td style={{ position: 'sticky', top: '2rem', backgroundColor: 'var(--gray-2)' }}>{formatDateShort(it.stated_at)}</td>
                                        <td style={{ position: 'sticky', top: '2rem', backgroundColor: 'var(--gray-2)', fontSize: '1.125rem' }}>
                                            {it.type_display}
                                        </td>
                                        <td >
                                            <div style={{ maxWidth: '85vw' }} className="td_any" dangerouslySetInnerHTML={{ __html: it.text }} />
                                            {it.audio_file ? (
                                                <div className="audio_fr">
                                                    <audio controls>
                                                        <source src={it.audio_file} type="audio/mpeg" />
                                                        Ihr Browser unterstütz das Abspielen von Audiodateien nicht.
                                                        <Link to={it.audio_file}>Audiodatei</Link>
                                                    </audio>
                                                </div>

                                            ) : null}
                                        </td>
                                        <td>{it.meeting.title}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            ) : null}

        </main>
    )
}