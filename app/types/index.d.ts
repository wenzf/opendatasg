import { NS_CONTENT_CATEGORY } from "~/config"
import { NS_DDB_INDEX_KEYS } from "~/config/backend.server"

/**
 * GENERAL
 */

export type AsyncSuccess = { success: boolean }

export type Theme = "light" | "dark" | ""


/**
 * DB
 */

export type ContentCategoryKeys = keyof typeof NS_CONTENT_CATEGORY

export type DdbIndexKeys = keyof typeof NS_DDB_INDEX_KEYS

export type DdbIndex = Record<ContentCategoryKeys, Record<DdbIndexKeys, number>, { last_reset: number }>

export type DbUpdateIndexProps = {
    category: ContentCategoryKeys
    update: [DdbIndexKeys, number][]
}


/**
 * CONTENT
 */

export interface ContentImage {
    image_url: string,
    image_dimensions: number[]
    color_summary: string[]
    alt_description: string
}

export type ImageHTMLProps = {
    image: ContentImage | null
    use_case: "thumbnail" | "article"
    position: number
}

export interface ContentItemPublic {
    title: string
    intro: string
    body: string
    published: number
    content_category: ContentCategoryKeys
    original_link: string
    image: ContentImage | null
    views_human: number
    views_bot: number
    canonical: string
}

export interface ContentItemInternal extends ContentItemPublic {
    index_position: number // position API DB for pagination
}

export interface BreadCrumbBase {
    label: string
    path?: string
}

export interface BreadCrumbFragmentProp extends BreadCrumbBase {
    isLast: boolean
    position: number
}

export interface TextsAndMetas {
    h1: string
    title: string
    metaDescription: string
}



/**
 * KANTONSRAT: GESCHAEFTE
 */

/*
export interface APIResponseKantonsratGeschaefte {
    total_count: number,
    results: APIKantonsratGeschaeftResult[]
}

*/
/*
export interface APIKantonsratGeschaeftBase {
    geschafts_id: string // "6116"
    komitee_id: number,
    geschaftsnummer: string,
    geschaftstitel: string,
    geschaftsart_id: number,
    geschaftsart: string,
    federfuhrung_id: number,
    eroffnung: string,
    abschluss: null | string,
    letzte_anderung: string, // date
    // link_zu_dokumenten: string, //"https://www.ratsinfo.sg.ch/api/businesses/6116/published_documents",
    // link_zu_beteiligungen: string //"https://www.ratsinfo.sg.ch/api/businesses/6116/business_participations"
}
    */
/*
export interface APIKantonsratGeschaeftResult extends APIKantonsratGeschaeftBase {
    link_zu_dokumenten: string, //"https://www.ratsinfo.sg.ch/api/businesses/6116/published_documents",
    link_zu_beteiligungen: string //"https://www.ratsinfo.sg.ch/api/businesses/6116/business_participations"
}

*/


/*

export interface APIRatsinfoBusinessesResult {
    id: number // 6119,
    is_confidential: boolean // false,
    is_urgent: boolean // false,
    has_signature_sheet: boolean // false,
    committee_id: number// 468,
    number: string //61.24.43",
    title: string // "Flade soll eine öffentlich-rechtliche Schule bleiben",
    type_id: number //3,
    responsible_id: number // 501,
    begin_date: string //"2024-07-23",
    end_date: null | string,
    touched: string // "2024-07-23T15:16:20.512293+02:00"    

}

*/
/*
export interface APIRatsinfoMeetingBase {
    additional_title: string // "Sommersession"
    begin: string // "2024-06-03T08:00:00Z",
    can_close: boolean // false
    can_delete: boolean // false
    can_edit: boolean // false
    can_generate_agenda_item_sequence_numbers: boolean // false
    can_reopen: boolean // false
    can_reset_agenda_item_sequence_numbers: boolean // false
    committee_id: number // 468
    end: string // "2024-06-04T13:00:00Z"
    gever_dossier_url: string //""
    id: number // 98
    is_published: boolean // false
    location: string // ""
    period_id: null | string | number
    presidency_id: null | string | number
    protocol_document: null | unknown
    protocol_start_page_number: null | number
    remarks: string // ""
    remarks_bottom: string // ""
    secretary_id: null | unknown
    sequence_number: null | number
    status: string // "completed"
    status_display: string // "Durchgeführt"
    title: string // "Session des Kantonsrates vom 3. und 4. Juni 2024, Sommersession"
}

*/

/*
export interface APIRatsInfoBusinessStatement {
    audio_file: null | string
    meeting: APIRatsinfoMeetingBase
    person: null
    stated_at: string // "2024-06-04T14:08:21.200000+02:00"
    text: string // "<p>Der Kantonsrat tritt mit 69:41 Stimmen nicht auf die Motion ein.</p>"
    type: string // "resolution"
    type_display: string // "Beschluss"
}

*/
/*
export interface APIRatsinfoBusinessesExtended extends APIRatsinfoBusinessesResult {
    dokumente: APIKantonsratGeschaeftResultDokumente[]
    beteiligungen: APIKantonsratGeschaeftBeteiligungen[]
    abstimmungen: APIKantonsratAbstimmungenResult[]
    is_public: boolean
    groups: Record<string, APIRatsinfoGroups>
    statements: APIRatsInfoBusinessStatement[]
    topic_id: number
}
    */


// https://www.ratsinfo.sg.ch/api/businesses?search=&date_max&ordering=date_max&page=1&page_size=50
/*
export interface APIRatsinfoBusinesses {
    count: number //  6058,
    next: string | null // "https://www.ratsinfo.sg.ch/api/businesses?date_max=&ordering=date_max&page=2&page_size=50&search=",
    previous: null | srring //,
    results: APIRatsinfoBusinessesResult[]

}

*/

/*
export interface APIRatsinfoVotingsResult {
    id: number // 6665,
    title: string // "Eventualantrag Müller-Lichtensteig / Mattle-Altstätten zu Ziff. 2 Abs. 3",
    agenda_item: {
        id: number // 5992,
        title: string // "Kantonsratsbeschluss über das 18. Strassenbauprogramm für die Jahre 2024 bis 2028 (Titel der Botschaft: Verkehrliche Entwicklung im Kanton St.Gallen 2024 bis 2028)",
        meeting: {
            additional_title: string // "Herbstsession",
            id: number // 47,
            title: string // "Session des Kantonsrates vom 18. bis 20. September 2023, Herbstsession"
        },
        business: {
            id: number // 5751,
            number: string // "36.23.02",
            title: string //Kantonsratsbeschluss über das 18. Strassenbauprogramm für die Jahre 2024 bis 2028 (Titel der Botschaft: Verkehrliche Entwicklung im Kanton St.Gallen 2024 bis 2028)",
            type: {
                id: number // 11,
                title: string // "KR Verwaltungsgeschäft"
            }
        }
    },
    date: string// "2023-09-20T14:09:39.600000+02:00",
    is_public: boolean // false
}


export interface APIRatsinfoVotings {
    count: number // 3908,
    next: string // "https://www.ratsinfo.sg.ch/api/votings?date_max=&ordering=date_max&page=5&page_size=50&search=",
    previous: string // "https://www.ratsinfo.sg.ch/api/votings?date_max=&ordering=date_max&page=3&page_size=50&search=",
    results: APIRatsinfoVotingsResult[]
}

*/

// link_zu_dokumenten

/*
export interface APIKantonsratGeschaeftResultDokumente {
    color_code: string,
    document_type_name: string,
    file: string, // "/media/documents/published/7c1650cb-0405-4648-b5a0-7ebed0a16323.pdf",
    id: number, // 24419,
    published_date: string,
    signed_file: string, // https://www.ratsinfo.sg.ch/ "/media/documents/published/signed/7c1650cb-0405-4648-b5a0-7ebed0a16323.pdf",
    target_type_id: number,
    title: string // "Botschaft und Entwurf der Regierung vom 18. Juni 2024"   
}
*/
// link_zu_beteiligungen

/*
export interface APIKantonsratGeschaeftBeteiligungen {
    id: number,// 8089,
    created: string,
    modified: string,
    title: string, // "Erstunterzeichner/-in - Sulzer-Wil",
    content_type: "person" | "group",
    uid: string, // "1af57fa6-4027-4096-b62b-2a6a8e80c3aa",
    target_id: number, // 673,
    target_type_id: number, // 33,
    business_id: number, // 6111,
    type_id: number // 5
}

*/
/*
export interface APIKantonsratAbstimmungenResult {
    abstimmungs_id: string,// "6817",
    abstimmungsgegenstand: string, // "Gesamtabstimmung",
    sitzungs_id: number, //98,
    sitzungstitel: string, //"Session des Kantonsrates vom 3. und 4. Juni 2024, Sommersession",
    geschafts_id: string, //"6053",
    geschaftsnummer: string, //"34.24.02",
    geschaftstitel: string, //"Kantonsratsbeschluss über Beiträge aus dem Lotteriefonds 2024 (I)",
    geschaftsart_id: number, // 11,
    geschaftsart: string, //"KR Verwaltungsgeschäft",
    abstimmungsdatum: string, //"2024-06-04T11:11:24+00:00",
    link_zu_abstimmungsergebnissen: string, //"https://www.ratsinfo.sg.ch/api/votings/6817"
}
    */
/*
export interface APIResultKantonsratAbstimmungen {
    total_count: number
    results: APIKantonsratAbstimmungenResult[]
}

*/
/*
export interface APIKantonsratGeschaeftData extends APIKantonsratGeschaeftBase {
    dokumente: APIKantonsratGeschaeftResultDokumente[]
    beteiligungen: APIKantonsratGeschaeftBeteiligungen[]
    abstimmungen: APIKantonsratAbstimmungenResult[]
}

*/

/**
 * KANTONSRAT: ABSTIMMUNG
 */

/*
export interface Ballot {
    id: number // 767435,
    vote: string // "yes" | "no" | "absent" | "abstention"
    vote_display: string // "Ja" | "Nein" | "Nicht abgestimmt",
    person_political_name: string // "Züger-Niederbüren",
    person_id: string // "880",
    person_election_district_title: string // "Wil",
    person_party: string // "FDP"
}

export interface BallotModified extends Ballot {
    sub_district: string
    person_name: string
}

export type MeaningOf = "Zustimmung" | "Ablehnung"
*/

/*
export interface APIKantonsratAbstimmung {
    id: number // 6817,
    title: string // "Gesamtabstimmung",
    agenda_item_id: number // 6379,
    date: string // "2024-06-04T11:11:24.500000+02:00",
    created: string // "2024-06-04T09:16:15.463925Z",
    meaning_of_yes: string// MeaningOf // "Zustimmung" | "Ablehnung",
    meaning_of_no: string// MeaningOf // "Ablehnung" | "Zustimmung",
    results: {
        yes: number // 102,
        no: number // 0,
        abstention: number // 0,
        absent: number // 18
    },
    result_string: string // "J:102, N:0, E:0, NA:18",
    ballots: Ballot[] | BallotModified[]
    business: {
        id: number // 6053,
        title: string // "Kantonsratsbeschluss über Beiträge aus dem Lotteriefonds 2024 (I)",
        number: string // "34.24.02",
        begin_date: string // "2024-04-24",
        end_date: null | string,
        process_state_id: null | string,
        type_id: number // 11,
        gever_dossier_url: string // "",
        assignee_id: null | string | number
    },
    is_public: boolean
}
*/

/*
export interface ABPIAbstimmungFeedItem {

    id: number // 6820,
    title: string // "Schlussabstimmung",
    agenda_item: {
        id: number // 6378,
        title: string // "Einführungsgesetz zum Bundesgesetz über die Förderung der Ausbildung im Bereich der Pflege",
        meeting: {
            additional_title: string // "Sommersession",
            id: number // 98,
            title: string //"Session des Kantonsrates vom 3. und 4. Juni 2024, Sommersession"
        },
        business: {
            id: number // 6010,
            number: string //"22.24.02",
            title: string // "Einführungsgesetz zum Bundesgesetz über die Förderung der Ausbildung im Bereich der Pflege",
            type: {
                id: number // 4,
                title: string // "KR Gesetzgebungsgeschäft"
            }
        }
    },
    date: string // "2024-06-04T14:23:14.700000+02:00",
    is_public: boolean // false

}

*/

/*

export interface APIRatsinfoGroups {

    ava_systems: [],
    id: number // 505,
    title: string // "Sicherheits- und Justizdepartement",
    abbreviation: string // "",
    type: {
        gever_business_repositoryfolder_url: string // "",
        gever_meetings_repositoryfolder_url: string // "",
        id: number // 15,
        is_coalition: boolean // false,
        may_take_responsibility: boolean // true,
        order: number // 14,
        show_in_committee_switcher: boolean // false,
        show_supplied_business: boolean // false,
        title: string // "Departement"
    },
    type_id: number // 15,
    is_active: boolean // true,
    is_default: boolean // false,
    end_date: null | string // null,
    begin_date: string // "2008-01-01T01:00:00+01:00",
    gever_business_repositoryfolder_url: string // "",
    gever_meetings_repositoryfolder_url: string // "",
    gever_meeting_preparation_repositoryfolder_url: string // "",
    is_allowed_to_vote_ava: boolean // false,
    can_manage_attendees: boolean // false,
    can_have_public_content: boolean // false,
    disable_traktandenliste_tree: boolean // false,
    meeting_begin_time: string // "08:30:00",
    can_enable_recusal: boolean // false,
    urgent_flag_label: string // "Eilt",
    urgent_flag_label_display: string // "Eilt",
    public_login_url: string // "",
    business_participations: APIRatsinfoBusinessesResult[]

}

*/

/**
 * View Snippets
 */

export type RatsinfoGroupView = {

    id: number,
    title: string,
    type_title: string
}


/**
 * utils
 */

export type PrettyMarkupModificationRule = {
    selector: string
    replacement: string
    extractText?: boolean
    extractAlt?: boolean
    maxLenReplaceText?: number
};


export type BallotFrequencies = Record<
    string,
    {
        val: (string | number)
        count: number
        yes: number
        no: number
        absent: number
        abstention: number
    }[]
>
