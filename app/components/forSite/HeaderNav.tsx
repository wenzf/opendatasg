import { NavLink } from "@remix-run/react"
import { PUBLIC_CONFIG } from "~/config"
import texts from "~/texts"


const {
    Kanton, Stadt, Mitteilungen,
    Polizei, Vernehmlassungen, Suche,
    Geschaefte, Gremien, Abstimmungen, Personen,
    Kantonsrat
} = texts.labels.nav


const {
    ROUTE_FRAGMENTS: {
        KANTON, MITTEILUNGEN, STADT, POLIZEI,
        VERNEHMLASSUNGEN, SUCHE, KANTONSRAT, ABSTIMMUNG, GESCHAEFT,
        GREMIEN, PERSONEN
    }
} = PUBLIC_CONFIG

/**
 *  site header navigation
 */
export const HeaderNav = () => (
    <nav className="site_navs_scroll" itemScope itemType="http://www.schema.org/SiteNavigationElement">
        <table className="site_navs">
            <colgroup span={2} className="knt" />
            <colgroup span={2} className="knt" />
            <colgroup span={2} className="std" />
            <colgroup span={2} className="std" />
            <colgroup span={2} className="std" />
            <tbody>
                <tr>
                    <td rowSpan={2} itemProp="name">
                        <NavLink itemProp="url" end className="nav1" to="/">
                            <div className="css_logo">SG</div>
                        </NavLink>
                    </td>
                    <td rowSpan={2} itemProp="name">
                        <NavLink itemProp="url" className="nav1" to={`/${SUCHE}`}>{Suche}</NavLink>
                    </td>
                    <td rowSpan={2} itemProp="name">
                        <NavLink itemProp="url" className="nav1" to={`/${KANTON}`}>{Kanton}</NavLink>
                    </td>
                    <td itemProp="name">
                        <NavLink itemProp="url" className="nav2" to={`/${KANTON}/${MITTEILUNGEN}`}>
                            {Mitteilungen}
                        </NavLink>
                    </td>
                    <td rowSpan={2} itemProp="name">
                        <NavLink itemProp="url" className="nav1" to={`/${STADT}`}>{Stadt}</NavLink>
                    </td>
                    <td itemProp="name">
                        <NavLink itemProp="url" className="nav2" to={`/${STADT}/${MITTEILUNGEN}`}>
                            {Mitteilungen}
                        </NavLink>
                    </td>
                    <td rowSpan={2} itemProp="name">
                        <NavLink itemProp="url" className="nav1" to={`/${KANTONSRAT}`}>
                            {Kantonsrat}
                        </NavLink>
                    </td>
                    <td itemProp="name">
                        <NavLink itemProp="url" className="nav2" to={`/${KANTONSRAT}/${GESCHAEFT}`}>
                            {Geschaefte}
                        </NavLink>
                    </td>
                    <td itemProp="name">
                        <NavLink itemProp="url" className="nav2" to={`/${KANTONSRAT}/${PERSONEN}`}>
                            {Personen}
                        </NavLink>
                    </td>
                </tr>
                <tr>
                    <td itemProp="name">
                        <NavLink itemProp="url" className="nav2" to={`/${KANTON}/${VERNEHMLASSUNGEN}`}>
                            {Vernehmlassungen}
                        </NavLink>
                    </td>
                    <td itemProp="name">
                        <NavLink itemProp="url" className="nav2" to={`/${STADT}/${POLIZEI}`}>
                            {Polizei}
                        </NavLink>
                    </td>
                    <td itemProp="name">
                        <NavLink itemProp="url" className="nav2" to={`/${KANTONSRAT}/${ABSTIMMUNG}`}>
                            {Abstimmungen}
                        </NavLink>
                    </td>
                    <td itemProp="name">
                        <NavLink itemProp="url" className="nav2" to={`/${KANTONSRAT}/${GREMIEN}`}>
                            {Gremien}
                        </NavLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </nav>
)
