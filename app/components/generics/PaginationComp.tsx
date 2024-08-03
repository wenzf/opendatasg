import { NavLink, Params } from "@remix-run/react"
import { useEffect, useRef } from "react"
import { PUBLIC_CONFIG } from "~/config"
import ArrowLeftIconSVG from "~/resources/icons/ArrowLeftIconSVG"
import ArrowRightIconSVG from "~/resources/icons/ArrowRightIconSVG"
import { DdbIndex } from "~/types"
import { contentRouteByContentCategory, contentTypeByParams } from "~/utils/forContent"


type PaginationCompProps = {
    idx: DdbIndex
    params: Params
}

/**
 * pagination for feed pages
 */
export default function PaginationComp({ idx, params }: PaginationCompProps) {
    const contentType = contentTypeByParams(params)
    const activeLink = useRef<HTMLAnchorElement>(null);
    const currentPageNum = params?.pageNum ? parseInt(params.pageNum) : 0

    useEffect(() => {
        if (activeLink.current) {
            activeLink.current.scrollIntoView({ inline: 'center' })
        }
    }, [currentPageNum])

    if (!idx || !contentType) return null

    const total_count = idx[contentType].total_count
    const { ENTRIES_SHOWN_IN_FEED, ROUTE_FRAGMENTS: { SEITE } } = PUBLIC_CONFIG
    const numPages = Math.ceil(total_count / ENTRIES_SHOWN_IN_FEED) - 2
    const path = contentRouteByContentCategory(contentType) + "/" + SEITE + "/"

    return (
        <div className="pagination">
            <div className="links">
                {currentPageNum ? (
                    <NavLink className="pag_fb" end to={path + (currentPageNum - 1)}>
                        <ArrowLeftIconSVG width={24} height={24} aria-label="nächste" />
                    </NavLink>
                ) : null}
                <div className="scroll_links">
                    {Array.from({ length: numPages }, (_, i) => i + 1).map((it: number) => (
                        <NavLink
                            end
                            ref={it === currentPageNum ? activeLink : null}
                            key={it}
                            to={path + it}
                        >
                            {it}
                        </NavLink>
                    ))}
                </div>
                {numPages !== currentPageNum ? (
                    <NavLink className="pag_fb" end to={path + (currentPageNum + 1)}>
                        <ArrowRightIconSVG width={24} height={24} aria-label="vorherige" />
                    </NavLink>
                ) : null}
            </div>
        </div>
    )
}