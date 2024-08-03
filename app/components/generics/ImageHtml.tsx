
import { useState } from "react";
import { PUBLIC_CONFIG } from "~/config";
import ExitFullScreenIconSVG from "~/resources/icons/ExitFullScreenIconSVG";
import FullScreenIconSVG from "~/resources/icons/FullScreenIconSVG";
import { ImageHTMLProps } from "~/types"


/**
 * corrects duplicate file extentions
 */
function replaceAfterExtension(dirtyURL: string): string {
    const extensions = [".jpg", ".png"];
    for (const ext of extensions) {
        const index = dirtyURL.indexOf(ext);
        if (index > -1) {
            return dirtyURL.slice(0, index + ext.length);
        }
    }
    return dirtyURL;
}


/**
 *  image markup for previews and articles
 */
export const ImageHTML = ({
    image,
    use_case,
    position
}: ImageHTMLProps) => {
    const [expanded, setExpanded] = useState(false)
    if (!image) return null
    const { image_url, color_summary, alt_description, image_dimensions } = image
    if (typeof image_url !== 'string') return null
    const { STYLES: { FEED, ARTICLE } } = PUBLIC_CONFIG;

    const prettyURL = replaceAfterExtension(image_url) // 

    let highRes;
    let lowRes;
    let widthBreakingPoint
    let width
    let height

    if (use_case === 'thumbnail') {  // feed
        widthBreakingPoint = FEED.IMAGE_MAX_WIDTH_LOW
        width = FEED.IMAGE_MAX_WIDTH_HIGH
        if (image_dimensions?.length) height = Math.round(width / image_dimensions[0] * image_dimensions[1])
        lowRes = encodeURI(prettyURL.replace('image.originalsize', `image.imageWidth__${widthBreakingPoint}`))
        highRes = encodeURI(prettyURL.replace('image.originalsize', `image.imageWidth__${width}`))
    } else { // article
        widthBreakingPoint = ARTICLE.IMAGE_MAX_WIDTH_LOW
        width = ARTICLE.IMAGE_MAX_WIDTH_HIGH
        if (image_dimensions?.length) height = Math.round(width / image_dimensions[0] * image_dimensions[1])
        lowRes = encodeURI(prettyURL.replace('image.originalsize', `image.imageWidth__${widthBreakingPoint}`))
        highRes = encodeURI(prettyURL.replace('image.originalsize', `image.imageWidth__${width}`))
    }

    if (use_case === "thumbnail") {
        return (
            <picture
                className={`page_image`}
                style={{ background: `linear-gradient(45deg, ${color_summary ? color_summary.map((it) => it) : "green, transparent"})` }}
            >
                <source
                    srcSet={`${highRes} 2x`}
                    media={`(max-width: ${widthBreakingPoint}px) and (-webkit-min-device-pixel-ratio: 2)`}
                />
                <source
                    srcSet={`${lowRes} 1x`}
                    media={`(max-width: ${widthBreakingPoint}px) and (-webkit-min-device-pixel-ratio: 1)`}
                />
                <source
                    srcSet={`${highRes} 2x`}
                    media={`(-webkit-min-device-pixel-ratio: 2)`}
                />
                <source
                    srcSet={`${lowRes} 1x`}
                    media={`(-webkit-min-device-pixel-ratio: 1)`}
                />
                <img

                    width={width}
                    height={height}
                    loading={position !== 0 ? 'lazy' : 'eager'}
                    src={highRes}
                    alt={alt_description?.length > 2 ? alt_description : 'Artikelbild'}
                    itemProp="image"
                />
            </picture>
        )
    } else if (use_case === "article") {
        return (
            <figure className="article_figure" style={expanded ? { height } : {}}>
                <picture
                    className={`page_image${expanded ? ' expanded' : ''}`}
                    style={{ background: `linear-gradient(45deg, ${color_summary ? color_summary.map((it) => it) : "var(--green-9), transparent"})` }}
                >
                    {!expanded ? (
                        <>
                            <source
                                srcSet={`${highRes} 2x`}
                                media={`(max-width: ${widthBreakingPoint}px) and (-webkit-min-device-pixel-ratio: 2)`}
                            />
                            <source
                                srcSet={`${lowRes} 1x`}
                                media={`(max-width: ${widthBreakingPoint}px) and (-webkit-min-device-pixel-ratio: 1)`}
                            />
                            <source
                                srcSet={`${lowRes} 1x`}
                                media={`(-webkit-min-device-pixel-ratio: 1)`}
                            />
                            <source
                                srcSet={`${highRes} 2x`}
                                media={`(-webkit-min-device-pixel-ratio: 2)`}
                            />
                        </>
                    ) : null}
                    <img

                        width={width}
                        height={height}
                        loading={position !== 0 ? 'lazy' : 'eager'}
                        src={highRes}
                        alt={alt_description?.length > 2 ? alt_description : 'Artikelbild'}
                        itemProp="image"
                    />
                </picture>
                <figcaption style={expanded ? { height: '100%' } : {}}>
                    {alt_description?.length > 2 ? alt_description : 'Artikelbild'}
                    <button
                        style={expanded
                            ? { position: 'absolute', right: 0, backgroundColor: 'var(--green-10)', transform: 'translate(0,0)' }
                            : { transform: 'translate(9px, -50px)' }}
                        className="expand_btn btn1"
                        type="button"
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        {expanded ?
                            <ExitFullScreenIconSVG
                                aria-label="Bild verkleinern"
                                style={{ color: 'var(--green-1)' }}
                                width={33}
                                height={33}
                            />
                            : <FullScreenIconSVG aria-label="Bild vergrössern" width={33} height={33} />
                        }
                    </button>
                </figcaption>
            </figure>
        )
    } else {
        return null
    }
}