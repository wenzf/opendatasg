import { useEffect, useRef, useState } from "react"
import ArrowUpSVG from "~/resources/icons/ArrowUpSVG"

export default function ScrollToTopButton() {
    const [show, setShow] = useState(false)
    const limit = 1000

    const posYRef = useRef(0)

    const handleScroll = () => {
        if (typeof window === 'object') {
            const pos = window.scrollY
            if (pos > limit) {

                if (posYRef.current > pos) {
                    setShow(true)
                } else {
                    setShow(false)
                }
            } else {
                setShow(false)
            }
            posYRef.current = pos;
        }
    }

    const doScrollUp = () => {
        if (typeof window === 'object') {
            window.scroll(0, 0)
        }
    }

    useEffect(() => {
        if (typeof window === 'object') {
            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <div className={`scroll_up_btn${show ? ' show_btn' : ''}`}>
            <button disabled={!show} aria-disabled={!show} className="btn3" onClick={() => doScrollUp()}>
                <ArrowUpSVG width={36} heigth={36} aria-label="Zum Anfang scrollen" />
            </button>
        </div>
    )
}