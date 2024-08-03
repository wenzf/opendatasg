import { NavLink, Params, useSearchParams } from "@remix-run/react"
import { useEffect, useRef } from "react"
import { PUBLIC_CONFIG } from "~/config"
import ArrowLeftIconSVG from "~/resources/icons/ArrowLeftIconSVG"
import ArrowRightIconSVG from "~/resources/icons/ArrowRightIconSVG"


type PaginationCompProps2 = {
    pageRootPath: string
    params: Params
    count: number
}

/**
 * pagination for feed pages
 */
export default function PaginationComp2({ pageRootPath, params, count }: PaginationCompProps2) {
    const activeLink = useRef<HTMLAnchorElement>(null);
    const currentPageNum = params?.pageNum ? parseInt(params.pageNum) : 0
    const { ROUTE_FRAGMENTS: { SEARCH_PARAM_FRAGMENT } } = PUBLIC_CONFIG
    const [searchParams] = useSearchParams()
    const keywordSearchParam = searchParams.get('search')
    const optionalKeywordSearchParam = keywordSearchParam ? SEARCH_PARAM_FRAGMENT + keywordSearchParam : ''


    useEffect(() => {
        if (activeLink.current) {
            activeLink.current.scrollIntoView({ inline: 'center' })
        }
    }, [currentPageNum])

    if (count < 50) return null


    const { ROUTE_FRAGMENTS: { SEITE } } = PUBLIC_CONFIG
    const numPages = Math.ceil(count / 50) - 2
    const path = pageRootPath + "/" + SEITE + "/"

    const nextPath = currentPageNum > 1 ? path + (currentPageNum + 1) + optionalKeywordSearchParam : path + '2' + optionalKeywordSearchParam
    const backPath = currentPageNum > 2 ? path + (currentPageNum - 1) + optionalKeywordSearchParam : pageRootPath + optionalKeywordSearchParam


    return (
        <div className="pagination">
            <div className="links">
                {currentPageNum ? (
                    <NavLink className="pag_fb" end to={backPath}>
                        <ArrowLeftIconSVG width={24} height={24} aria-label="nächste" />
                    </NavLink>
                ) : null}
                <div className="scroll_links">
                    {Array.from({ length: numPages + 1 }, (_, i) => i + 2).map((it: number) => (
                        <NavLink
                            end
                            ref={it === currentPageNum ? activeLink : null}
                            key={it}
                            to={path + it + optionalKeywordSearchParam}
                        >
                            {it}
                        </NavLink>
                    ))}
                </div>
                {numPages !== currentPageNum ? (
                    <NavLink className="pag_fb" end to={nextPath}>
                        <ArrowRightIconSVG width={24} height={24} aria-label="vorherige" />
                    </NavLink>
                ) : null}
            </div>
        </div>
    )
}