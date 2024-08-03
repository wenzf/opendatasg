import { Params } from "@remix-run/react"
import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config"

import texts from "~/texts"
import { BreadCrumbBase, ContentCategoryKeys, ContentItemPublic } from "~/types"

const {
    ROUTE_FRAGMENTS: {
        KANTON, STADT, MITTEILUNGEN, POLIZEI, VERNEHMLASSUNGEN, ARTIKEL, SUCHE,
        IMPRESSUM, KANTONSRAT, ABSTIMMUNG, GESCHAEFT, PERSONEN, GREMIEN
    },
    PAGE_HANDLES: { FEED, ARTICLE, SEARCH, KANTONSRAT_MAIN, KANTONSRAT_ABSTIMMUNGEN_FEED,
        KANTONSRAT_GESCHAEFT_ITEM, KANTONSRAT_GESCHAEFT_FEED, KANTONSRAT_ABSTIMMUNGEN_ITEM,
        KANTONSRAT_GREMIEN_FEED, KANTONSRAT_GREMIEN_ITEM, KANTONSRAT_PERSONEN_FEED,
        KANTONSRAT_PERSONEN_ITEM
    }
} = PUBLIC_CONFIG

const {
    labels: { nav: { Kanton, Stadt, Mitteilungen, Vernehmlassungen, Artikel,
        Polizei, Home, Seite, Suche, Begriff, Impressum, Kantonsrat, Abstimmungen,
        Geschaefte, Gremien, Personen } }
} = texts

const { KTME, KTVE, STME, STPO } = NS_CONTENT_CATEGORY


/**
 * returns content types by param on search route (helper)
 */
export const contentCategoryBySearchLocationParam = (
    searchLocation: string | undefined
): ContentCategoryKeys[] | null => {
    if (!searchLocation) return Object.keys(NS_CONTENT_CATEGORY) as ContentCategoryKeys[]
    const locationsSplit = searchLocation.split('+')
    const capitalized = locationsSplit.map((it) => it.toUpperCase())
    if (capitalized.every((key) => key in NS_CONTENT_CATEGORY)) {
        return capitalized as ContentCategoryKeys[]
    } else {
        return null
    }
}

const slugByTitle = (title: string): string => {
    const text = title.toLowerCase()
    const allowedChars = new Set("abcdefghijklmnopqrstuvwxyz0123456789 äéöèéü ".split(""));
    const clean = text.split("").filter((char) => allowedChars.has(char)).join("");
    const slug = clean.replaceAll(' ', "-");
    return encodeURIComponent(slug)
}


/**
 * returns path fragments by content types (helper)
 */
export const contentRouteByContentCategory = (
    contentCategory: ContentCategoryKeys
) => {
    let path = ''
    if (contentCategory === KTME) {
        path += `/${KANTON}/${MITTEILUNGEN}`
    } else if (contentCategory === KTVE) {
        path += `/${KANTON}/${VERNEHMLASSUNGEN}`
    } else if (contentCategory === STME) {
        path += `/${STADT}/${MITTEILUNGEN}`
    } else if (contentCategory === STPO) {
        path += `/${STADT}/${POLIZEI}`
    }
    return path
}


export const articlePathByContentCategoryAndPublishedAndTitle = (
    contentCategory: ContentCategoryKeys,
    published: number,
    title: string
) => {
    return `${contentRouteByContentCategory(contentCategory)}/${ARTIKEL}/${published.toString(32)}/${slugByTitle(title)}`
}


const sortByPublished = (a: ContentItemPublic, b: ContentItemPublic) => {
    if (a.published > b.published) return -1;
    if (a.published < b.published) return 1;
    return 0
}


function removeCanonicalDuplicate(
    contentItems: ContentItemPublic[]
): ContentItemPublic[] {
    const seen = new Set<string>();
    const result: ContentItemPublic[] = [];
    for (const obj of contentItems) {
        const key = obj.canonical;
        if (!seen.has(key)) {
            seen.add(key);
            result.push(obj);
        }
    }
    return result;
}

/**
 * sort feed times by date and remvoe duplicates
 */
export const prettyFeed = (
    contentItems: ContentItemPublic[]
): ContentItemPublic[] => {
    if (!contentItems?.length) return []
    const pretty = removeCanonicalDuplicate(contentItems)
    return pretty.sort(sortByPublished)
}


export const contentTypeByParams = (
    params: Params
): null | ContentCategoryKeys => {
    const { section, category } = params;
    if (!section || !category) return null
    if (section === KANTON) {
        if (category === MITTEILUNGEN) {
            return KTME
        } else if (category === VERNEHMLASSUNGEN) {
            return KTVE
        } else {
            return null
        }
    } if (section === STADT) {
        if (category === POLIZEI) {
            return STPO
        } else if (category === MITTEILUNGEN) {
            return STME
        } else {
            return null
        }
    } else {
        return null
    }
}


const createBreadCrumbPropsPageSearchHelper = (
    pageNum: string | undefined,
    label: string,
    path: string,
    keywordSearchParam: string | null
) => {
    const breadCrumbRoot = [];
    if (pageNum) {
        breadCrumbRoot.push({ label, path })
        if (keywordSearchParam) {
            breadCrumbRoot.push({
                label: keywordSearchParam.replaceAll('%20', ' '),
                path: `${path}?search=${keywordSearchParam}`
            })
        }
        breadCrumbRoot.push({ label: `${Seite} ${pageNum}` })
    } else {
        if (keywordSearchParam) {
            breadCrumbRoot.push({ label, path })
            breadCrumbRoot.push({ label: keywordSearchParam.replaceAll('%20', ' ') })
        } else {
            breadCrumbRoot.push({ label })
        }
    }
    return breadCrumbRoot
}

/**
 * pre configure breadcrumbs
 */
export const createBreadCrumbProps = ({ params, page, searchParams, loaderData }: {
    params: Params
    page: keyof typeof PUBLIC_CONFIG.PAGE_HANDLES
    searchParams: URLSearchParams
    loaderData?: unknown
}): BreadCrumbBase[] => {
    const { section, category, pageNum, searchTerm, abid } = params

    const breadCrumbRoot: BreadCrumbBase[] = [{ label: Home, path: "/" }]

    if (page === PUBLIC_CONFIG.PAGE_HANDLES.IMPRESSUM) {
        breadCrumbRoot.push({
            label: Impressum,
            path: `/${IMPRESSUM}`
        })
    } else if (page === FEED || page === ARTICLE) {
        if (section === STADT) {
            breadCrumbRoot.push({
                label: Stadt,
                path: `/${STADT}`
            })
            if (category === MITTEILUNGEN) {
                breadCrumbRoot.push({
                    label: Mitteilungen,
                    path: `/${STADT}/${MITTEILUNGEN}`
                })
            } else if (category === POLIZEI) {
                breadCrumbRoot.push({
                    label: Polizei,
                    path: `/${STADT}/${POLIZEI}`
                })
            }
        } else if (section === KANTON) {
            breadCrumbRoot.push({
                label: Kanton,
                path: `/${KANTON}`
            })
            if (category === MITTEILUNGEN) {

                breadCrumbRoot.push({
                    label: Mitteilungen,
                    path: `/${KANTON}/${MITTEILUNGEN}`
                })
            } else if (category === VERNEHMLASSUNGEN) {
                breadCrumbRoot.push({
                    label: Vernehmlassungen,
                    path: `/${KANTON}/${VERNEHMLASSUNGEN}`
                })
            }
        }
        if (page === FEED) {
            if (pageNum) {
                breadCrumbRoot.push({
                    label: `${Seite} ${pageNum}`
                })
            }
        } else if (page === ARTICLE) {
            breadCrumbRoot.push({
                label: Artikel
            })
        }
    } else if (page === SEARCH) {
        breadCrumbRoot.push({
            label: Suche,
            path: `/${SUCHE}`
        })
        if (searchTerm) {
            breadCrumbRoot.push({
                label: `${Begriff} "${searchTerm.replaceAll('%20', ' ')}"`,
            })
        }
    } else if (page === KANTONSRAT_MAIN) {
        breadCrumbRoot.push({
            label: Kantonsrat,
        })
        /**
         * KANTONSRAT ROUTES
         */
    } else if (
        page === KANTONSRAT_ABSTIMMUNGEN_FEED
        || page === KANTONSRAT_ABSTIMMUNGEN_ITEM
        || page === KANTONSRAT_GESCHAEFT_FEED
        || page === KANTONSRAT_GESCHAEFT_ITEM
        || page === KANTONSRAT_GREMIEN_FEED
        || page === KANTONSRAT_GREMIEN_ITEM
        || page === KANTONSRAT_PERSONEN_FEED
        || page === KANTONSRAT_PERSONEN_ITEM
    ) {
        const keywordSearchParam = searchParams.get('search')

        breadCrumbRoot.push({
            label: Kantonsrat,
            path: `/${KANTONSRAT}`
        })

        if (page === KANTONSRAT_ABSTIMMUNGEN_ITEM) {
            if (abid) {
                breadCrumbRoot.push({
                    label: Abstimmungen,
                    path: `/${KANTONSRAT}/${ABSTIMMUNG}`
                })
                breadCrumbRoot.push({
                    //  label: abid,
                    // @ts-expect-error from loader
                    label: loaderData?.item?.title
                })
            }
        } else if (page === KANTONSRAT_ABSTIMMUNGEN_FEED) {
            const cr = createBreadCrumbPropsPageSearchHelper(pageNum, Abstimmungen, `/${KANTONSRAT}/${ABSTIMMUNG}`, keywordSearchParam)

            breadCrumbRoot.push(...cr)

        } else if (page === KANTONSRAT_GESCHAEFT_ITEM) {
            breadCrumbRoot.push({
                label: Geschaefte,
                path: `/${KANTONSRAT}/${GESCHAEFT}`
            })

            breadCrumbRoot.push({
                // @ts-expect-error from loader
                label: loaderData?.item?.number
            })
        } else if (page === KANTONSRAT_GESCHAEFT_FEED) {
            const cr = createBreadCrumbPropsPageSearchHelper(pageNum, Geschaefte, `/${KANTONSRAT}/${GESCHAEFT}`, keywordSearchParam)

            breadCrumbRoot.push(...cr)

        } else if (page === KANTONSRAT_PERSONEN_FEED) {
            const cr = createBreadCrumbPropsPageSearchHelper(pageNum, Personen, `/${KANTONSRAT}/${PERSONEN}`, keywordSearchParam)

            breadCrumbRoot.push(...cr)

        } else if (page === KANTONSRAT_PERSONEN_ITEM) {
            breadCrumbRoot.push({
                label: Personen,
                path: `/${KANTONSRAT}/${PERSONEN}`
            })

            breadCrumbRoot.push({
                // @ts-expect-error from loader
                label: `${loaderData?.item?.first_name} ${loaderData?.item?.last_name}` //  `Id ${pid}`,
            })

        } else if (page === KANTONSRAT_GREMIEN_FEED) {
            const cr = createBreadCrumbPropsPageSearchHelper(pageNum, Gremien, `/${KANTONSRAT}/${GREMIEN}`, keywordSearchParam)

            breadCrumbRoot.push(...cr)

        } else if (page === KANTONSRAT_GREMIEN_ITEM) {
            breadCrumbRoot.push({
                label: Gremien,
                path: `/${KANTONSRAT}/${GREMIEN}`
            })

            breadCrumbRoot.push({
                // @ts-expect-error from loader
                label: loaderData?.item?.type?.title
            })
        }
    }

    return breadCrumbRoot
}