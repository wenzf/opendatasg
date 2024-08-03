
import { NavLink } from "@remix-run/react";
import { PUBLIC_CONFIG } from "~/config";
import CheckIconSVG from "~/resources/icons/CheckIconSVG";
import texts from "~/texts";
import { APIRatsinfoPeopleBase } from "~/types/ratsinfoAPI";

export default function PeopleBaseTable({ feed, caption, includeSchemaMember }: {
    feed: APIRatsinfoPeopleBase[]
    caption?: string
    includeSchemaMember?: boolean
}) {
    const { ROUTE_FRAGMENTS: { KANTONSRAT, PERSONEN } } = PUBLIC_CONFIG
    const { labels: { generics: { name, aktiv, beruf, partei } } } = texts
    const optionalMemberProps = includeSchemaMember ? { itemProp: 'member' } : {}

    return (
        <table className="t_1 la" width="100%">
            {caption ? (<caption><span>{caption}</span></caption>) : null}
            <thead className="t_sticky_header">
                <tr>
                    <th>{name}</th>
                    <th>{partei}</th>
                    <th>{beruf}</th>
                    <th>{aktiv}</th>
                </tr>
            </thead>
            <tbody>
                {feed.map((it) => (
                    <tr key={it.uid} {...optionalMemberProps} itemScope itemType="https://schema.org/Person">
                        <td>
                            <NavLink to={`/${KANTONSRAT}/${PERSONEN}/id/${it.id}`}>
                                <span itemProp="name">
                                    {it?.full_name}
                                </span>

                            </NavLink>
                        </td>
                        <td itemProp="memberOf" itemScope itemType="https://schema.org/PoliticalParty">
                            <span itemProp="name">{it?.party}</span>
                        </td>
                        <td itemProp="jobTitle">{it?.profession}</td>
                        <td>{it?.is_active ? <CheckIconSVG aria-label="Ja" /> : ''}</td>
                    </tr>
                ))}
                {!feed.length ? (<tr><td className="no_res" colSpan={4}>Keine Ergebnisse</td></tr>) : null}
            </tbody>
        </table>
    )
}