import { NavLink, createPath } from "@remix-run/react";
import { HTMLAttributes } from "react";
import texts from "~/texts";
import { ContentCategoryKeys } from "~/types";
import { contentRouteByContentCategory } from "~/utils/forContent";

type ContentCategoryLinkProps = {
    props?: HTMLAttributes<HTMLAnchorElement>
    contentCategory: ContentCategoryKeys
}

/**
 *  category links for preview snippets and articles
 */
export default function ContentCategoryLink({ props, contentCategory }:
    ContentCategoryLinkProps
) {
    if (!contentCategory) return null
    const linkText = texts.labels.content_category.sing[contentCategory]
    const path = createPath({ pathname: contentRouteByContentCategory(contentCategory) })

    return (
        <NavLink end className={`cat_link`} {...props} to={path}>{linkText}</NavLink>
    )
}