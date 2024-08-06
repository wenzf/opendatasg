
import { HeadersFunction, json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import GroupItem from "~/components/forPages/group/GroupItem";
import NoResponse from "~/components/generics/NoResponse";
import { PUBLIC_CONFIG } from "~/config";
import { BACKEND_CONFIG } from "~/config/backend.server";
import { removeTrailingSlash } from "~/utils/misc";


export const handle = {
    page: PUBLIC_CONFIG.PAGE_HANDLES.KANTONSRAT_GREMIEN_ITEM
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
        { title: `Kantonsrat St.Gallen | ${data.item.title}` },
        {
            name: "description",
            content: `Kantonsrat St.Gallen ${data.item.type.title}: ${data.item.title}`
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
    const { DATA_API: { ENDPOINTS: {
        RATSINFO, RATSINFO_FRAGMENT_GROUPS, RATSINFO_FRAGMENT_PEOPLE } }
    } = BACKEND_CONFIG
    const { gid } = params;

    try {
        const itemCall = fetch(RATSINFO + RATSINFO_FRAGMENT_GROUPS + '/' + gid);
        const peopleCall = fetch(RATSINFO + `${RATSINFO_FRAGMENT_PEOPLE}?committee=${gid}&ordering=last_name`);
        const [itemRaw, peopleRaw] = await Promise.all([itemCall, peopleCall])
        const item = await itemRaw.json()
        const people = await peopleRaw.json()

        if (item) {
            return json({ item, people: people }, {
                headers: {
                    "Cache-Control": `max-age=${PUBLIC_CONFIG.RESPONSE_CACHE_TIME_IN_S}`,
                }
            })
        } else {
            return json({ item: null, people: [] })
        }
    } catch {
        return json(null, { status: 404 })
    }
}


export default function GroupItemPage() {
    const loaderData = useLoaderData<typeof loader>()

    return (
        <>
            {loaderData?.item ? <GroupItem item={loaderData.item} people={loaderData.people} /> : <NoResponse />}
        </>
    )
}