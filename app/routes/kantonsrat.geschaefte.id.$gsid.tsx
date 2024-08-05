import { json, LoaderFunction, MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import BusinessItem from "~/components/forPages/business/BusinessItem"
import NoResponse from "~/components/generics/NoResponse"

import { PUBLIC_CONFIG } from "~/config"
import { BACKEND_CONFIG } from "~/config/backend.server"
import { removeTrailingSlash } from "~/utils/misc"
import { dataAPIRatstinfoGroups } from "~/utils/serverOnly/dataAPI/dataAPI.server"


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.KANTONSRAT_GESCHAEFT_ITEM
}

export const meta: MetaFunction<typeof loader> = ({ location, data }) => {
    if (!data?.item) return []
    const { DOMAIN_NAME, DEFAULT_OG_IMAGE } = PUBLIC_CONFIG

    const { pathname } = location;

    return [
        { title: `Geschäft ${data.item.number} des Kantonsrates St.Gallen` },
        { name: "description", content: "Geschäft des Kantonsrates St.Gallen: " + data?.item?.title },
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
    const { DATA_API: { ENDPOINTS: { RATSINFO, RATSINFO_FRAGMENT_BUSINESSES, RATSINFO_FRAGMENT_PUBLISHED_DOCUMENTS, RATSINFO_FRAGMENT_BUSINESSE_PARTICIPATION } } } = BACKEND_CONFIG
    const { gsid } = params

    try {
        const ratsInfoRoot = RATSINFO + RATSINFO_FRAGMENT_BUSINESSES + "/" + gsid + "/";
        const geschaeftFromApi = fetch(RATSINFO + RATSINFO_FRAGMENT_BUSINESSES + "/" + gsid).then((it) => it.json());
        const dokumenteFromApi = fetch(ratsInfoRoot + RATSINFO_FRAGMENT_PUBLISHED_DOCUMENTS).then((it) => it.json())
        const participationsFromApi = fetch(ratsInfoRoot + RATSINFO_FRAGMENT_BUSINESSE_PARTICIPATION).then((it) => it.json())
        const abstimmungenFromApi = fetch(ratsInfoRoot + 'votings').then((it) => it.json());
        const allResponses = await Promise.all([geschaeftFromApi, dokumenteFromApi, participationsFromApi, abstimmungenFromApi]);
        const [feedGeschaeft, dokumente, beteiligungen, feedAbstimmungen] = allResponses;
        const groups = await dataAPIRatstinfoGroups([feedGeschaeft], [
            ['committee_id'],
            ['responsible_id']])

        if (feedGeschaeft) {
            const item = { ...feedGeschaeft, dokumente, beteiligungen, abstimmungen: feedAbstimmungen, groups }
           
            return json({ item })
        } else {
            return json({ item: null })
        }
    } catch (r) {
        console.log({ r })
        return json(null, { status: 404 })
    }
}



export default function KantonsratGeschaeft() {
    const loaderData = useLoaderData<typeof loader>()

    return (
        <>
            {loaderData?.item ? <BusinessItem item={loaderData.item} /> : <NoResponse />}
        </>
    )
}