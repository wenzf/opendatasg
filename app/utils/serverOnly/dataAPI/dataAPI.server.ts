import invariant from "tiny-invariant";
import { BACKEND_CONFIG } from "~/config/backend.server"
import { APIResponse, DataAPI, FetchAPI } from "~/types/mediaAPI";


invariant('SESSION_SECRET', 'SESSION_SECRET not set')


const {
    DATA_API: {
        PARAMS: {
            OFFSET,
            WHERE,
            SELECT_ITEMS_DEFAULT,
            SELECT_ITEMS_NO_IMAGE,
            LIMIT,
            ORDER_BY_PROP,
            SELECT
        },
        ENDPOINTS: { RATSINFO }
    }
} = BACKEND_CONFIG;


/**
 * search params for API (helper)
 */
const constructParams = (params: string[]) => {
    let paramsFragments = ''
    for (let i = 0; i < params.length; i += 1) {
        if (i > 0) paramsFragments += '&'
        paramsFragments += params[i]
    }
    return paramsFragments
}


/**
 *  fetch API (helper)
 */
const fetchAPI = async ({
    endpoint,
    params,
    offset
}: FetchAPI): Promise<APIResponse | null> => {
    try {
        let path = endpoint + constructParams(params)
        if (offset) path += OFFSET + offset
        const res = await fetch(new URL(path))
        const toJson = await res.json();

        if (toJson) return toJson
        return null
    } catch (error: Error | unknown) {
        return null
    }
}

/**
 *  get API data by configuration
 */
export const dataAPI = async ({
    ...props
}: DataAPI) => {
    const {
        offset,
        endpoint,
        limit,
        includeImage,
    } = props
    const select = includeImage ? SELECT_ITEMS_DEFAULT : SELECT_ITEMS_NO_IMAGE
    const nextYear = new Date().getUTCFullYear() + 1
    const where = WHERE + encodeURIComponent(`published < ${nextYear}`) // exclude wrong entries dated in far future
    const res = await fetchAPI({
        endpoint: endpoint,
        params: [
            where,
            LIMIT + limit,
            ORDER_BY_PROP.replace('{{PROP}}', 'published'),
            SELECT + select
        ],
        offset
    })

    if (res) return res
    return res
}


export const dataAPISearch = async ({
    ...props
}) => {
    const {
        // offset,
        endpoint,
        limit,
        includeImage,
        search_term
    } = props
    const select = includeImage ? SELECT_ITEMS_DEFAULT : SELECT_ITEMS_NO_IMAGE
    const where = WHERE + encodeURIComponent(`title like "${search_term}" OR description like "${search_term}"`) // exclude wrong entries dated in far future
    const res = await fetchAPI({
        endpoint: endpoint,
        params: [
            where,
            LIMIT + limit,
            ORDER_BY_PROP.replace('{{PROP}}', 'published'),
            SELECT + select
        ],
    })

    if (res) return res
    return res
}


export const dataAPIRatstinfoGroups = async (
    feed: Record<string, unknown>[],
    keys: string[][]) => {

    const groupIds: number[] = []
    const groupCalls = []

    let groups = {}
    const collectedIds = []
    for (let i = 0; i < feed.length; i += 1) {
        for (let j = 0; j < keys.length; j += 1) {
            if (keys[j].length === 1) {
                collectedIds.push(feed[i][keys[j][0]])
            } else if (keys[j].length === 2) {
                // @ts-expect-error any type
                collectedIds.push(feed[i][keys[j][0]][keys[j][1]])
            } else if (keys[j].length === 3) {
                // @ts-expect-error any type
                collectedIds.push(feed[i][keys[j][0]][keys[j][1]][keys[j][2]])
            }
        }
    }

    for (let i = 0; i < collectedIds.length; i += 1) {
        if (!groupIds.includes(collectedIds[i])) groupIds.push(collectedIds[i])
    }

    for (let i = 0; i < groupIds.length; i += 1) {
        groupCalls.push(fetch(`${RATSINFO}/groups/${groupIds[i]}`).then((it) => it.json()))
    }

    const callRes = await Promise.all(groupCalls)
    for (let i = 0; i < callRes.length; i += 1) {
        groups = { ...groups, ['g_' + callRes[i].id]: callRes[i] }
    }

    return groups
}