import { NS_CONTENT_CATEGORY } from "~/config"
import { NS_DDB_INDEX_KEYS } from "~/config/backend.server"

/**
 * GENERAL
 */

export type AsyncSuccess = { success: boolean }

export type Theme = "light" | "dark" | ""


/**
 * DB
 */

export type ContentCategoryKeys = keyof typeof NS_CONTENT_CATEGORY

export type DdbIndexKeys = keyof typeof NS_DDB_INDEX_KEYS

export type DdbIndex = Record<ContentCategoryKeys, Record<DdbIndexKeys, number>, { last_reset: number }>

export type DbUpdateIndexProps = {
    category: ContentCategoryKeys
    update: [DdbIndexKeys, number][]
}


/**
 * CONTENT
 */

export interface ContentImage {
    image_url: string,
    image_dimensions: number[]
    color_summary: string[]
    alt_description: string
}

export type ImageHTMLProps = {
    image: ContentImage | null
    use_case: "thumbnail" | "article"
    position: number
}

export interface ContentItemPublic {
    title: string
    intro: string
    body: string
    published: number
    content_category: ContentCategoryKeys
    original_link: string
    image: ContentImage | null
    views_human: number
    views_bot: number
    canonical: string
}

export interface ContentItemInternal extends ContentItemPublic {
    index_position: number // position API DB for pagination
}

export interface BreadCrumbBase {
    label: string
    path?: string
}

export interface BreadCrumbFragmentProp extends BreadCrumbBase {
    isLast: boolean
    position: number
}

export interface TextsAndMetas {
    h1: string
    title: string
    metaDescription: string
}


/**
 * View Snippets
 */

export type RatsinfoGroupView = {

    id: number,
    title: string,
    type_title: string
}


/**
 * utils
 */

export type PrettyMarkupModificationRule = {
    selector: string
    replacement: string
    extractText?: boolean
    extractAlt?: boolean
    maxLenReplaceText?: number
};


export type BallotFrequencies = Record<
    string,
    {
        val: (string | number)
        count: number
        yes: number
        no: number
        absent: number
        abstention: number
    }[]
>
