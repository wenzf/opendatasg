import { NavLink, createPath } from "@remix-run/react";
import Highlighter from "react-highlight-words";
import ContentCategoryLink from "~/components/generics/ContentCategoryLink";
import { ImageHTML } from "~/components/generics/ImageHtml";
import { ContentItemPublic } from "~/types";
import { readableAndIsoTimeByUnixEpoch } from "~/utils/time";



type FeedItemProps = {
    contentItem: ContentItemPublic,
    position: number
    showCatLink: boolean,
    forSearch?: string
}

/**
 * article preview snippet
 */
export default function FeedItem({ contentItem, position, showCatLink, forSearch }: FeedItemProps) {
    const { title, intro, canonical, published, content_category, image } = contentItem
    const { readable, iso } = readableAndIsoTimeByUnixEpoch(published)
    const path = createPath({ pathname: canonical })

    return (
        <section className="preview">
            {showCatLink ? (
                <ContentCategoryLink contentCategory={content_category} />
            ) : null}
            <time className="sp" dateTime={iso}>{readable}</time>
            <NavLink end to={path} className="preview_inner">
                <ImageHTML position={position} image={image} use_case="thumbnail" />
                <h2 className="sp">
                    {forSearch ? (
                        <Highlighter
                            highlightClassName="highlight_txt"
                            caseSensitive={false}
                            textToHighlight={title}
                            searchWords={[forSearch]}
                        />
                    ) : title}
                </h2>
                <p className="sp">
                    {forSearch ? (
                        <Highlighter
                            highlightClassName="highlight_txt"
                            caseSensitive={false}
                            textToHighlight={intro}
                            searchWords={[forSearch]}
                        />
                    ) : intro}
                </p>
            </NavLink>
        </section>
    )
}