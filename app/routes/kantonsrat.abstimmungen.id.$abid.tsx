import { HeadersFunction, json, LoaderFunction, MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { BACKEND_CONFIG } from "~/config/backend.server"
import { ballotDataAndStats } from "~/utils/forData"
import { PUBLIC_CONFIG, subDistrictsByDistricts } from "~/config"
import { colorsAndPercentageByFrequencies } from "~/utils/forMaps"
import VotingItem from "~/components/forPages/voting/VotingItem"
import { removeTrailingSlash } from "~/utils/misc"
import NoResponse from "~/components/generics/NoResponse"


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.KANTONSRAT_ABSTIMMUNGEN_ITEM
}


export const headers: HeadersFunction = () => {
    return {
        "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
    };
};


export const meta: MetaFunction<typeof loader> = ({ location, data }) => {
    if (!data?.item) return []
    const { DOMAIN_NAME, DEFAULT_OG_IMAGE } = PUBLIC_CONFIG
    const { pathname } = location;

    return [
        { title: `${data.item.title}: ${data.item.business.title}` },
        {
            name: "description",
            content: `Abstimmung des Kantonsrates St.Gallen: ${data.item.business.title} (${data.item.title})`
        },
        {
            tagName: "link",
            rel: "canonical",
            href: DOMAIN_NAME + removeTrailingSlash(pathname),
        },
        {
            property: "og:image",
            content: DEFAULT_OG_IMAGE()
        }
    ]
}


export const loader: LoaderFunction = async ({ params }) => {
    const { DATA_API: { ENDPOINTS: { RATSINFO, RATSINFO_FRAGMENT_VOTINGS } } } = BACKEND_CONFIG
    const { abid } = params
    try {
        const abstimmungFromAPIRaw = await fetch(`${RATSINFO + RATSINFO_FRAGMENT_VOTINGS}/${abid}`) // .then((it) => it.json())
        const abstimmungFromAPI = await abstimmungFromAPIRaw.json()

        if (abstimmungFromAPI?.detail === 'Nicht gefunden') {
            return json({ item: null, frequencies: null, forMap: null })
        } else {
            const ballotsCopy = abstimmungFromAPI.ballots
            const { frequencies, modifiedBallots } = ballotDataAndStats(ballotsCopy)

            const regions = Object.keys(subDistrictsByDistricts)
            const districts = colorsAndPercentageByFrequencies(regions, frequencies.person_election_district_title)
            const forMap = { districts }

            const payload = { item: abstimmungFromAPI, frequencies, forMap, modifiedBallots }

            return json(payload, {
                headers: {
                    "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
                }
            })
        }
    } catch (e) {
        //   console.log({ e })
        return json(null, { status: 404 })
    }
}


export default function AbstimmungItemRoute() {
    const loaderData = useLoaderData<typeof loader>()

    return (
        <>
            {loaderData?.item ? <VotingItem item={loaderData.item} frequencies={loaderData.frequencies} forMap={loaderData.forMap} modifiedBallots={loaderData.modifiedBallots} /> : <NoResponse />}
        </>
    )
}