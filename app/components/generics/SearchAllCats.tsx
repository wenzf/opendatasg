import { useNavigate } from "@remix-run/react"
import { SyntheticEvent, useRef } from "react"
import { PUBLIC_CONFIG } from "~/config"
import SearchIconSVG from "~/resources/icons/SearchIconSVG"


/**
 *  markup and logic for sitewide search
 */
export default function SearchAllCats() {
    const navigate = useNavigate()
    const searchString = useRef<HTMLInputElement>(null)
    const { ROUTE_FRAGMENTS: { BEGRIFF, SUCHE }, DOMAIN_NAME } = PUBLIC_CONFIG

    const onDoSearch = (e: SyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const str = searchString?.current?.value?.toLowerCase()
        if (typeof str === 'string' && str.length > 1 && searchString.current) {
            const search_string = encodeURI(str.toLowerCase())
            searchString.current.value = ""
            navigate(`/${SUCHE}/${BEGRIFF}/${search_string}`)
        }
    }

    return (
        <form onSubmit={onDoSearch} className="top_search" itemProp="potentialAction" itemScope itemType="https://schema.org/SearchAction">
            <meta itemProp="target" content={`${DOMAIN_NAME}/${SUCHE}/{search_term_string}`} />
            <label htmlFor="suche">
                Suche
            </label>
            <input itemProp="query-input" name="search_term_string" required aria-required className="inp1" ref={searchString} id="suche" type="search" />
            <button className="btn2" type="submit"  >
                <SearchIconSVG height={24} width={24} aria-label="Stichwortsuche" />
            </button>
        </form>

    )
}