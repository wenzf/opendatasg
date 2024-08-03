import { NavLink, useNavigation } from "@remix-run/react";
import { PUBLIC_CONFIG } from "~/config";
import ScrollToTopButton from "../generics/ScrollToTopButton";


/**
 * site footer
 */
export default function FooterComp() {
    const { state } = useNavigation()
    const { DOMAIN_NAME, ROUTE_FRAGMENTS: { IMPRESSUM } } = PUBLIC_CONFIG

    return (
        <footer>
            <div>
                <NavLink to={`/${IMPRESSUM}`}>Impressum</NavLink>
            </div>
            <div className="footer_right" itemScope itemType="https://schema.org/Project">
                <div className="css_logo">SG</div>
                <meta itemProp="alternateName" content="ODSG" />
                <meta itemProp="description" content="Open Data Portal für den Kanton St.Gallen" />
                <link itemProp="logo" href={`${DOMAIN_NAME}/_static/icons/android-chrome-512x512.png`} />
                <link itemProp="url" href={DOMAIN_NAME} />
                <div itemProp="name">
                    <div>OpenData</div>
                    <div>{' '}St.Gallen</div>
                </div>
            </div>
            {state !== 'idle' ? (
                <div className="spinner_pending">
                    <div className="css_logo">SG</div>
                </div>
            ) : null}
            <ScrollToTopButton />
            <span>
                <meta itemProp="url" content={DOMAIN_NAME} />
                <meta itemProp="name" content="OpenData St.Gallen" />
                <meta itemProp="inLanguage" content="de" />
                <meta itemProp="alternateName" content="ODSG" />
                <meta itemProp="description" content="Open Data Portal für den Kanton St.Gallen" />
                <meta itemProp="keywords" content="St.Gallen, Open Data, Open Government, Schweiz, Kantonsrat, Medienmitteilungen, Polizeimeldungen, Vernehmlassungen" />
            </span>
        </footer>
    )
}