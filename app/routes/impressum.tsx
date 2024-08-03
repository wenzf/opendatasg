import { MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { PUBLIC_CONFIG } from "~/config"
import GithubIconSVG from "~/resources/icons/GithubIconSVG"
import texts from "~/texts"


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.IMPRESSUM
}


export const meta: MetaFunction = () => {
    const { metasAndTitles: { impressum } } = texts
    const { DEFAULT_OG_IMAGE, DOMAIN_NAME, ROUTE_FRAGMENTS: { IMPRESSUM } } = PUBLIC_CONFIG

    return [
        { title: impressum.title },
        { name: 'description', content: impressum.metaDescription },
        {
            tagName: "link",
            rel: "canonical",
            href: `${DOMAIN_NAME}/${IMPRESSUM}`
        },
        {
            property: "og:image",
            content: DEFAULT_OG_IMAGE()
        }
    ]
}


export default function Impressum() {
    const { metasAndTitles: { impressum } } = texts

    return (
        <main
            className="a_main"
            style={{ padding: '1rem', backgroundColor: 'var(--gray-1)' }}
        >
            <div className="page_article sp">
                <div className="title_frame">
                    <h1 style={{ backgroundColor: 'var(--gray-3)', padding: '1rem', marginBottom: '1rem' }}>{impressum.h1}</h1>
                </div>
                <div className="page_content">
                    <p style={{ padding: '1rem', marginBottom: '0.5rem', backgroundColor: 'var(--gray-2)' }}>OpenData St. Gallen ist ein privates Open Data und Open Source Projekt. Das Projekt richtet sich an jene, die sich für öffentliche Angelegenheiten und das Geschehen in Stadt und Kanton St.Gallen interessieren.</p>
                    <p style={{ padding: '1rem', marginBottom: '0.5rem', backgroundColor: 'var(--gray-2)' }}>Daten, Texte und Bilder stammen von der Stadt und dem Kanton St.Gallen. Interessierte können sich mittels Medienmitteilungen auf dem Laufenden halten und sich über Abstimmungen, Geschäfte, Gremien und Personen des Kantonsrates informieren.</p>
                    <p style={{ padding: '1rem', marginBottom: '0.5rem', backgroundColor: 'var(--gray-2)' }}>Der Quellcode der Webseite ist offen einsehbar. Die Webseite verwendet keine Tracking-Tools.</p>

                    <div className="article_footer" style={{ marginTop: 'unset', backgroundColor: 'var(--gray-1)' }}>
                        <div className="article_source_block"
                            style={{ borderTop: 'unset', backgroundColor: 'var(--gray-2)', marginBottom: '0.5rem', padding: '1rem' }}
                        >
                            Daten
                            <ul >
                                <li>
                                    <Link to="https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-stadtverwaltung-st-gallen">
                                        Medienmitteilungen Stadtverwaltung St.Gallen
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://opendata.swiss/de/dataset/newsfeed-vernehmlassungen-kanton-st-gallen">
                                        Vernehmlassungen Kanton St.Gallen
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-kanton-st-gallen">
                                        Medienmitteilungen Kanton St.Gallen
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://opendata.swiss/de/dataset/newsfeed-medienmitteilungen-der-stadtpolizei-st-gallen">
                                        Medienmitteilungen der Stadtpolizei St.Gallen
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://www.ratsinfo.sg.ch/api">
                                        Ratsinformationssystems des Kantons St.Gallen
                                    </Link>
                                </li>
                                <li>
                                    <Link to="https://opendata.swiss">
                                        opendata.swiss
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="article_source_block"
                            style={{ borderTop: 'unset', backgroundColor: 'var(--gray-2)', marginBottom: '0.5rem', padding: '1rem' }}
                        >
                            Webseite
                            <ul>

                                <li>
                                    <GithubIconSVG aria-label="Github icon" />
                                    {' '}
                                    <Link to="https://github.com/wenzf/opendatasg">
                                        Code
                                    </Link>
                                </li>

                                <li>
                                    Entwicklung:{' '}
                                    <Link to="https://wefrick.com">
                                        Wenzel Frick
                                    </Link>
                                </li>

                                <li>
                                    Kontakt:{' '}
                                    <Link to="mailto:hello@wefrick.com">
                                        hello@wefrick.com
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}