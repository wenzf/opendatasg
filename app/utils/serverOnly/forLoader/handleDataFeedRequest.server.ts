import { ContentCategoryKeys, ContentItemInternal, ContentItemPublic, DbUpdateIndexProps, DdbIndex } from "~/types"
import { dataAPI } from "../dataAPI/dataAPI.server";
import { dataAPIConfigConstructor } from "../dataAPI/dataAPIConfigConstructor.server";
import { prettyMarkup } from "../dataAPI/prettyMarkup.server";
import { dbGetContentList, dbGetContentListPaginated, dbPutContentBulk, dbUpdateIndex } from "../dynamoDB/dbmain.server";
import { NS_DDB_INDEX_KEYS } from "~/config/backend.server";
import { checkIfDataIsCurrent } from "./forLoaderUtils.server";


/**
 * top level data handler for loaders
 */
export const handleDataFeedRequest = async ({
    requestedContentTypes,
    offset,
    itemsPerRequest
}: {
    requestedContentTypes: ContentCategoryKeys[]
    offset: number
    itemsPerRequest: number
}): Promise<{ feed: ContentItemPublic[], idx: DdbIndex } | null> => {
    const isDataCurrent = await checkIfDataIsCurrent(requestedContentTypes);
    const jobsForAPI: ContentCategoryKeys[] = []
    const jobsForDB: ContentCategoryKeys[] = []
    const responsesForFrontend: ContentItemPublic[] = []
    const responsesToStoreInDB: ContentItemInternal[] = []



    if (isDataCurrent !== null) {

        const idx = isDataCurrent?.idx
        const dataStatus = isDataCurrent?.dataStatus

        /**
         * CONFIGURE
         * requests without offset / non-paginated
         */
        if (isDataCurrent?.dataStatus?.length && offset === 0) {
            for (let i = 0; i < dataStatus.length; i += 1) {
                const oneContentCategoryIsCurrent = dataStatus[i];

                if (oneContentCategoryIsCurrent) {
                    jobsForDB.push(requestedContentTypes[i])
                } else {
                    jobsForAPI.push(requestedContentTypes[i])

                }
            }
        } else if (isDataCurrent?.dataStatus?.length && offset !== 0) {
            /**
             * requests with offset / paginated
             */
            const collectCallsForDb = []
            const possibleJobsForAPI: ContentCategoryKeys[] = []

            /**
             * adjust expected results if offset is higher than available enteries
             * for case when two categories are requested with the same offset
             * but differnt amount of entries
             */
            let adjustExpectedResults = 0;

            for (let i = 0; i < requestedContentTypes.length; i += 1) {
                const oneContentCategory = requestedContentTypes[i];
                const oneContentCategoryTotalResults = idx[oneContentCategory].total_count
                const positionHigh = oneContentCategoryTotalResults - offset
                let positionLow = oneContentCategoryTotalResults - offset - itemsPerRequest + 1

                // adjust
                let isRequestOk = true;
                if (positionHigh < 1) {
                    isRequestOk = false
                    adjustExpectedResults += itemsPerRequest
                } else {
                    const possibleLowDiff = positionLow - itemsPerRequest
                    if (possibleLowDiff < 0) {
                        adjustExpectedResults -= possibleLowDiff
                        positionLow = 1
                    }
                }

                if (isRequestOk) {
                    collectCallsForDb.push(
                        dbGetContentListPaginated({
                            pk: oneContentCategory,
                            positionHigh,
                            positionLow
                        }))
                    possibleJobsForAPI.push(oneContentCategory)
                }
            }

            const possibleItemsFromDb = await Promise.all(collectCallsForDb);
            const flatResults = possibleItemsFromDb.flat();
            const expectedEntries = (requestedContentTypes.length * itemsPerRequest) - adjustExpectedResults
            const resultsFromDBLength = flatResults.length

            /**
             * are items in db?
             * expect one entry less to avoid re-fetch in case of duplicate entries
             */
            if (resultsFromDBLength >= expectedEntries - 1) {
                // await dbPutContentBulk(flatResults)
                return { feed: flatResults, idx }
            } else {
                // if not, fetch all
                jobsForAPI.push(...possibleJobsForAPI)
            }
        }

        /**
         * API
         * checking api for updates
         */
        if (jobsForAPI?.length) {
            const now = Date.now()
            const didUpdate: DbUpdateIndexProps[] = []
            const dataAPIConfigs = dataAPIConfigConstructor(jobsForAPI, offset, itemsPerRequest)
            const allAPICalls = []

            for (let i = 0; i < dataAPIConfigs.length; i += 1) {
                allAPICalls.push(dataAPI(dataAPIConfigs[i]))
            }

            const allRes = await Promise.all(allAPICalls)



            for (let i = 0; i < allRes.length; i += 1) {
                const oneResultFromAPI = allRes[i]
                const oneResultTotalCount = oneResultFromAPI?.total_count
                if (oneResultFromAPI?.results?.length && oneResultTotalCount !== undefined) {
                    const modifiedResponse = prettyMarkup(
                        oneResultFromAPI,
                        dataAPIConfigs[i].modificationRule,
                        dataAPIConfigs[i].contentCategory,
                        offset
                    )
                    responsesToStoreInDB.push(...modifiedResponse)

                    for (let j = 0; j < modifiedResponse.length; j += 1) {

                        const {
                            
                            //search_string,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars                            
                            index_position, ...noInternals } = modifiedResponse[j]
                        responsesForFrontend.push(noInternals)
                    }

                    if (modifiedResponse.length) {
                        didUpdate.push({
                            category: dataAPIConfigs[i].contentCategory,
                            update: [
                                [NS_DDB_INDEX_KEYS.last_crawl, now],
                                [NS_DDB_INDEX_KEYS.total_count, oneResultTotalCount]
                            ]
                        })
                    }


                }
            }
            /**
             * update index
             */
            //            updidx = await dbUpdateIndex(didUpdate)
            if (didUpdate?.length) await dbUpdateIndex(didUpdate)
        }
        /**
         * DB
         * save new entries to db
         */

        if (responsesToStoreInDB?.length) await dbPutContentBulk(responsesToStoreInDB)
        /**
         * get data from db
         */
        if (jobsForDB?.length) {
            const dbJobs = []

            for (let i = 0; i < jobsForDB.length; i += 1) {
                dbJobs.push(dbGetContentList({ pk: jobsForDB[i], limit: itemsPerRequest }))
            }

            const allContentFromDB = await Promise.all(dbJobs)
            const flattened = allContentFromDB.flat()
            responsesForFrontend.push(...flattened)
        }
        return { feed: responsesForFrontend, idx }
    }
    return null
}