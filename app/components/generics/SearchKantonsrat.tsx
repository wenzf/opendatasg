import { useNavigate } from "@remix-run/react"
import { BaseSyntheticEvent, useRef } from "react";
import SearchIconSVG from "~/resources/icons/SearchIconSVG";

export default function SearchKantonsrat({ basePath, label, className }: {
    basePath: string
    label: string
    className: string
}) {

    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null)

    const onDoSearch = (e: BaseSyntheticEvent) => {
        e.preventDefault()
        if (!inputRef.current?.value) return
        const keyword = inputRef.current?.value
        inputRef.current.value = ''
        navigate(basePath + decodeURIComponent(`?search=${keyword}`))
    }

    return (
        <form className={className} itemProp="potentialAction" itemScope itemType="https://schema.org/SearchAction">
            <meta itemProp="target" content={`https://odsg.ch${basePath}?search={search_term}`} />
            <label htmlFor={`l_${label}`}>{label}</label>
            <input required aria-required className="inp1" ref={inputRef} type="search" id={`l_${label}`} itemProp="query-input" name="search_term" />
            <button className="btn2" type="submit" onClick={(e) => onDoSearch(e)}>
                <SearchIconSVG width={24} height={24} aria-label="suche" />
            </button>
        </form>

    )
}