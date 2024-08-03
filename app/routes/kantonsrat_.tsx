
import { MetaFunction } from "@remix-run/node";
import SearchKantonsrat from "../components/generics/SearchKantonsrat";
import { PUBLIC_CONFIG } from "../config";
import texts from "../texts";
import { removeTrailingSlash } from "~/utils/misc";
import { NavLink } from "@remix-run/react";


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.KANTONSRAT_MAIN
}


export const meta: MetaFunction = ({ location }) => {
    const { DOMAIN_NAME, DEFAULT_OG_IMAGE } = PUBLIC_CONFIG
    const { metasAndTitles: { kantonsrat_main: { title, metaDescription } } } = texts
    const { pathname } = location
    return [
        { title },
        { name: "description", content: metaDescription },
        {
            tagName: "link",
            rel: "canonical",
            href: DOMAIN_NAME + removeTrailingSlash(pathname),
        },
        {
            property: "og:image",
            content: DEFAULT_OG_IMAGE()
        }
    ]
}


export default function Kantonsrat() {
    const { ROUTE_FRAGMENTS: { KANTONSRAT, PERSONEN, GREMIEN, GESCHAEFT, ABSTIMMUNG } } = PUBLIC_CONFIG
    const { labels: { nav: { Abstimmungen, Geschaefte, Gremien, Personen } }, metasAndTitles: { kantonsrat_main } } = texts

    return (
        <main className="a_main sp">
            <h1 className="a_h1">{kantonsrat_main.h1} </h1>
            <div className="a_main_2">
                <section className="a_search_fr">
                    <h2>Daten</h2>
                    <p>Informieren Sie sich über die Aktivitäten des Kantonsrates St.Gallen, dessen Gremien wie Kommissionen oder Parteien sowie akuelle oder ehemalige Kantonsrätinnen und Kantonsräte.</p>
                    <p>Der Datensatz beinhaltet Geschäfte und Abstimmungen des Kantonsrates St.Gallen seit 2006, einzelne Geschäfte seit 1993. Die Originaldaten sind auf der offiziellen <NavLink to="https://www.ratsinfo.sg.ch/api">Webseite des Ratsinformationssystems</NavLink> des Kantons St.Gallen unter abrufbar.</p>
                </section>
                <section>
                    <div className="a_search_fr" style={{ letterSpacing: '0.7px' }}>
                        <h2>Stichwortsuche</h2>
                        <SearchKantonsrat className="a_search" basePath={`/${KANTONSRAT}/${ABSTIMMUNG}`} label={Abstimmungen} />
                        <SearchKantonsrat className="a_search" basePath={`/${KANTONSRAT}/${GESCHAEFT}`} label={Geschaefte} />
                        <SearchKantonsrat className="a_search" basePath={`/${KANTONSRAT}/${PERSONEN}`} label={Personen} />
                        <SearchKantonsrat className="a_search" basePath={`/${KANTONSRAT}/${GREMIEN}`} label={Gremien} />
                    </div>
                </section>
            </div>
            <br />
            <br />
            <br />
        </main>
    )
}