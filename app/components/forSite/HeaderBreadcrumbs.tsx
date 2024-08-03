import { NavLink, useParams, useSearchParams } from "@remix-run/react"
import TriangleRightIconSVG from "~/resources/icons/TriangeRightIconSVG"
import { BreadCrumbFragmentProp } from "~/types"
import { createBreadCrumbProps } from "~/utils/forContent"
import { useLoaderDataByPageHandle, usePathHandle } from "~/utils/hooks"


/**
 * site breadcrumb view
 */
const BreadCrumbFragment = ({ label, position, path, isLast }: BreadCrumbFragmentProp) => (
    <div
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
        className="crumb"
    >
        {!isLast && path ? (
            <NavLink itemProp="item" to={path}>
                <span itemProp="name">
                    {label}
                </span>
                <meta itemProp="position" content={position.toString()} />
            </NavLink>
        ) : (
            <span>
                <span itemProp="name">
                    {label}
                </span>
                <meta itemProp="position" content={position.toString()} />
            </span>
        )}
        {!isLast ? <TriangleRightIconSVG aria-label="nächste" /> : null}
    </div>
)


export default function HeaderBreadcrumbs() {
    const page = usePathHandle()
    const params = useParams()
    const [searchParams] = useSearchParams()
    const loaderData = useLoaderDataByPageHandle()
    const breadcrumbs = createBreadCrumbProps({ params, page, searchParams, loaderData })
    const le = breadcrumbs.length

    return (
        <div itemScope itemType="https://schema.org/BreadcrumbList" className="breadcrumbs">
            {breadcrumbs.map((it, ind) => (
                <BreadCrumbFragment
                    key={ind}
                    isLast={ind + 1 === le}
                    position={ind + 1}
                    label={it.label}
                    path={it.path}
                />
            ))}
        </div>
    )
}