export const DRAFTING_KEY = 1
export const SUBMITTED_KEY = 2
export const APPROVED_KEY = 3
export const VOTING_KEY = 4
export const COMPLETED_KEY = 8
export const CANCELLED_KEY = 7
export const PROPOSAL_INPROGRESS_KEY = 5
export const DELIVERABLE_INPROGRESS_KEY = 2
export const FAILED_KEY = 6
export const FAILED_DRAFT_KEY = 9
export const REPORTED_KEY = 3
export const ACCEPTED_KEY = 4
export const CLAIMED_KEY = 6
export const REJECTED_KEY = 5


export const I64 = 'i64'
export const I128 = 'i128'


export const STATUS_KEY = 'status'
export const PROPOSAL_ID_KEY = 'proposal_id'
export const CATEGORY_KEY = 'category'
export const PROPOSER_KEY = 'proposer'
export const REVIEWER_KEY = 'reviewer'
export const BALLOT_KEY = 'ballot_name'


export const DEFAULT_QUERY_TYPE = 'DEFAULT'
export const BY_STAT_CAT_QUERY_TYPE = "BY_STAT_CAT"
export const BY_CAT_STAT_QUERY_TYPE = "BY_CAT_STAT"
export const BY_PROPOSER_STAT_QUERY_TYPE = 'BY_PROPOSER_STAT'
export const BY_REVIEWER_STAT_QUERY_TYPE = "BY_REVIEWER_STAT"
export const BY_BALLOT_QUERY_TYPE = 'BY_BALLOT'


export const PROPOSAL_INDEXES = {
    INDEX_POSITION: {
        [DEFAULT_QUERY_TYPE]: 1,
        [BY_STAT_CAT_QUERY_TYPE]: 2,
        [BY_CAT_STAT_QUERY_TYPE]: 3,
        [BY_PROPOSER_STAT_QUERY_TYPE]: 4,
        [BY_REVIEWER_STAT_QUERY_TYPE]: 5,
        [BY_BALLOT_QUERY_TYPE]: 6,
    },
    BYTE_SIZE: {
        [DEFAULT_QUERY_TYPE]: 8,
        [BY_STAT_CAT_QUERY_TYPE]: 8,
        [BY_CAT_STAT_QUERY_TYPE]: 8,
        [BY_PROPOSER_STAT_QUERY_TYPE]: 16,
        [BY_REVIEWER_STAT_QUERY_TYPE]: 16,
        [BY_BALLOT_QUERY_TYPE]: 8,
    },
    KEY_TYPE: {
        [DEFAULT_QUERY_TYPE]: I64,
        [BY_STAT_CAT_QUERY_TYPE]: I64,
        [BY_CAT_STAT_QUERY_TYPE]: I64,
        [BY_PROPOSER_STAT_QUERY_TYPE]: I128,
        [BY_REVIEWER_STAT_QUERY_TYPE]: I128,
        [BY_BALLOT_QUERY_TYPE]: I64,
    },
    PATTERN: {
        [DEFAULT_QUERY_TYPE]: [{key:PROPOSAL_ID_KEY, byte_size: 8}],
        [BY_STAT_CAT_QUERY_TYPE]: [{key:STATUS_KEY, byte_size:1}, {key:CATEGORY_KEY, byte_size:1}, {key:PROPOSAL_ID_KEY, byte_size:6}],
        [BY_CAT_STAT_QUERY_TYPE]: [{key:CATEGORY_KEY, byte_size:1}, {key:STATUS_KEY, byte_size:1}, {key:PROPOSAL_ID_KEY, byte_size:6}],
        [BY_PROPOSER_STAT_QUERY_TYPE]: [{key:PROPOSER_KEY, byte_size: 8}, {key:STATUS_KEY, byte_size:1}, {key:PROPOSAL_ID_KEY, byte_size: 7}],
        [BY_REVIEWER_STAT_QUERY_TYPE]: [{key:REVIEWER_KEY, byte_size: 8}, {key:STATUS_KEY, byte_size:1}, {key:PROPOSAL_ID_KEY, byte_size: 7}],
        [BY_BALLOT_QUERY_TYPE]: [{key:BALLOT_KEY, byte_size: 8}],
    }
}


export const NOTIFICATIONS_DICT = {
    END_VOTING: {
        text: 'End voting action required',
    },
    START_VOTING: {
        text: 'Start voting action required',
    },
    CLAIM_DELIVERABLE: {
        text: 'Unclaimed approved deliverables'
    },
    REJECTED_DELIVERABLE: {
        text: 'A deliverable report was rejected'
    },
    DELIVERABLES_TO_REVIEW: {
        text: 'A deliverable was reported'
    },
    REVIEW_PENDING: {
        text: 'This proposal needs reviewing'
    }
}


export const TESTNET_CHAIN_ID = "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12"
export const MAIN_NET_CHAIN_ID = "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4"


export const TAB_QUERY_STRING_KEY = 'tab';
export const MODE_QUERY_STRING_KEY = 'mode';
export const SEARCH_QUERY_STRING_KEY = "search"
export const STATUS_QUERY_STRING_KEY = "status"
export const CATEGORIES_QUERY_STRING_KEY = "categories"
export const ORDER_BY_QUERY_STRING_KEY = "order"
export const PAGE_QUERY_STRING_KEY = 'page'

export const DISPLAY_EVENT_KEY = 'display'
export const EDIT_EVENT_KEY = 'edit'
export const CREATE_EVENT_KEY = 'create'
export const DEFAULT_EVENT_KEY = DISPLAY_EVENT_KEY

export const BALANCE_TAB_KEY = 'balance'
export const PROFILE_TAB_KEY = 'profile'
export const MY_PROPOSALS_TAB_KEY = 'proposals'
export const DELIVERABLES_TO_REVIEW_TAB_KEY = 'review'
export const DEFAULT_TAB_KEY = MY_PROPOSALS_TAB_KEY

export const PROPOSALS_TO_REVIEW_TAB_KEY = 'proposals'
export const CATEGORIES_TAB_KEY = 'categories'
export const SET_VOTING_TAB_KEY = 'setvoting'
export const REMOVE_PROFILE_TAB_KEY = 'rmvprofile'
export const TRANSFER_ADMIN_ROLE_TAB_KEY = 'transferadmin'
export const SET_MIN_MAX_REQUESTED_TAB_KEY = 'setminmaxrequested'
export const DEFAULT_ADMIN_TAB_KEY = PROPOSALS_TO_REVIEW_TAB_KEY

export const REQUESTED_ORDER_BY_FIELD = "requested"
export const CREATED_ORDER_BY_FIELD = "created"
export const ASCENDANT_ORDER_BY_MODE = "asc"
export const DESCENDANT_ORDER_BY_MODE = "desc"
export const SEPARATOR_ORDER_BY = ":"

export const EOSIO_TOKEN_CODE = "eosio.token"
export const TRANSFER_ACTION = "transfer"

export const OIG_CODE = "oig"
export const REGISTER_VOTER_ACTION = "regvoter"

export const DECIDE_CONTRACT_ACCOUNT = "decide"
export const TREASURIES_TABLE = 'treasuries'
export const BALLOTS_TABLE = "ballots"
export const VOTERS_TABLE = "voters"
export const SYNC_ACTION = "sync"
export const CAST_VOTE_ACTION = "castvote"

export const LABS_CONTRACT_ACCOUNT = process.env.REACT_APP_LABS_CONTRACT_NAME
export const SAVINGS_ACCOUNT = 'eosio.saving'
export const ACCOUNTS_TABLE = 'accounts'
export const PROPOSAL_COMMENTS_TABLE = 'pcomments'
export const DELIVERABLES_COMMENTS_TABLE = 'dcomments'
export const CONFIG_TABLE = 'config'
export const MD_BODIES_TABLE = 'mdbodies'
export const DELIVERABLES_TABLE = 'deliverables'
export const PROFILES_TABLE = 'profiles'
export const PROPOSALS_TABLE = "proposals"
export const NAME_KEY_TYPE = 'name'
export const ADD_CATEGORY_ACTION = 'addcategory'
export const CANCEL_PROPOSAL_ACTION = "cancelprop"
export const DRAFT_PROPOSAL_ACTION = "draftprop"
export const REVIEW_PROPOSAL_ACTION = "reviewprop"
export const DELETE_PROPOSAL_ACTION = "deleteprop"
export const SUBMIT_PROPOSAL_ACTION = "submitprop"
export const EDIT_PROFILE_ACTION = 'editprofile'
export const EDIT_PROPOSAL_ACTION = "editprop"
export const SET_ADMIN_ACTION = 'setadmin'
export const SET_MAX_REQUESTED_ACTION = 'setmaxusd'
export const SET_MIN_REQUESTED_ACTION = 'setminusd'
export const SET_REVIEWER_ACTION = "setreviewer"
export const SET_VOTING_DURATION_ACTION = 'setduration'
export const REMOVE_CATEGORY_ACTION = 'rmvcategory'
export const REMOVE_DELIVERABLE_ACTION = "rmvdeliv"
export const REMOVE_PROFILE_ACTION = 'rmvprofile'
export const SKIP_VOTING_ACTION = 'skipvoting'
export const NEW_DELIVERABLE_ACTION = "newdeliv"
export const NEW_PROFILE_ACTION = 'newprofile'
export const BEGIN_VOTING_ACTION = "beginvoting"
export const END_VOTING_ACTION = "endvoting"
export const REVIEW_DELIVERABLE_ACTION = "reviewdeliv"
export const SUBMIT_REPORT_ACTION = 'submitreport'
export const WITHDRAW_ACTION = "withdraw"
export const CLAIM_FUNDS_ACTION = 'claimfunds'

export const BEGIN_VOTING_AMOUNT = '10.00000000 WAX'
export const DRAFT_PROP_AMOUNT = '100.00000000 WAX'
export const TOKEN_SYMBOL = "WAX"
export const DEPOSIT_MEMO = "fund"

export const MAX_DELIVERABLES = 20
export const MAX_TITLE_LENGTH = 64
export const MAX_DESCRIPTION_LENGTH = 160
export const MAX_BODY_LENGTH = 4096
export const MAX_IMGURL_LENGTH = 256
export const PROPOSAL_MIN_REQUESTED = 1000
export const PROPOSAL_MAX_REQUESTED = 500000
export const MAX_ROADMAP_LENGTH = 2048

// Links
export const PROPOSALS_LINK = "/proposals"
export const PROPOSALS_HEADER_LINK = `${PROPOSALS_LINK}?${PAGE_QUERY_STRING_KEY}=1&order=created%3Adesc`
export const DRAFT_PROPOSAL_LINK = PROPOSALS_LINK + "/create"

export const PROPOSALS_IN_VOTING_LINK = `${PROPOSALS_LINK}?${STATUS_QUERY_STRING_KEY}=${VOTING_KEY}&order=created%3Adesc`
export const PROPOSALS_IN_PROGRESS_LINK = `${PROPOSALS_LINK}?${STATUS_QUERY_STRING_KEY}=${PROPOSAL_INPROGRESS_KEY}&order=created%3Adesc`
export const PROPOSALS_IN_REVIEW_LINK = `${PROPOSALS_LINK}?${STATUS_QUERY_STRING_KEY}=${SUBMITTED_KEY}&order=created%3Adesc`
export const PROPOSALS_COMPLETED_LINK = `${PROPOSALS_LINK}?${STATUS_QUERY_STRING_KEY}=${COMPLETED_KEY}&order=created%3Adesc`

export const PROFILE_LINK = '/profile'
export const ACCOUNT_PORTAL_LINK = "/account"
export const PROPOSAL_PAGE_LINK = "/proposals"
export const CREATE_PROFILE_LINK = ACCOUNT_PORTAL_LINK + `?${MODE_QUERY_STRING_KEY}=${CREATE_EVENT_KEY}&${TAB_QUERY_STRING_KEY}=${PROFILE_TAB_KEY}`
export const ADMIN_PORTAL_LINK = "/admin"
export const MY_PROPOSALS_LINK = `${ACCOUNT_PORTAL_LINK}?tab=${MY_PROPOSALS_TAB_KEY}`

export const DEFAULT_PROPOSAL_IMAGE_URL = 'https://wax.nyc3.cdn.digitaloceanspaces.com/default-wax-image.svg'

export const PROPOSALS_STATUS_KEYS = [
    DRAFTING_KEY,
    SUBMITTED_KEY,
    FAILED_DRAFT_KEY,
    APPROVED_KEY,
    VOTING_KEY,
    COMPLETED_KEY,
    CANCELLED_KEY,
    PROPOSAL_INPROGRESS_KEY,
    FAILED_KEY,
]

export const DELIVERABLES_STATUS_KEYS = [
    DRAFTING_KEY,
    REPORTED_KEY,
    ACCEPTED_KEY,
    DELIVERABLE_INPROGRESS_KEY,
    CLAIMED_KEY,
    REJECTED_KEY,
]

export const READABLE_PROPOSAL_STATUS = {
    [DRAFTING_KEY]:   "Drafting",
    [SUBMITTED_KEY]:  "In Review",
    [FAILED_DRAFT_KEY]: 'To be Improved',
    [APPROVED_KEY]:   "Approved",
    [VOTING_KEY]:     "In Voting",
    [COMPLETED_KEY]:  "Completed",
    [CANCELLED_KEY]:  "Cancelled",
    [PROPOSAL_INPROGRESS_KEY]: "In Progress",
    [FAILED_KEY]:     "Rejected",
}

export const READABLE_DELIVERABLE_STATUS = {
    [DRAFTING_KEY]: "Drafting",
    [REPORTED_KEY]: "Reported",
    [ACCEPTED_KEY]: "Accepted",
    [DELIVERABLE_INPROGRESS_KEY]: "In Progress",
    [CLAIMED_KEY]: "Claimed",
    [REJECTED_KEY]: "Rejected",
}

export const PROPOSAL_ORDER_BY_LIST = [
    `${CREATED_ORDER_BY_FIELD}${SEPARATOR_ORDER_BY}${DESCENDANT_ORDER_BY_MODE}`,
    `${REQUESTED_ORDER_BY_FIELD}${SEPARATOR_ORDER_BY}${ASCENDANT_ORDER_BY_MODE}`,
    `${REQUESTED_ORDER_BY_FIELD}${SEPARATOR_ORDER_BY}${DESCENDANT_ORDER_BY_MODE}`,
    `${CREATED_ORDER_BY_FIELD}${SEPARATOR_ORDER_BY}${ASCENDANT_ORDER_BY_MODE}`,
]

export const PROPOSAL_ORDER_BY_OBJECT = {
    [PROPOSAL_ORDER_BY_LIST[0]]: "Created last",
    [PROPOSAL_ORDER_BY_LIST[1]]: "Lowest WAX amount requested",
    [PROPOSAL_ORDER_BY_LIST[2]]: "Highest WAX amount requested",
    [PROPOSAL_ORDER_BY_LIST[3]]: "Created first",
}
