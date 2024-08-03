export const PUBLIC_CONFIG = Object.freeze({
    SITE_NAME: 'OpenData St. Gallen',
    DOMAIN_NAME: 'https://odsg.ch',
    DOMAIN_NAME_DEV: 'http://localhost:3333',
    ROUTE_FRAGMENTS: {
        MITTEILUNGEN: 'mitteilungen',
        VERNEHMLASSUNGEN: 'vernehmlassungen',
        KANTON: 'kanton',
        STADT: 'stadt',
        SUCHE: 'suche',
        SEITE: 'seite',
        POLIZEI: 'polizei',
        NOT_FOUND: '/404',
        ARTIKEL: 'artikel',
        BEGRIFF: 'begriff',
        IMPRESSUM: 'impressum',
        KANTONSRAT: 'kantonsrat',
        GESCHAEFT: 'geschaefte',
        ABSTIMMUNG: 'abstimmungen',
        PERSONEN: 'personen',
        GREMIEN: 'gremien',
        SEARCH_PARAM_FRAGMENT: '?search='
    },
    RATSINFO_ROOT: 'https://www.ratsinfo.sg.ch',
    ENTRIES_SHOWN_IN_FEED: 10,
    ENTRIES_SHOWN_IN_RATSINFO: 50,
    STYLES: {
        FEED: {
            IMAGE_MAX_WIDTH_LOW: 420,
            IMAGE_MAX_WIDTH_HIGH: 840
        },
        ARTICLE: {
            IMAGE_MAX_WIDTH_LOW: 512,
            IMAGE_MAX_WIDTH_HIGH: 1240
        }
    },
    MASONRY_CONFIG: {
        columns: [1, 2, 3, 4],
        gap: [12, 16, 16, 16],
        media: [512, 768, 1024, 1240]
    },
    PAGE_HANDLES: {
        HOME: 'HOME',
        SEARCH: 'SEARCH',
        ARTICLE: 'ARTICLE',
        FEED: 'FEED',
        IMPRESSUM: 'IMPRESSUM',
        KANTONSRAT_MAIN: 'KANTONSRAT_MAIN',
        KANTONSRAT_ABSTIMMUNGEN_FEED: 'KANTONSRAT_ABSTIMMUNGEN_FEED',
        KANTONSRAT_ABSTIMMUNGEN_ITEM: 'KANTONSRAT_ABSTIMMUNGEN_ITEM',
        KANTONSRAT_GESCHAEFT_ITEM: 'KANTONSRAT_GESCHAEFT_ITEM',
        KANTONSRAT_GESCHAEFT_FEED: 'KANTONSRAT_GESCHAEFT_FEED',
        KANTONSRAT_GREMIEN_FEED: 'KANTONSRAT_GREMIEN_FEED',
        KANTONSRAT_GREMIEN_ITEM: 'KANTONSRAT_GREMIEN_ITEM',
        KANTONSRAT_PERSONEN_ITEM: 'KANTONSRAT_PERSONEN_ITEM',
        KANTONSRAT_PERSONEN_FEED: 'KANTONSRAT_PERSONEN_FEED',

    },
    DEFAULT_OG_IMAGE(): string {
        return PUBLIC_CONFIG.DOMAIN_NAME + '/_static/icons/android-chrome-512x512.png'
    }
})


export const NS_CONTENT_CATEGORY = Object.freeze({
    KTME: "KTME",
    KTVE: "KTVE",
    STPO: "STPO",
    STME: "STME"
})


export const NS_CONTENT_ITEM_PUBLIC = Object.freeze({
    title: "title",
    intro: "intro",
    body: "body",
    published: "published",
    content_category: "content_category",
    original_link: "orginal_link",
    image: "image",
    views_human: "views_human",
    views_bot: "views_bot",
    image_url: "image_url",
    image_dimensions: "image_dimensions",
    color_summary: "color_summary",
    alt_description: "alt_description",
    canonical: "canonical"
})


export const ThemeOptions = {
    light: 'light',
    dark: 'dark'
}

// wahlkreise / gemeinden
export const subDistrictsByDistricts = Object.freeze({
    [`St.Gallen`]: ["St.Gallen", "Eggersriet", "Wittenbach", "Häggenschwil", "Muolen", "Waldkirch", "Andwil", "Gossau", "Gaiserwald"],
    Rorschach: ["Mörschwil", "Goldach", "Steinach", "Berg", "Tübach", "Untereggen", "Rorschacherberg", "Rorschach", "Thal"],
    Rheintal: ["Rheineck", "St.Margrethen", "Au", "Berneck", "Balgach", "Diepoldsau", "Widnau", "Rebstein", "Marbach", "Altstätten", "Eichberg", "Oberriet", "Rüthi"],
    Werdenberg: ["Sennwald", "Gams", "Grabs", "Buchs", "Sevelen", "Wartau"],
    Sarganserland: ["Sargans", "Vilters-Wangs", "Bad Ragaz", "Pfäfers", "Mels", "Flums", "Walenstadt", "Quarten"],
    [`See-Gaster`]: ["Amden", "Weesen", "Schänis", "Benken", "Kaltbrunn", "Gommiswald", "Uznach", "Schmerikon", "Rapperswil-Jona", "Eschenbach"],
    Toggenburg: ["Wildhaus-Alt St.Johann", "Nesslau", "Ebnat-Kappel", "Wattwil", "Lichtensteig", "Neckertal", "Bütschwil-Ganterschwil", "Lütisburg", "Mosnang", "Kirchberg"],
    Wil: ["Jonschwil", "Oberuzwil", "Uzwil", "Flawil", "Degersheim", "Wil", "Zuzwil", "Oberbüren", "Niederbüren", "Niederhelfenschwil"]
})

