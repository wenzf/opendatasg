import { createPath, useNavigate, useParams } from "@remix-run/react";
import { BaseSyntheticEvent, useRef } from "react";
import * as Checkbox from '@radix-ui/react-checkbox';
import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config";
import texts from "~/texts";
import CheckIconSVG from "~/resources/icons/CheckIconSVG";
import { contentCategoryBySearchLocationParam } from "~/utils/forContent";
import SearchIconSVG from "~/resources/icons/SearchIconSVG";


/**
 * markup and logic for site search by content categories
 */
export default function SearchChooseCats() {
    const textInputRef = useRef<HTMLInputElement>(null)
    const checkKTME = useRef<typeof Checkbox.Root.arguments>(null)
    const checkKTVE = useRef<typeof Checkbox.Root.arguments>(null)
    const checkSTPO = useRef<typeof Checkbox.Root.arguments>(null)
    const checkSTME = useRef<typeof Checkbox.Root.arguments>(null)
    const navigate = useNavigate()
    const { searchLocation } = useParams()
    const contentTypes = contentCategoryBySearchLocationParam(searchLocation)
    const { KTME, KTVE, STPO, STME } = texts.labels.content_category.plu
    const { ROUTE_FRAGMENTS: { SUCHE, BEGRIFF } } = PUBLIC_CONFIG

    const onDoSearch = (e: BaseSyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (textInputRef.current?.value
            && checkKTME.current
            && checkKTVE.current
            && checkSTPO.current
            && checkSTME.current
        ) {
            let path = `/${SUCHE}/`
            const ktme = checkKTME.current
            const ktve = checkKTVE.current
            const stpo = checkSTPO.current
            const stme = checkSTME.current
            const checkArr = [ktme, ktve, stpo, stme]

            if (checkArr.every((i) => i.dataset.state === 'checked')) {
                path += `${BEGRIFF}/`
            } else {
                for (let i = 0; i < checkArr.length; i += 1) {
                    if (checkArr[i].dataset.state === 'checked') path += `${checkArr[i].id}+`
                }
                path = path.slice(0, -1)
                path += `/${BEGRIFF}/`
            }
            path += textInputRef.current?.value?.toLowerCase()
            textInputRef.current.value = ""
            const navigateTo = createPath({ pathname: path })
            navigate(navigateTo)
        }
    }

    return (
        <form onSubmit={onDoSearch}>
            <div className="cbx_frame">
                <div className="rdx_cbx_fr">
                    <label htmlFor="ktme">{KTME}</label>
                    <Checkbox.Root
                        className="rdx_cbx_root"
                        defaultChecked={contentTypes === null || contentTypes.includes(NS_CONTENT_CATEGORY.KTME)}
                        ref={checkKTME}
                        id="ktme"
                        name="ktme"
                    >
                        <Checkbox.Indicator className="rdx_cbx_ind">
                            <CheckIconSVG />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                </div>
                <div className="rdx_cbx_fr">
                    <label htmlFor="ktve">{KTVE}</label>
                    <Checkbox.Root
                        className="rdx_cbx_root"
                        ref={checkKTVE}
                        defaultChecked={contentTypes === null || contentTypes.includes(NS_CONTENT_CATEGORY.KTVE)}
                        id="ktve"
                        name="ktve"
                    >
                        <Checkbox.Indicator className="rdx_cbx_ind">
                            <CheckIconSVG />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                </div>
                <div className="rdx_cbx_fr">
                    <label htmlFor="stpo">{STPO}</label>
                    <Checkbox.Root
                        className="rdx_cbx_root"
                        defaultChecked={contentTypes === null || contentTypes.includes(NS_CONTENT_CATEGORY.STPO)}
                        ref={checkSTPO}
                        id="stpo"
                        name="stpo"
                    >
                        <Checkbox.Indicator className="rdx_cbx_ind">
                            <CheckIconSVG />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                </div>
                <div className="rdx_cbx_fr">
                    <label htmlFor="stme">{STME}</label>
                    <Checkbox.Root
                        className="rdx_cbx_root"
                        defaultChecked={contentTypes === null || contentTypes.includes(NS_CONTENT_CATEGORY.STME)}
                        ref={checkSTME}
                        id="stme"
                        name="stme"
                    >
                        <Checkbox.Indicator className="rdx_cbx_ind">
                            <CheckIconSVG />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                </div>
            </div>
            <br />
            <div className="a_search" style={{ maxWidth: '512px'}}>
                <label htmlFor="search_by_cat">Suche</label>
                <input required aria-required className="inp1" id="search_by_cat" type="search" ref={textInputRef} />
                <button type="submit" className="btn2">
                    <SearchIconSVG width={24} height={24} aria-label="Suche bestätigen" />
                </button>
            </div>
        </form>
    )
}