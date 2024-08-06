/* eslint-disable jsx-a11y/media-has-caption */
import { Link, NavLink } from "@remix-run/react";
import { PUBLIC_CONFIG } from "~/config";
import { ratsinfo_business_types, ratsinfo_topics } from "~/resources/api_statics/ratsInfo_api_statics";
import CheckIconSVG from "~/resources/icons/CheckIconSVG";
import Cross2IconSVG from "~/resources/icons/Cross2IconSVG";
import texts from "~/texts";
import { APIRatsinfoBusinessFull } from "~/types/ratsinfoAPI";
import { getLabelById } from "~/utils/misc";
import { formatDateShort } from "~/utils/time";


export default function BusinessItem({ item }: { item: APIRatsinfoBusinessFull }) {
    const { labels: {
        geschaeft: { federfuehrung, geschaeft_uebersicht, dokumente, publiziert, datei,
            beteiligungen, abstimmungen,
        },
        generics: { thema, wortlaut, statements, session, person, gremium,
            akteur, yes, no, vertraulich, oeffentlich, dringend, datum, geschaeft,
            eroeffnung, abschluss, komitee, nummer, title, typ, art, letzte_aenderung },
        abstimmung: { absent_enthaltung }
    } } = texts;

    const { RATSINFO_ROOT, ROUTE_FRAGMENTS: {
        ABSTIMMUNG, KANTONSRAT, GREMIEN, PERSONEN } } = PUBLIC_CONFIG

    return (
        <main className="a_main sp" itemScope itemType="https://schema.org/Legislation">
            <h1 className="a_h1" itemProp="headline">{geschaeft}: {item?.title}</h1>

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
                                <td itemProp="maintainer" itemScope itemType="https://schema.org/GovernmentOrganization">
                                    <span itemProp="name">
                                        {item.groups['g_' + item?.committee_id]?.title}
                                    </span>

                                </td>
                            </tr>
                            <tr>
                                <th>{nummer}</th>
                                <td itemProp="legislationIdentifier">{item.number}</td>
                            </tr>
                            <tr>
                                <th>{title}</th>
                                <td itemProp="name">{item?.title}</td>
                            </tr>
                            <tr>
                                <th>{art}</th>
                                <td itemProp="legislationType">{getLabelById(ratsinfo_business_types, item?.type_id)}</td>
                            </tr>
                            <tr>
                                <th>{thema}</th>
                                <td itemProp="about">{getLabelById(ratsinfo_topics, item.topic_id)}</td>
                            </tr>
                            <tr>
                                <th>{federfuehrung}</th>
                                <td itemProp="legislationResponsible" itemScope itemType="https://schema.org/GovernmentOrganization">
                                    <span itemProp="name">
                                        {item.groups['g_' + item?.responsible_id].title}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th>{eroeffnung}</th>
                                <td itemProp="dateCreated" content={item.begin_date}>{formatDateShort(item.begin_date)}</td>
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
                                    <tr key={ind} itemProp="hasPart" itemScope itemType="https://schema.org/DigitalDocument">
                                        <td itemProp="datePublished" content={it.published_date} >{formatDateShort(it.published_date)}</td>
                                        <td itemProp="description">{it.document_type_name}</td>
                                        <td itemProp="name">{it.title}</td>
                                        <td><Link itemProp="url" target="_blank" rel="noopener noreferrer" to={RATSINFO_ROOT + it.file}>{it.file.endsWith('.pdf') ? 'PDF' : datei}
                                        </Link>
                                            <meta itemProp="digitalSourcetype" itemType="https://schema.org/PrintDigitalSource" />
                                        </td>
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
                        <table className="t_1 la" width="100%">
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

                                        {it.content_type === "group" ? (
                                            <td itemProp="contributor" itemScope itemType="https://schema.org/Organization">
                                                <NavLink itemProp="url" to={`/${KANTONSRAT}/${GREMIEN}/id/${it.target_id}`}>
                                                    <span itemProp="name">
                                                        {it.title}
                                                    </span>

                                                </NavLink>
                                            </td>
                                        ) : null}

                                        {it.content_type === "person" ? (
                                            <td itemProp="contributor" itemScope itemType="https://schema.org/Person">
                                                <NavLink itemProp="url" to={`/${KANTONSRAT}/${PERSONEN}/id/${it.target_id}`}>
                                                    <span itemProp="name">
                                                        {it.title}
                                                    </span>

                                                </NavLink>
                                            </td>
                                        ) : null}

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
                        <table className="t_1 la" width="100%">
                            <caption>{abstimmungen}</caption>
                            <thead>
                                <tr>
                                    <th rowSpan={2}>{datum}</th>
                                    <th rowSpan={2}>{title}</th>
                                    <th colSpan={5}>Resultat</th>
                                    <th rowSpan={2}>{oeffentlich}</th>
                                </tr>
                                <tr>
                                    <th>{yes}</th>
                                    <th>Bedeutung</th>
                                    <th>{no}</th>
                                    <th>Bedeutung</th>
                                    <th>{absent_enthaltung}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.abstimmungen.map((it, ind) => (
                                    <tr key={ind}>
                                        <td>{formatDateShort(it.date)}</td>
                                        <td>
                                            <NavLink to={`/${KANTONSRAT}/${ABSTIMMUNG}/id/${it.id}`}>
                                                {it.title}
                                            </NavLink>
                                        </td>
                                        <td>{it.results.yes}</td>
                                        <td>{it.meaning_of_yes}</td>
                                        <td>{it.results.no}</td>
                                        <td>{it.meaning_of_no}</td>
                                        <td>{it.results.absent + it.results.abstention}</td>
                                        <td>{it.is_public ? <CheckIconSVG width={24} height={24} aria-label="ja" /> : <Cross2IconSVG width={24} height={24} aria-label="nein" />}</td>
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
                        <table className="t_1 la" width="100%">
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
                                    <tr key={ind} itemProp="hasPart" itemScope itemType="https://schema.org/Statement">
                                        <td className="td_sticky_1"> {formatDateShort(it.stated_at)}</td>
                                        <td
                                            itemProp="description"
                                            style={{ fontSize: '1.125rem' }}
                                            className="td_sticky_1"
                                        >
                                            {it.type_display}
                                            <span>
                                                <meta itemProp="contentReferenceTime" content={it.stated_at} />
                                            </span>
                                        </td>
                                        <td>
                                            <div
                                                itemProp="text"
                                                style={{ maxWidth: '85vw' }}
                                                className="td_any"
                                                dangerouslySetInnerHTML={{ __html: it.text }}
                                            />
                                            {it.audio_file ? (
                                                <div className="audio_fr" itemProp="audio" itemScope itemType="https://schema.org/AudioObject">
                                                    <meta itemProp="contentUrl" content={it.audio_file} />
                                                    <meta itemProp="encodingFormat" content="audio/mpeg" />
                                                    <meta itemProp="isAccessibleForFree" content="true" />
                                                    <audio controls preload="none">
                                                        <source src={it.audio_file} type="audio/mpeg" />
                                                        Ihr Browser unterstützt das Abspielen von Audiodateien nicht.
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