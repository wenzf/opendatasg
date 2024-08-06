import { SetStateAction } from "react"
import ThemeIconSVG from "~/resources/icons/ThemeIconSVG"
import { Theme } from "~/types"

/**
 * TODO: CHANGE TO STD REMIX COOKIE BASED THEME HANDLING
 * IN ORDER TO AVOID CONTENT FLASH
 */

type ThemeCompProps =  {
    themeSetter: (e: SetStateAction<Theme>) => void
    theme: Theme
    prefsDarkmode: boolean
}

/**
 *  toggle site theme
 */
export default function ThemeComp({ theme, themeSetter, prefsDarkmode }: 
    ThemeCompProps) {
    const onChangetheme = () => {
        themeSetter((prev) => prev === ''
            ? (prefsDarkmode ? 'light' : 'dark')
            : (prev === 'light' ? 'dark' : 'light')
        )
        if (typeof window === 'object') {
            window.localStorage.setItem('theme', theme === ''
                ? (prefsDarkmode ? 'light' : 'dark')
                : (theme === 'light' ? 'dark' : 'light')
            )
        }
    }

    return (
        <button className="btn2" type="button" onClick={() => onChangetheme()}>
            <ThemeIconSVG aria-label="helle / dunkle Farbe" width={33} height={33} />
        </button>
    )
}