export const DRAFTING_KEY = 1
export const SUBMITTED_KEY = 2
export const APPROVED_KEY = 3
export const VOTING_KEY = 4
export const COMPLETED_KEY = 8
export const CANCELLED_KEY = 7
export const PROPOSAL_INPROGRESS_KEY = 5
export const DELIVERABLE_INPROGRESS_KEY = 2
export const FAILED_KEY = 6
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

export const PROPOSAL_INDEXES = {
    INDEX_POSITION: {
        DEFAULT: 1,
        BY_STAT_CAT: 2,
        BY_CAT_STAT: 3,
        BY_PROPOSER_STAT: 4,
        BY_REVIEWER_STAT: 5,
        BY_BALLOT: 6,
    },
    BYTE_SIZE: {
        DEFAULT: 8,
        BY_STAT_CAT: 8,
        BY_CAT_STAT: 8,
        BY_PROPOSER_STAT: 16,
        BY_REVIEWER_STAT: 16,
        BY_BALLOT: 8,
    },
    KEY_TYPE: {
        DEFAULT: I64,
        BY_STAT_CAT: I64,
        BY_CAT_STAT: I64,
        BY_PROPOSER_STAT: I128,
        BY_REVIEWER_STAT: I128,
        BY_BALLOT: I64,
    },
    PATTERN: {
        DEFAULT: [{key:PROPOSAL_ID_KEY, byte_size: 8}],
        BY_STAT_CAT: [{key:STATUS_KEY, byte_size:1}, {key:CATEGORY_KEY, byte_size:1}, {key:PROPOSAL_ID_KEY, byte_size:6}],
        BY_CAT_STAT: [{key:CATEGORY_KEY, byte_size:1}, {key:STATUS_KEY, byte_size:1}, {key:PROPOSAL_ID_KEY, byte_size:6}],
        BY_PROPOSER_STAT: [{key:PROPOSER_KEY, byte_size: 8}, {key:STATUS_KEY, byte_size:1}, {key:PROPOSAL_ID_KEY, byte_size: 7}],
        BY_REVIEWER_STAT: [{key:REVIEWER_KEY, byte_size: 8}, {key:STATUS_KEY, byte_size:1}, {key:PROPOSAL_ID_KEY, byte_size: 7}],
        BY_BALLOT: [{key:BALLOT_KEY, byte_size: 8}],
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

export const BALANCE_EVENT_KEY = 'balance'
export const PROFILE_EVENT_KEY = 'profile'
export const MY_PROPOSALS_EVENT_KEY = 'proposals'
export const DELIVERABLES_TO_REVIEW_EVENT_KEY = 'review'

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
export const BALLOTS_TABLE = "ballots"
export const VOTERS_TABLE = "voters"
export const SYNC_ACTION = "sync"
export const CAST_VOTE_ACTION = "castvote"

export const LABS_CONTRACT_ACCOUNT = 'labstest1111'
export const ACCOUNTS_TABLE = 'accounts'
export const CONFIG_TABLE = 'config'
export const MD_BODIES_TABLE = 'mdbodies'
export const DELIVERABLES_TABLE = 'deliverables'
export const PROFILES_TABLE = 'profiles'
export const PROPOSALS_TABLE = "proposals"
export const NAME_KEY_TYPE = 'name'
export const CANCEL_PROPOSAL_ACTION = "cancelprop"
export const DRAFT_PROPOSAL_ACTION = "draftprop"
export const REVIEW_PROPOSAL_ACTION = "reviewprop"
export const DELETE_PROPOSAL_ACTION = "deleteprop"
export const SUBMIT_PROPOSAL_ACTION = "submitprop"
export const EDIT_PROFILE_ACTION = 'editprofile'
export const EDIT_PROPOSAL_ACTION = "editprop"
export const SET_REVIEWER_ACTION = "setreviewer"
export const REMOVE_DELIVERABLE_ACTION = "rmvdeliv"
export const NEW_DELIVERABLE_ACTION = "newdeliv"
export const NEW_PROFILE_ACTION = 'newprofile'
export const BEGIN_VOTING_ACTION = "beginvoting"
export const END_VOTING_ACTION = "endvoting"
export const REVIEW_DELIVERABLE_ACTION = "reviewdeliv"
export const SUBMIT_REPORT_ACTION = 'submitreport'
export const WITHDRAW_ACTION = "withdraw"
export const CLAIM_FUNDS_ACTION = 'claimfunds'

export const BEGIN_VOTING_AMOUNT = '10.00000000 WAX'


export const MAX_DELIVERABLES = 20
export const MAX_TITLE_LENGTH = 64
export const MAX_DESCRIPTION_LENGTH = 160
export const MAX_BODY_LENGTH = 4096
export const MAX_IMGURL_LENGTH = 256
export const PROPOSAL_MIN_REQUESTED = 1000
export const PROPOSAL_MAX_REQUESTED = 500000

// Links
export const PROPOSALS_LINK = "/proposals"
export const DRAFT_PROPOSAL_LINK = PROPOSALS_LINK + "/create"

export const ACCOUNT_PORTAL_LINK = "/account"

export const DEFAULT_PROPOSAL_IMAGE_URL = 'https://wax.nyc3.cdn.digitaloceanspaces.com/default-wax-image.svg'

export const PROPOSALS_STATUS_KEYS = [
    DRAFTING_KEY,
    SUBMITTED_KEY,
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
    [APPROVED_KEY]:   "Approved",
    [VOTING_KEY]:     "Voting",
    [COMPLETED_KEY]:  "Completed",
    [CANCELLED_KEY]:  "Cancelled",
    [PROPOSAL_INPROGRESS_KEY]: "In Progress",
    [FAILED_KEY]:     "Failed",
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
    `${REQUESTED_ORDER_BY_FIELD}${SEPARATOR_ORDER_BY}${ASCENDANT_ORDER_BY_MODE}`,
    `${REQUESTED_ORDER_BY_FIELD}${SEPARATOR_ORDER_BY}${DESCENDANT_ORDER_BY_MODE}`,
    `${CREATED_ORDER_BY_FIELD}${SEPARATOR_ORDER_BY}${ASCENDANT_ORDER_BY_MODE}`,
    `${CREATED_ORDER_BY_FIELD}${SEPARATOR_ORDER_BY}${DESCENDANT_ORDER_BY_MODE}`,
]

export const PROPOSAL_ORDER_BY_OBJECT = {
    [PROPOSAL_ORDER_BY_LIST[0]]: "Requested lowest",
    [PROPOSAL_ORDER_BY_LIST[1]]: "Requested highest",
    [PROPOSAL_ORDER_BY_LIST[2]]: "Created first",
    [PROPOSAL_ORDER_BY_LIST[3]]: "Created last",
}
