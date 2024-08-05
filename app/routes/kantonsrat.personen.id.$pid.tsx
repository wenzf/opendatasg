import { HeadersFunction, json, LoaderFunction, MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import PeopleItem from "~/components/forPages/people/PeopleItem";
import NoResponse from "~/components/generics/NoResponse";
import { PUBLIC_CONFIG } from "~/config";
import { BACKEND_CONFIG } from "~/config/backend.server";
import { APIRatsinfoPeopleFull } from "~/types/ratsinfoAPI";
import { removeTrailingSlash } from "~/utils/misc";


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.KANTONSRAT_PERSONEN_ITEM
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
        { title: `Kantonsrat St.Gallen | ${data.item.first_name} ${data.item.last_name}` },
        { name: "description", content: `Kontaktdaten, Aktivitäten und Mitgliedschaften von ${data.item.first_name} ${data.item.last_name} in Verbindung mit dem Kantonsrat St.Gallen.` },
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
    const { DATA_API: { ENDPOINTS: { RATSINFO } } } = BACKEND_CONFIG
    const { pid } = params;

    try {
        const itemRaw = await fetch(RATSINFO + '/people/' + pid);
        const item: APIRatsinfoPeopleFull = await itemRaw.json()

        if (item) {
            return json({ item }, {
                headers: {
                    "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
                }
            })
        } else {
            return json({ item: null })
        }
    } catch {
        return json(null, { status: 404 })
    }
}


export default function PersonenItem() {
    const loaderData = useLoaderData<typeof loader>()

    return (
        <>
            {loaderData?.item ? <PeopleItem item={loaderData.item} /> : <NoResponse />}
        </>
    )
}