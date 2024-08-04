import { APIRatsinfoPeopleFull } from "~/types/ratsinfoAPI";
import BusinessBaseTable from "../business/BusinessBaseTable";
import { formatDateShort } from "~/utils/time";
import { Link, NavLink } from "@remix-run/react";
import { PUBLIC_CONFIG } from "~/config";
import texts from "~/texts";


const { ROUTE_FRAGMENTS: { KANTONSRAT, GREMIEN } } = PUBLIC_CONFIG

export default function PeopleItem({ item }: { item: APIRatsinfoPeopleFull }) {

    const { labels: { generics: {
        anrede, partei, vorname, nachname, beruf, geboren, gestorben,
        kontakt, koalition, email, telefon, fax, mobile_privat, wahlkreis,
        aktiv, interessen, rolle, gremium, beitritt, austritt, yes, no,
        geschaefte, mitgliedschaften
    } } } = texts

    return (
        <main className="a_main sp" itemScope itemType="https://schema.org/Person">
            <h1 className="a_h1" itemProp="name"> {item?.first_name} {item.last_name} </h1>
            <section className="a_sec">
                <div className="a_sub_sec">
                    <table className="t_1">
                        <caption>Persönliche Daten</caption>
                        <tbody>
                            <tr>
                                <th>{anrede}</th>
                                <td itemProp="gender">{item.salutation_display}</td>
                            </tr>
                            <tr>
                                <th>{vorname}</th>
                                <td itemProp="givenName">{item.first_name}</td>
                            </tr>
                            <tr>
                                <th>{nachname}</th>
                                <td itemProp="familyName">{item.last_name}</td>
                            </tr>
                            <tr>
                                <th>{beruf}</th>
                                <td itemProp="jobTitle">{item.profession}</td>
                            </tr>
                            {item.birthdate ? (
                                <tr>
                                    <th>{geboren}</th>
                                    <td itemProp="birthDate">{item.birthdate}</td>
                                </tr>
                            ) : null}
                            {item.date_of_death ? (
                                <tr>
                                    <th>{gestorben}</th>
                                    <td itemProp="deathDate">{item.date_of_death}</td>
                                </tr>
                            ) : null}
                            {item.phone
                                || item.email
                                || item.fax
                                || item.private_mobile ? (
                                <tr>
                                    <th>{kontakt}</th>
                                    <td style={{ padding: 0 }}>
                                        <table>
                                            <tbody>
                                                {item.email ? (
                                                    <tr>
                                                        <th>{email}</th>
                                                        <td>
                                                            <Link itemProp="email" to={`tel:${item.email}`}>
                                                                {item.email}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                                {item.fax ? (
                                                    <tr>
                                                        <th>{fax}</th>
                                                        <td itemProp="faxNumber">{item.fax}</td>
                                                    </tr>
                                                ) : null}
                                                {item.phone ? (
                                                    <tr>
                                                        <th>{telefon}</th>
                                                        <td>
                                                            <Link itemProp="telephone" to={`tel:${item.phone}`}>
                                                                {item.phone}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                                {item.private_mobile ? (
                                                    <tr>
                                                        <th>{mobile_privat}</th>
                                                        <td>
                                                            <Link itemProp="telephone" to={`tel:${item.private_mobile}`}>
                                                                {item.private_mobile}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ) : null}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            ) : null
                            }
                            {item.private_address ? (
                                <tr itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                                    <th>{item.private_address.type_display ? item.private_address.type_display : 'Anschrift'}</th>
                                    <td>
                                        {item.private_address.street ? (<div itemProp="streetAddress">{item.private_address.street}</div>) : null}
                                        {item.private_address.zip_code || item.private_address.city ? (<div>{item.private_address.zip_code ? <span itemProp="postalCode">{`${item.private_address.zip_code} `}</span> : ''}<span itemProp="addressLocality">{item.private_address.city}</span></div>) : null}
                                    </td>
                                </tr>
                            ) : null}
                            {item.place_of_residence?.title ? (
                                <tr>
                                    <th>{wahlkreis}</th>
                                    <td>{item.place_of_residence.title}</td>
                                </tr>
                            ) : null}
                            <tr>
                                <th>{aktiv}</th>
                                <td>{item.is_active ? yes : no}</td>
                            </tr>
                            <tr itemProp="memberOf" itemScope itemType="https://schema.org/PoliticalParty">
                                <th>{partei}</th>
                                <td itemProp="name">{item.party ? item.party : '-'}</td>
                            </tr>
                            {item.coalition_title ? (
                                <tr itemProp="memberOf" itemScope itemType="https://schema.org/Organization">
                                    <th>{koalition}</th>
                                    <td itemProp="name">{item.coalition_title}</td>
                                </tr>
                            ) : null}
                            {item.interests.length ? (
                                <tr>
                                    <th>{interessen}</th>
                                    <td>
                                        <ul>
                                            {item.interests.map((it, ind) => (
                                                <li itemProp="knowsAbout" key={ind}>{it}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {item.portrait ? (
                    <div className="a_sub_sec center_item">
                        <figure>
                            <img itemProp="image" className="a_img" src={item.portrait} loading="lazy" alt={`${item.first_name} ${item.last_name}`} />
                            <figcaption>{`${item.first_name} ${item.last_name}`}</figcaption>
                        </figure>
                    </div>
                ) : null}

            </section>

            {item.memberships?.length ? (
                <section className="a_sec">
                    <div className="a_sub_sec">
                        <table className="t_1 la" width="100%">
                            <caption>{mitgliedschaften}</caption>
                            <thead className="t_sticky_header">
                                <tr>
                                    <td>{gremium}</td>
                                    <td>{rolle}</td>
                                    <td>{beitritt}</td>
                                    <td>{austritt}</td>
                                </tr>
                            </thead>
                            <tbody itemProp="memberOf" itemScope itemType="https://schema.org/Organization">
                                {item.memberships?.map((it) => (
                                    <tr key={it.id}>
                                        <td>
                                            <NavLink to={`/${KANTONSRAT}/${GREMIEN}/id/${it.group_id}`}>
                                                <span itemProp="name">
                                                    {it.group_title}
                                                </span>
                                            </NavLink>
                                        </td>
                                        <td >{it.role_title}</td>
                                        <td>{it.begin_date ? formatDateShort(it.begin_date) : ''}</td>
                                        <td>{it.end_date ? formatDateShort(it.end_date) : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : null}

            {item.businesses?.length ? (
                <section className="a_sec">
                    <div className="a_sub_sec">
                        <BusinessBaseTable caption={geschaefte} feed={item.businesses} />
                    </div>
                </section>
            ) : null}

        </main>
    )
}