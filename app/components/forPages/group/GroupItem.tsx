import { APIRatsinfoGroupFull, APIRatsinfoPeopleBase } from "~/types/ratsinfoAPI";
import { formatDateShort } from "~/utils/time";
import BusinessBaseTable from "../business/BusinessBaseTable";
import PeopleBaseTable from "../people/PeopleBaseTable";
import texts from "~/texts";


export default function GroupItem({ item,
    people }: {
        item: APIRatsinfoGroupFull,
        people: APIRatsinfoPeopleBase[]
    }) {
    const { labels: { generics: { name, typ, aktiv, start, ende, yes, no, mitglieder, geschaefte } } } = texts

    return (
        <main className="a_main sp" itemScope itemType="https://schema.org/Organization">

            <h1 className="a_h1">{item.title}</h1>

            <section className="a_sec">
                <div className="a_sub_sec">
                    <table className="t_1" width="100%">
                        <caption>Eckdaten</caption>
                        <tbody>
                            <tr>
                                <th>{name}</th>
                                <td itemProp="name">{item.title}</td>
                            </tr>
                            <tr>
                                <th>{typ}</th>
                                <td itemProp="additionalType">{item.type.title}</td>
                            </tr>
                            <tr>
                                <th>{aktiv}</th>
                                <td>{item.is_active ? yes : no}</td>
                            </tr>
                            <tr>
                                <th>{start}</th>
                                <td itemProp="foundingDate">{item.begin_date ? formatDateShort(item.begin_date) : ''}</td>
                            </tr>
                            <tr>
                                <th>{ende}</th>
                                <td>{item.end_date ? <span itemProp="dissolutionDate">{formatDateShort(item.end_date)}</span> : ''}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {item.business_participations?.length ? (
                <section className="a_sec">
                    <div className="a_sub_sec"
                        style={{
                            maxHeight: '75vh',
                            overflow: 'auto'
                        }}
                    >
                        <BusinessBaseTable
                            caption={geschaefte}
                            feed={item.business_participations}
                        />
                    </div>
                </section>
            ) : null}

            {people?.length ? (
                <section className="a_sec">
                    <div className="a_sub_sec" style={{
                        maxHeight: '75vh',
                        overflow: 'auto'
                    }}>
                        <PeopleBaseTable
                            caption={mitglieder}
                            feed={people}
                            includeSchemaMember={true}
                        />
                    </div>
                </section>
            ) : null}

            <span itemScope itemProp="parentOrganization" itemType="https://schema.org/GovernmentOrganization">
                <meta itemProp="name" content="Kantonsrat St.Gallen" />
            </span>

        </main>
    )
}