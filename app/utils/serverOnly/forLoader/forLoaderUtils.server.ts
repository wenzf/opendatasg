import arc from "@architect/functions";
import { ContentCategoryKeys, DdbIndex } from "~/types";
import { dbGetIndex } from "../dynamoDB/dbmain.server";
import { BACKEND_CONFIG } from "~/config/backend.server";
import {  json } from "@remix-run/node";
import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config";
import { Params } from "@remix-run/react";


/**
 * check index for last fetch (helper)
 */
export const checkIfDataIsCurrent = async (
    checkItems: ContentCategoryKeys[]
): Promise<{ dataStatus: boolean[], idx: DdbIndex } | null> => {
    const now = Date.now();
    const idx = await dbGetIndex();

    if (idx === null) return null
    const res: boolean[] = []

    /** COMPLETE RESET OF INDEX ONCE IN 2 DAYS 
     * (DATA_RESET_INTERVAL_TIME_IN_MS)
     * FORCING REFETCH OF FIRST 10 ITEMS PER CATEGORY
     * WHEN HOME ROUTE IS LOADED. 
     * 
     * Such a fallback is required since data of API
     * and internal database is kept in sync only by 
     * comparison of the amount of entries. Cases where
     * articles are removed from the API or corrupted
     * responses could mess up the mechanism which keeps
     * data in sync with the API.
     */
    // --- FALLBACK START ---
    if (checkItems?.length === 4) {
        if (now > idx.last_reset + BACKEND_CONFIG.DATA_RESET_INTERVAL_TIME_IN_MS) {
            const db = await arc.tables();
            const ExpressionAttributeValues: Record<string, number> = {}
            ExpressionAttributeValues[`:lr`] = now
            await db.main.update({
                Key: BACKEND_CONFIG.DDB.INDEX_PK_SK,
                UpdateExpression: `SET last_reset = :lr`,
                ExpressionAttributeValues
            })
            return {
                idx,
                dataStatus: [false, false, false, false]
            }
        }
    }
    // --- FALLBACK END ---

    for (let i = 0; i < checkItems.length; i += 1) {
        if (now > idx[checkItems[i]].last_crawl + BACKEND_CONFIG.DATA_UPDATE_INTERVAL_TIME_IN_MS) {
            res.push(false)
        } else {
            res.push(true)
        }
    }
    return {
        idx,
        dataStatus: res
    }
}

/**
 * return content type by params
 */
export const contentTypesAndItemsPerRequestByParams = (params: Params): {
    requestedContentTypes: ContentCategoryKeys[]
    itemsPerRequest: number
} => {
    const { category, section } = params;
    const {
        ROUTE_FRAGMENTS: {
            KANTON,
            STADT,
            MITTEILUNGEN,
            VERNEHMLASSUNGEN,
            POLIZEI
        },
        ENTRIES_SHOWN_IN_FEED
    } = PUBLIC_CONFIG

    const { KTME, KTVE, STME, STPO } = NS_CONTENT_CATEGORY

    let requestedContentTypes: ContentCategoryKeys[]
    let itemsPerRequest = ENTRIES_SHOWN_IN_FEED

    if (section === KANTON) {

        if (!category) {
            requestedContentTypes = [KTME, KTVE]
            itemsPerRequest *= 0.5
        } else if (category === MITTEILUNGEN) {
            requestedContentTypes = [KTME]
        } else if (category === VERNEHMLASSUNGEN) {
            requestedContentTypes = [KTVE]
        } else {
            throw json({}, { status: 404 })
        }


    } else if (section === STADT) {

        if (!category) {
            requestedContentTypes = [STME, STPO]
            itemsPerRequest *= 0.5
        } else if (category === MITTEILUNGEN) {
            requestedContentTypes = [STME]
        } else if (category === POLIZEI) {
            requestedContentTypes = [STPO]
        } else {
            throw json({}, { status: 404 })
        }

    } else {
        throw json({}, { status: 404 })
    }
    return { requestedContentTypes, itemsPerRequest }
}
