import { useState, Suspense, lazy, useEffect, useMemo } from "react";
import * as RadioGroup from '@radix-ui/react-radio-group';
import texts from "~/texts";

import { sorterBallots } from "~/utils/forData";
import MapDistricts from "./MapDistricts";
import ChevronUpIconSVG from "~/resources/icons/ChevronUpIcon";
import ChevronDownIconSVG from "~/resources/icons/ChevronDownIcongSVG";
import { formatDateShort } from "~/utils/time";
import { NavLink } from "@remix-run/react";
import { PUBLIC_CONFIG } from "~/config";
import SelectPrimitive from "~/components/generics/SelectPrimitive";
import { APIRatsinfoVotingFull, BallotModified } from "~/types/ratsinfoAPI";


const Donut = lazy(() => import('../../generics/ChartHalfDonat'))
const StackedBarChart = lazy(() => import('../../generics/StackedBarChart'))


const { labels: {
    abstimmung: {
        zusammenfassung, datum, created_bearbeitet, ergebnis, absent,
        abstention, geschaeft_start_date, geschaeft_end_date, oeffentlich,
        geschaeft_number, bedeutung, absent_enthaltung, vote,
        person_election_district_title, einzelstimmen },
    generics: { title, yes, no, geschaeft, pendent, partei, absolut,
        relativ, wahlkreis, total, anzahl, anteil, gemeinde, name }
} } = texts

const { ROUTE_FRAGMENTS: { KANTONSRAT, GESCHAEFT, PERSONEN } } = PUBLIC_CONFIG


type ItemFilter = {
    vote_display: string[],
    person_party: string[],
    person_election_district_title: string[],
    sub_district: string[],

}


export default function VotingItem({
    item, frequencies, forMap, modifiedBallots
}: {
    item: APIRatsinfoVotingFull,
    frequencies: Record<string, {
        val: string,
        count: number,
        yes: number,
        no: number,
        absent: number,
        abstention: number
    }[]>
    forMap: {
        districts: Record<string, { color: string, percentage: number }>
    }
    modifiedBallots: BallotModified[]
}) {
    const [sortProp, setSortProp] = useState<keyof BallotModified>('person_political_name')
    const [sortDirectionAsc, setSortDirectionAsc] = useState(true)
    const [donat1ShowMode, setDonat1ShowMode] = useState<"absolute" | "relative">('relative');

    const [itemFilter, setItemFilter] = useState<ItemFilter>({
        vote_display: [],
        person_party: [],
        person_election_district_title: [],
        sub_district: [],
    })

    const [isClient, setIsClient] = useState(false)


    useEffect(() => {
        setIsClient(true)
    }, [])

    const SortInput = ({ prop, row }: { prop: keyof BallotModified, row?: number }) => (
        <th style={{ whiteSpace: 'nowrap', alignContent: 'baseline' }} rowSpan={row ? row : 1}>
            <button style={{ marginRight: '1rem' }} type="button" className="btn3" onClick={() => {
                setSortProp(prop)
                setSortDirectionAsc(true)
            }}>
                <ChevronUpIconSVG aria-label="aufsteigend" />
            </button>
            <button className="btn3" type="button" onClick={() => {
                setSortProp(prop)
                setSortDirectionAsc(false)
            }}>
                <ChevronDownIconSVG aria-label="absteigend" />
            </button>
        </th>
    )


    const FilterInput = ({ prop, label }: { prop: keyof ItemFilter, label: string }) => (
        <th style={{ alignContent: 'baseline' }}>
            <SelectPrimitive
                selectlabel={label}
                options={frequencies[prop].map((it) => ({ label: `${it.val} (${it.count})`, value: it.val })).filter((itt) => !itemFilter[prop].includes(itt.value))}
                setter={(e) => {
                    setItemFilter((prev) => {
                        const copy = prev[prop]
                        let newOut = []
                        if (copy.includes(e)) {
                            newOut = copy.filter((ii: string) => ii !== e)
                        } else {
                            copy.push(e)
                            newOut = copy
                        }
                        return { ...prev, [prop]: newOut }
                    })
                }}
            />
            <div className="filter_choice">
                {itemFilter[prop].map((it) => (
                    <button key={it} type="button" onClick={() => setItemFilter((prev) => ({ ...prev, [prop]: prev[prop].filter((xx) => xx !== it) }))}>
                        {it}
                    </button>
                ))}
            </div>
        </th>
    )


    const ballotsMemo = useMemo(() => {
        let items = modifiedBallots as BallotModified[]
        if (!isClient) return { items }
        const appliedFilters = Object.entries(itemFilter)
        for (let i = 0; i < appliedFilters.length; i += 1) {
            const filterKey = appliedFilters[i][0]
            const fitlerVals = appliedFilters[i][1]

            if (fitlerVals.length) {
                items = items.filter((it) => fitlerVals.includes(it[filterKey as keyof ItemFilter]))
            }
        }
        items.sort(sorterBallots(sortProp, sortDirectionAsc))
        return { items }
    }, [modifiedBallots, sortProp, sortDirectionAsc, itemFilter, isClient])

    const ballots = ballotsMemo


    return (
        <main className="a_main sp" itemScope itemType="https://schema.org/Event">
            <h1 className="a_h1" itemProp="name">{item.title}: {item.business.title}</h1>

            <section className="a_sec">
                <div className="a_sub_sec">
                    <table width="100%" className="t_1">
                        <caption>{zusammenfassung}</caption>
                        <tbody>
                            <tr>
                                <th>{title}</th>
                                <td>{item.title}</td>
                            </tr>
                            <tr>
                                <th>{datum}</th>
                                <td itemProp="startDate" content={item.date}>{formatDateShort(item.date)}</td>
                            </tr>
                            <tr>
                                <th>{created_bearbeitet}</th>
                                <td>{formatDateShort(item.created)}</td>
                            </tr>
                            <tr itemProp="potentialAction" itemScope itemType="https://schema.org/VoteAction">
                                <th>{bedeutung} <em>{'\''}{yes}{'\''}</em></th>
                                <td itemProp="name">
                                    {item.meaning_of_yes}
                                </td>
                            </tr>
                            <tr itemProp="potentialAction" itemScope itemType="https://schema.org/VoteAction">
                                <th>{bedeutung} <em>{'\''}{no}{'\''}</em></th>
                                <td itemProp="name">{item.meaning_of_no}</td>
                            </tr>
                            <tr>
                                <th>{oeffentlich}</th>
                                <td>{item.is_public ? yes : no}</td>
                            </tr>
                            <tr itemProp="about" itemScope itemType="https://schema.org/Legislation">
                                <th>{geschaeft}</th>
                                <td>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>{title}</th>
                                                <td>
                                                    <NavLink itemProp="url" to={`/${KANTONSRAT}/${GESCHAEFT}/id/${item.business.id}`}>
                                                        <span itemProp="name">
                                                            {item.business.title}
                                                        </span>
                                                        <meta itemProp="legislationJurisdiction" content="Kanton St.Gallen" />
                                                    </NavLink>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>{geschaeft_number}</th>
                                                <td>{item.business.number}</td>
                                            </tr>
                                            <tr>
                                                <th>{geschaeft_start_date}</th>
                                                <td>{formatDateShort(item.business.begin_date)}</td>
                                            </tr>
                                            <tr>
                                                <th>{geschaeft_end_date}</th>
                                                <td>{item.business.end_date ? formatDateShort(item.business.end_date) : pendent}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="a_sub_sec" style={{ overflowX: 'unset', minWidth: '41%' }}>
                    <table width="100%" className="t_1">
                        <caption>{ergebnis}</caption>
                        <tbody >
                            <tr>
                                <th>{yes}</th>
                                <td>{item.results.yes}</td>
                            </tr>
                            <tr>
                                <th>{no}</th>
                                <td>{item.results.no}</td>
                            </tr>
                            <tr>
                                <th>{abstention}</th>
                                <td>{item.results.abstention}</td>
                            </tr>
                            <tr>
                                <th>{absent}</th>
                                <td>{item.results.absent}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <br />
                    <br />
                    <RadioGroup.Root className="RadioGroupRoot" defaultValue="relative" aria-label="absolute oder relativ" onValueChange={(e: "absolute" | "relative") => setDonat1ShowMode(e)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioGroup.Item className="RadioGroupItem" value="relative" id="r2"  >
                                <RadioGroup.Indicator className="RadioGroupIndicator" />
                            </RadioGroup.Item>
                            <label className="Label" htmlFor="r2">
                                {relativ}
                            </label>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <RadioGroup.Item defaultChecked className="RadioGroupItem" value="absolute" id="r1" >
                                <RadioGroup.Indicator className="RadioGroupIndicator" />
                            </RadioGroup.Item>
                            <label className="Label" htmlFor="r1">
                                {absolut}
                            </label>
                        </div>
                    </RadioGroup.Root>
                    {isClient ? (
                        <Suspense fallback={<div className="susp_ph" style={{ width: '512px', height: '260px' }} />}>
                            <Donut
                                data={donat1ShowMode === "relative"
                                    ? frequencies.vote_display.filter((it) => it.val === 'Ja' || it.val === 'Nein')
                                    : frequencies.vote_display
                                }
                                valueNamespace="count"
                                labelNamespace="val"
                            />
                        </Suspense>
                    ) : null}
                </div>
            </section>

            <section className="a_sec">
                <div className="a_sub_sec">
                    <table width="100%" className="t_1 la">
                        <caption><span>Abstimmungsergebnis nach Wahlkreisen</span></caption>
                        <thead>
                            <tr>
                                <th rowSpan={2}>
                                    {wahlkreis}
                                </th>
                                <th colSpan={2}>{yes}</th>
                                <th colSpan={2}>{no}</th>
                                <th colSpan={2}>{absent_enthaltung}</th>
                                <th rowSpan={2}>{total}</th>
                            </tr>
                            <tr>
                                <th>{anzahl}</th>
                                <th>{anteil}</th>
                                <th>{anzahl}</th>
                                <th>{anteil}</th>
                                <th>{anzahl}</th>
                                <th>{anteil}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {//@ts-expect-error ext type
                                frequencies.person_election_district_title.sort(sorterBallots('val', true)).map((it) => (
                                    <tr key={it.val}>
                                        <td>{it.val}</td>
                                        <td>{it.yes}</td>
                                        <td>{Math.round(it.yes / it.count * 10000) / 100}%</td>
                                        <td>{it.no}</td>
                                        <td>{Math.round(it.no / it.count * 10000) / 100}%</td>
                                        <td>{it.absent + it.abstention}</td>
                                        <td>{Math.round((it.absent + it.abstention) / it.count * 10000) / 100}%</td>
                                        <td>{it.count}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="a_sub_sec">
                    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'center' }}>
                        <MapDistricts districtFrequencies={forMap.districts} />
                    </div>
                </div>
            </section>

            <section className="a_sec">
                <div className="a_sub_sec">
                    <table width="100%" className="t_1">
                        <caption><span>Abstimmungsergebnis nach Parteien</span></caption>
                        <thead>
                            <tr>
                                <th rowSpan={2}>
                                    {partei}
                                </th>
                                <th colSpan={2}>{yes}</th>
                                <th colSpan={2}>{no}</th>
                                <th colSpan={2}>{absent_enthaltung}</th>
                                <th rowSpan={2}>{total}</th>
                            </tr>
                            <tr>
                                <th>{anzahl}</th>
                                <th>{anteil}</th>
                                <th>{anzahl}</th>
                                <th>{anteil}</th>
                                <th>{anzahl}</th>
                                <th>{anteil}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {//@ts-expect-error ext type
                                frequencies.person_party.sort(sorterBallots('val', true)).map((it) => (
                                    <tr key={it.val}>
                                        <td>{it.val}</td>
                                        <td>{it.yes}</td>
                                        <td>{Math.round(it.yes / it.count * 10000) / 100}%</td>
                                        <td>{it.no}</td>
                                        <td>{Math.round(it.no / it.count * 10000) / 100}%</td>
                                        <td>{it.absent + it.abstention}</td>
                                        <td>{Math.round((it.absent + it.abstention) / it.count * 10000) / 100}%</td>
                                        <td>{it.count}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="a_sub_sec" style={{ overflowX: 'unset', minWidth: '300px', minHeight: '250px' }}>
                    {isClient ? (
                        <Suspense fallback={<div style={{ width: '500px', height: '300px' }} className="susp_ph" />}>
                            <StackedBarChart
                                //@ts-expect-error number | string
                                data={frequencies.person_party}
                            />
                        </Suspense>
                    ) : null}

                </div>
            </section>

            <section className="a_sec" >
                <div className="a_sub_sec" style={{ maxHeight: '75vh', overflow: 'auto' }}>

                    <table width="100%" className="t_1">
                        <caption><span>Abstimmungsergebnis nach Gemeinde und Stadt</span></caption>
                        <thead className="t_sticky_header">
                            <tr>
                                <th rowSpan={2}>{gemeinde}</th>
                                <th colSpan={2}>{yes}</th>
                                <th colSpan={2}>{no}</th>
                                <th colSpan={2}>{absent_enthaltung}</th>
                                <th rowSpan={2}>{total}</th>
                            </tr>
                            <tr>
                                <th>{anzahl}</th>
                                <th>{anteil}</th>
                                <th>{anzahl}</th>
                                <th>{anteil}</th>
                                <th>{anzahl}</th>
                                <th>{anteil}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {//@ts-expect-error ext type
                                frequencies.sub_district.sort(sorterBallots('val', true)).map((it) => (
                                    <tr key={it.val}>
                                        <td>{it.val}</td>
                                        <td>{it.yes}</td>
                                        <td>{Math.round(it.yes / it.count * 10000) / 100}%</td>
                                        <td>{it.no}</td>
                                        <td>{Math.round(it.no / it.count * 10000) / 100}%</td>
                                        <td>{it.absent + it.abstention}</td>
                                        <td>{Math.round((it.absent + it.abstention) / it.count * 10000) / 100}%</td>
                                        <td>{it.count}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="a_sec" >
                <div className="a_sub_sec" style={{ maxHeight: '75vh', overflow: 'auto' }}>
                    <table width="100%" className="t_1">
                        <caption>{einzelstimmen}</caption>
                        <thead className="t_sticky_header">
                            <tr>
                                <th>{name}</th>
                                <th>{vote}</th>
                                <th>{partei}</th>
                                <th>Gemeinde / Stadt</th>
                                <th>{person_election_district_title}</th>
                            </tr>
                            <tr>
                                <SortInput row={2} prop="person_name" />
                                <SortInput prop="vote_display" />
                                <SortInput prop="person_party" />
                                <SortInput prop="sub_district" />
                                <SortInput prop="person_election_district_title" />
                            </tr>
                            <tr>
                                <FilterInput prop="vote_display" label="Filter" />
                                <FilterInput prop="person_party" label="Filter" />
                                <FilterInput prop="sub_district" label="Filter" />
                                <FilterInput prop="person_election_district_title" label="Filter" />
                            </tr>
                        </thead>
                        <tbody>
                            {ballots.items.map((it, ind) => (
                                <tr key={it.id + 'a' + ind} itemProp="performer" itemScope itemType="https://schema.org/Person">
                                    <td>
                                        <NavLink itemProp="url" to={`/${KANTONSRAT}/${PERSONEN}/id/${it.person_id}`}>
                                            <span itemProp="name"> {it.person_name}</span>
                                        </NavLink>
                                    </td>
                                    <td>{it.vote_display}</td>
                                    <td itemProp="memberOf" itemScope itemType="https://schema.org/PoliticalParty"><span itemProp="name">{it.person_party}</span></td>
                                    <td itemProp="homeLocation">{it.sub_district}</td>
                                    <td>{it.person_election_district_title}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

        </main>
    )
}