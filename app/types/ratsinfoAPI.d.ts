/**
 * BUSINESS / GESCHAEFT
 */

// link_zu_dokumenten
export interface APIRatsinfoGeschaeftResultDokumente {
    color_code: string
    document_type_name: string
    file: string
    id: number
    published_date: string
    signed_file: string
    target_type_id: number
    title: string
}

// link_zu_beteiligungen
export interface APIRatsinfoGeschaeftBeteiligungen {
    id: number
    created: string
    modified: string
    title: string
    content_type: "person" | "group"
    uid: string
    target_id: number
    target_type_id: number
    business_id: number
    type_id: number
}

export interface APIRatsInfoBusinessStatement {
    audio_file: null | string
    meeting: APIRatsinfoMeetingBase
    person: null
    stated_at: string
    text: string
    type: string
    type_display: string
}

export interface APIRatsinfoMeetingBase {
    additional_title: string
    begin: string
    can_close: boolean
    can_delete: boolean
    can_edit: boolean
    can_generate_agenda_item_sequence_numbers: boolean
    can_reopen: boolean
    can_reset_agenda_item_sequence_numbers: boolean
    committee_id: number
    end: string
    gever_dossier_url: string
    id: number
    is_published: boolean
    location: string
    period_id: null | string | number
    presidency_id: null | string | number
    protocol_document: null | unknown
    protocol_start_page_number: null | number
    remarks: string
    remarks_bottom: string
    secretary_id: null | unknown
    sequence_number: null | number
    status: string
    status_display: string
    title: string
}

export interface APIRatsinfoBusinessBase {
    id: number
    is_confidential: boolean
    is_urgent: boolean
    has_signature_sheet: boolean
    committee_id: number
    number: string
    title: string
    type_id: number
    responsible_id: number
    begin_date: string
    end_date: string
    touched: string
}

export interface APIRatsinfoBusinessFull extends APIRatsinfoBusinessBase {
    dokumente: APIRatsinfoGeschaeftResultDokumente[]
    beteiligungen: APIRatsinfoGeschaeftBeteiligungen[]
    abstimmungen: APIRatsinfoAbstimmungenResult[]
    is_public: boolean
    groups: Record<string, APIRatsinfoGroupBase>
    statements: APIRatsInfoBusinessStatement[]
    topic_id: number
}

export interface APIRatsinfoMembershipsBase {
    id: number
    begin_date: string
    end_date: string | null
    group_id: number
    role_title: string
    group_title: string
    political_name: string
}

/**
 * PEOPLE
 */

// https://www.ratsinfo.sg.ch/api/people
export interface APIRatsinfoPeopleBase {
    id: number
    created: string
    modified: string
    place_of_residence: {
        id: number
        created: string
        modified: string
        title: string
        uid: string
    } | null,
    full_name: string
    political_name: string
    actual_political_name: string
    uid: string
    ava_id: null | unknown
    is_active: boolean
    cobra_id: null | unknown
    first_name: string
    last_name: string
    salutation: number
    salutation_display: string
    party: string
    coalition_title: string
    profession: string
    title: string
    is_public: boolean
    birthdate: string | null
    date_of_death: string | null
    hometown: string
    seat_number: string
    portrait: string
    user_id: string
    interests: string[]
    has_vote_permission: boolean
    is_from_directory_service: boolean
    election_district_id: number
    private_address_id: number
}


// https://www.ratsinfo.sg.ch/api/people/483
export interface APIRatsinfoPeopleFull extends APIRatsinfoPeopleBase {
    coalition: string
    email: string
    phone: string
    private_mobile: string | null
    fax: string
    private_address: {
        id: number
        uid: string
        type: number
        type_display: string
        company: string
        department: string
        street: string
        post_office_box: string
        zip_code: string
        city: string
        country: string
        country_display: string
    },
    businesses: APIRatsinfoBusinessBase[]
    memberships: APIRatsinfoMembershipsBase[]
    in_group_since: number
}

/**
 * GROUPS / GREMIEN
 */

export interface APIRatsinfoGroupBase {
    ava_systems: [],
    id: number
    title: string
    abbreviation: string
    type: {
        gever_business_repositoryfolder_url: string
        gever_meetings_repositoryfolder_url: string
        id: number
        is_coalition: boolean
        may_take_responsibility: boolean
        order: number
        show_in_committee_switcher: boolean
        show_supplied_business: boolean
        title: string
    },
    type_id: number
    is_active: boolean
    is_default: boolean
    end_date: string
    begin_date: string
    gever_business_repositoryfolder_url: string
    gever_meetings_repositoryfolder_url: string
    gever_meeting_preparation_repositoryfolder_url: string
    is_allowed_to_vote_ava: boolean
    can_manage_attendees: boolean
    can_have_public_content: boolean
    disable_traktandenliste_tree: boolean
    meeting_begin_time: string
    can_enable_recusal: boolean
    urgent_flag_label: string
    urgent_flag_label_display: string
    public_login_url: string

}

export interface APIRatsinfoGroupFull extends APIRatsinfoGroupBase {
    business_participations: APIRatsinfoBusinessBase[]
}

/**
 * ABSTRIMMUNG / VOTING
 */

export interface APIRatsinfoVotingsResult {
    id: number
    title: string
    agenda_item: {
        id: number
        title: string
        meeting: {
            additional_title: string
            id: number
            title: string
        },
        business: {
            id: number
            number: string
            title: string
            type: {
                id: number
                title: string
            }
        }
    },
    date: string
    is_public: boolean
}

export interface APIRatsinfoVotings {
    count: number
    next: string
    previous: string
    results: APIRatsinfoVotingsResult[]
}

export interface Ballot {
    id: number
    vote: string // "yes" | "no" | "absent" | "abstention"
    vote_display: string // "Ja" | "Nein" | "Nicht abgestimmt",
    person_political_name: string
    person_id: string
    person_election_district_title: string
    person_party: string
}

export interface BallotModified extends Ballot {
    sub_district: string
    person_name: string
}

export interface APIRatsinfoVotingFull {
    id: number
    title: string
    agenda_item_id: number
    date: string
    created: string
    meaning_of_yes: string
    meaning_of_no: string
    results: {
        yes: number
        no: number
        abstention: number
        absent: number
    },
    result_string: string
    ballots: Ballot[] | BallotModified[]
    business: {
        id: number
        title: string
        number: string
        begin_date: string
        end_date: null | string
        process_state_id: null | string
        type_id: number
        gever_dossier_url: string
        assignee_id: null | string | number
    },
    is_public: boolean
}

export interface APIRatsinfoAbstimmungenResult {
    abstimmungs_id: string
    abstimmungsgegenstand: string
    sitzungs_id: number
    sitzungstitel: string
    geschafts_id: string
    geschaftsnummer: string
    geschaftstitel: string
    geschaftsart_id: number
    geschaftsart: string
    abstimmungsdatum: string
    link_zu_abstimmungsergebnissen: string
}
