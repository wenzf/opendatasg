import { Params } from "@remix-run/react";
import texts from "~/texts";
import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config";
import { contentCategoryBySearchLocationParam } from "./forContent";
import { TextsAndMetas } from "~/types";

const { STME, STPO, KTME, KTVE } = NS_CONTENT_CATEGORY

const {
    metasAndTitles: { PLACEHOLDER_KEYWORD, search: { searchTermAllCats, root } },
    labels: { content_category: { plu }, nav: { Seite } }
} = texts
const keyword = PLACEHOLDER_KEYWORD

/**
* TODO: MOVE STRINGS TO texts/metasAndTitles.json
*/


/**
 * for search routes; returns text fragments for meta data by params
 */
export const textsAndMetasForSearchRouteByParams = (params: Params): {
    h1: string,
    title: string
    metaDescription: string,
} => {
    const { searchLocation, searchTerm } = params

    let h1 = ''
    let title = ''
    let metaDescription = ''

    if (!searchLocation && !searchTerm) {
        return root
    } else if (!searchLocation && searchTerm) {
        h1 = searchTermAllCats.h1.replace(keyword, searchTerm)
        title = searchTermAllCats.title.replace(keyword, searchTerm)
        metaDescription = searchTermAllCats.metaDescription.replace(keyword, searchTerm)
    } else if (searchLocation && searchTerm) {
        const hasSTME = searchLocation.indexOf(STME.toLocaleLowerCase()) !== -1
        const hasSTPO = searchLocation.indexOf(STPO.toLocaleLowerCase()) !== -1
        const hasKTME = searchLocation.indexOf(KTME.toLocaleLowerCase()) !== -1
        const hasKTVE = searchLocation.indexOf(KTVE.toLocaleLowerCase()) !== -1

        const metaSuffix = 'Medienmitteilungen nach Stichworten und Kategorien durchsuchen.'

        if (hasSTME && hasSTPO && !hasKTME && !hasKTVE) {
            h1 = `Mitteilungen der Stadtverwaltung und Polizei zum Thema "${searchTerm}"`
            title = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtverwaltung und Polizei `
            metaDescription = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtverwaltung und Polizei St. Gallen. ${metaSuffix}`
        } else if (!hasSTME && !hasSTPO && hasKTME && hasKTVE) {
            h1 = `Mitteilungen und Vernehmlassungen des Kantons St. Gallen zum Thema "${searchTerm}"`
            title = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen und Vernehmlassungen des Kantons St. Gallen `
            metaDescription = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen und Vernehmlassungen des Kantons St. Gallen. ${metaSuffix}`
        } else if (hasSTME && hasSTPO && hasKTME && !hasKTVE) {
            h1 = `Mitteilungen der Stadtverwaltung, Polizei und Kanton zum Thema "${searchTerm}"`
            title = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtverwaltung, Polizei und Kanton`
            metaDescription = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtverwaltung, Polizei und Kanton St. Gallen. ${metaSuffix}`
        } else if (hasSTME && hasSTPO && !hasKTME && hasKTVE) {
            h1 = `Mitteilungen der Stadtverwaltung, Polizei und Vernhemlassungen des Kantons zum Thema "${searchTerm}"`
            title = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtverwaltung und Polizei sowie Vernehmlassungen`
            metaDescription = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtverwaltung und Polizei sowie Vernhemlassungen des Kantons St. Gallen. ${metaSuffix}`
        } else if (!hasSTME && hasSTPO && hasKTME && hasKTVE) {
            h1 = `Mitteilungen der Stadtpolizei und Vernehmlassungen des Kantons St. Gallen zum Thema "${searchTerm}"`
            title = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtpolizei und Vernehmlassungen des Kantons St. Gallen `
            metaDescription = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtpolizei und Vernehmlassungen des Kantons St. Gallen. ${metaSuffix}`
        } else if (hasSTME && !hasSTPO && hasKTME && hasKTVE) {
            h1 = `Mitteilungen der Stadtverwaltung und Vernehmlassungen des Kantons St. Gallen zum Thema "${searchTerm}"`
            title = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtverwaltung und Vernehmlassungen des Kantons St. Gallen `
            metaDescription = `Suchergebnisse zum Begriff "${searchTerm}" in Mitteilungen der Stadtverwaltung und Vernehmlassungen des Kantons St. Gallen. ${metaSuffix}`
        } else {
            const remainingCats = contentCategoryBySearchLocationParam(params.searchLocation)
            h1 = `${remainingCats?.map((it, ind) => `${ind !== 0 ? ' und ' : ''} ${plu[it]}`).toString()?.replace(',', '')} zum Thema "${searchTerm}"`
            title = `Suchergebnisse zum Begriff "${searchTerm}" in ${remainingCats?.map((it, ind) => `${ind !== 0 ? ' und ' : ''} ${plu[it]}`).toString()?.replace(',', '')}`
            metaDescription = `Suchergebnisse zum Begriff "${searchTerm}" in ${remainingCats?.map((it, ind) => `${ind !== 0 ? ' und ' : ''} ${plu[it]}`).toString()?.replace(',', '')} ${metaSuffix}`
        }
    }

    return {
        h1,
        title,
        metaDescription
    }
}

/**
 * for other dynamic pages; returns text fragments for meta data by params
 */
export const textAndMetasForFeedRoutesByParams = (params: Params) => {
    const {
        ROUTE_FRAGMENTS: { KANTON, STADT, MITTEILUNGEN, VERNEHMLASSUNGEN, POLIZEI }
    } = PUBLIC_CONFIG
    const { section, category, pageNum } = params

    let title = ''
    let h1 = ''
    let metaDescription = ''
    const seite = pageNum ? ` | Seite ${pageNum}` : ''

    if (section === KANTON) {
        if (category === MITTEILUNGEN) {
            title = `Medienmitteilungen Kanton St.Gallen${seite}`
            h1 = `Medienmitteilungen Kanton St.Gallen${seite}`
            metaDescription = `News aus dem Kanton St.Gallen: Newsfeed mit Medienmitteilungen des Kantons St.Gallen im Überblick${seite}`
        } else if (category === VERNEHMLASSUNGEN) {
            title = `Vernehmlassungen Kanton St.Gallen${seite}`
            h1 = `Vernehmlassungen Kanton St.Gallen${seite}`
            metaDescription = `News aus dem Kanton St.Gallen: Newsfeed mit Vernehmlassungen des Kantons St.Gallen im Überblick${seite}`
        } else if (!category) {
            title = `Medienmitteilungen und Vernehmlassungen des Kantons St.Gallen${seite}`
            h1 = `Medienmitteilungen und Vernehmlassungen des Kantons St.Gallen${seite}`
            metaDescription = `News aus Stadt und Kanton St.Gallen: Newsfeed mit Vernehmlassungen und Medienmitteilungen des Kantons St.Gallen im Überblick${seite}`
        }
    } else if (section === STADT) {
        if (category === POLIZEI) {
            title = `Mitteilungen der Stadtpolizei St.Gallen${seite}`
            h1 = `Mitteilungen der Stadtpolizei St.Gallen${seite}`
            metaDescription = `News aus der Stadt St.Gallen: Newsfeed mit Medienmitteilungen des Polizei St.Gallen im Überblick${seite}`
        } else if (category === MITTEILUNGEN) {
            title = `Medienmitteilungen der Stadt St.Gallen${seite}`
            h1 = `Medienmitteilungen der Stadt St.Gallen${seite}`
            metaDescription = `News aus der Stadt St.Gallen: Newsfeed mit Medienmitteilungen der Stadt St.Gallen im Überblick${seite}`
        } else if (!category) {
            title = `Mitteilungen der Stadt und Polizei St.Gallen${seite}`
            h1 = `Mitteilungen der Stadt und Polizei St.Gallen${seite}`
            metaDescription = `News aus der Stadt St.Gallen: Newsfeed mit Medienmitteilungen der Polizei und Stadt St.Gallen im Überblick${seite}`
        }
    }

    return {
        h1,
        title,
        metaDescription
    }
}


export const metasAndTitlesForRatsinfoFeedRoutes = (
    pageNum: string | undefined,
    data: { keywordSearchParam: string | null },
    dict_regular: TextsAndMetas,
    dict_search: TextsAndMetas
) => {
    const optionalPageSuffix = pageNum ? ` | ${Seite} ${pageNum}` : ''

    if (data?.keywordSearchParam) {
        return {
            title: dict_search.title.replace(PLACEHOLDER_KEYWORD, data.keywordSearchParam) + optionalPageSuffix,
            metaDescription: dict_search.metaDescription.replace(PLACEHOLDER_KEYWORD, data.keywordSearchParam) + optionalPageSuffix,
            h1: dict_search.h1.replace(PLACEHOLDER_KEYWORD, data.keywordSearchParam) + optionalPageSuffix
        }
    } else {
        return {
            title: dict_regular.title + optionalPageSuffix,
            metaDescription: dict_regular.metaDescription + optionalPageSuffix,
            h1: dict_regular.h1 + optionalPageSuffix
        }
    }
}