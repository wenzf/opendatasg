/**
 * API
 */

export type APIResponse = {
    total_count: number
    results: APIResult[]
}

export type APIResult = {
    link: string
    title: string
    description: string
    published: string
    bild_url?: string
    bild?: APIBild
}

export type APIBild = {
    thumbnail: boolean
    filename: string
    format: string
    width: number
    mimetype: string
    id: string
    last_synchronized: string
    color_summary: string[]
    height: number
    url: string
}

export interface BaseAPI {
    endpoint: string
    offset?: number
}

export interface FetchAPI extends BaseAPI {
    params: string[]
}

export interface DataAPI extends BaseAPI {
    limit?: number
    includeImage?: boolean
}

export interface DataAPIConfig {
    endpoint: string
    limit: number
    offset: number
    includeImage: boolean
    modificationRule: PrettyMarkupModificationRule[]
    contentCategory: ContentCategoryKeys
    search_term?: string
}
