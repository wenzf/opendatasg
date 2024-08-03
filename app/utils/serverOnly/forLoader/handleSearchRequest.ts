import { ContentCategoryKeys } from "~/types"
import { dataAPIConfigConstructor } from "../dataAPI/dataAPIConfigConstructor.server";
import {  dataAPISearch } from "../dataAPI/dataAPI.server";
import { prettyMarkup } from "../dataAPI/prettyMarkup.server";

export const handSearchRequest = async ({ jobsForAPI, searchTerm }: {
    jobsForAPI: ContentCategoryKeys[]
    searchTerm: string
}) => {
    const dataAPIConfigs = dataAPIConfigConstructor(jobsForAPI, 0, 100, searchTerm);
    const collectAPICalls = [];
    const prettyResponses = []

    for (let i = 0; i < dataAPIConfigs.length; i += 1) {
         collectAPICalls.push(dataAPISearch(dataAPIConfigs[i]))
    }

    const allRes = await Promise.all(collectAPICalls)

    for (let i = 0; i < allRes.length; i += 1) {
        const oneResultFromAPI = allRes[i]
        if (oneResultFromAPI) {
            const modifiedResponse = prettyMarkup(
                oneResultFromAPI,
                dataAPIConfigs[i].modificationRule,
                dataAPIConfigs[i].contentCategory,
                0
            )
            prettyResponses.push(modifiedResponse)
        }
    }
    return prettyResponses.flat()
}