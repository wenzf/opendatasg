import { Theme } from "~/types"
import SearchAllCats from "../generics/SearchAllCats"
import HeaderBreadcrumbs from "./HeaderBreadcrumbs"
import { HeaderNav } from "./HeaderNav"
import ThemeComp from "../generics/ThemeComp"
import { SetStateAction } from "react"
import { usePathHandle } from "~/utils/hooks"
import { PUBLIC_CONFIG } from "~/config"
import SearchKantonsrat from "../generics/SearchKantonsrat"


type HeaderCompProps = {
    themeSetter: (e: SetStateAction<Theme>) => void
    theme: Theme
    prefsDarkmode: boolean
}

/**
 *  site header view
 */
export const HeaderComp = ({ themeSetter, theme, prefsDarkmode }:
    HeaderCompProps
) => {
    const page = usePathHandle()

    const { PAGE_HANDLES: {
        HOME, FEED, ARTICLE, KANTONSRAT_ABSTIMMUNGEN_FEED,
        KANTONSRAT_ABSTIMMUNGEN_ITEM, KANTONSRAT_GESCHAEFT_ITEM, KANTONSRAT_GESCHAEFT_FEED,
        KANTONSRAT_GREMIEN_ITEM, KANTONSRAT_GREMIEN_FEED, KANTONSRAT_PERSONEN_ITEM,
        KANTONSRAT_PERSONEN_FEED },
        ROUTE_FRAGMENTS: { KANTONSRAT, ABSTIMMUNG, GREMIEN, PERSONEN, GESCHAEFT }
    } = PUBLIC_CONFIG

    return (
        <header>
            <HeaderBreadcrumbs />
            <div className="header_comp">
                <HeaderNav />
                <div className="header_top_right">

                    {page === HOME || page === FEED || page === ARTICLE ? <SearchAllCats /> : null}
                    {page === KANTONSRAT_ABSTIMMUNGEN_ITEM || page === KANTONSRAT_ABSTIMMUNGEN_FEED ? (
                        <SearchKantonsrat className="top_search" basePath={`/${KANTONSRAT}/${ABSTIMMUNG}`} label="Suche" />
                    ) : null}
                    {page === KANTONSRAT_GREMIEN_ITEM || page === KANTONSRAT_GREMIEN_FEED ? (
                        <SearchKantonsrat className="top_search" basePath={`/${KANTONSRAT}/${GREMIEN}`} label="Suche" />
                    ) : null}

                    {page === KANTONSRAT_PERSONEN_ITEM || page === KANTONSRAT_PERSONEN_FEED ? (
                        <SearchKantonsrat className="top_search" basePath={`/${KANTONSRAT}/${PERSONEN}`} label="Suche" />
                    ) : null}

                    {page === KANTONSRAT_GESCHAEFT_FEED || page === KANTONSRAT_GESCHAEFT_ITEM ? (
                        <SearchKantonsrat className="top_search" basePath={`/${KANTONSRAT}/${GESCHAEFT}`} label="Suche" />
                    ) : null}

                    <ThemeComp
                        prefsDarkmode={prefsDarkmode}
                        themeSetter={themeSetter}
                        theme={theme}
                    />
                </div>
            </div>
        </header>
    )
}
