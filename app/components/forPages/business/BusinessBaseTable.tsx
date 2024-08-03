import { NavLink } from "@remix-run/react";
import { PUBLIC_CONFIG } from "~/config";
import { ratsinfo_business_types } from "~/resources/api_statics/ratsInfo_api_statics";
import CheckIconSVG from "~/resources/icons/CheckIconSVG";
import texts from "~/texts";
import { APIRatsinfoBusinessBase } from "~/types/ratsinfoAPI";
import { getLabelById } from "~/utils/misc";
import { formatDateShort } from "~/utils/time";

export default function BusinessBaseTable({
    feed,
    caption
}: {
    feed: APIRatsinfoBusinessBase[]
    caption?: string

}) {
    const { labels: { generics: { vertraulich, dringend, art, nummer, title, eroeffnung, abschluss } } } = texts;
    const { ROUTE_FRAGMENTS: { KANTONSRAT, GESCHAEFT } } = PUBLIC_CONFIG

    return (
        <table className="t_1 la" width="100%">
            {caption ? <caption>
                <span>
                    {caption}
                </span>
            </caption> : null}
            <thead className="t_sticky_header">
                <tr>
                    <th>{eroeffnung}</th>
                    <th>{title}</th>
                    <th>{art}</th>
                    <th>{nummer}</th>
                    <th>{vertraulich}</th>
                    <th>{dringend}</th>
                    <th>{abschluss}</th>
                </tr>
            </thead>
            <tbody>
                {feed.map((it) => (
                    <tr key={it.id}>
                        <td>{formatDateShort(it.begin_date)}</td>
                        <td>
                            <NavLink to={`/${KANTONSRAT}/${GESCHAEFT}/id/${it.id}`}>
                                {it.title}
                            </NavLink>
                        </td>
                        <td>{getLabelById(ratsinfo_business_types, it.type_id)}</td>
                        <td>{it.number}</td>
                        <td>{it.is_confidential ? <CheckIconSVG aria-label="Ja" /> : ''}</td>
                        <td>{it.is_urgent ? <CheckIconSVG aria-label="Ja" /> : ''}</td>
                        <td>{it.end_date ? formatDateShort(it.end_date) : ''}</td>
                    </tr>
                ))}
                {!feed.length ? (<tr><td className="no_res" colSpan={7}>Keine Ergebnisse</td></tr>) : null}
            </tbody>
        </table>
    )
}