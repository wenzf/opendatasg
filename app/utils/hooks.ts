import {  useMatches } from "@remix-run/react";


export const usePathHandle = () => {
    const matches = useMatches();
    if (!matches) return
    const match = matches.find((it) => it.handle);

    if (match?.handle) {
        // @ts-expect-error no type?!
        return match.handle?.page
    }

    return null
}


export const useLoaderDataByPageHandle = () => {
    const matches = useMatches()
    if (!matches) return
    const match = matches.find((it) => it.handle);
    if (match?.handle) {
        return match?.data
    }    
}