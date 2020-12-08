export const DRAFTING_KEY = "drafting"
export const SUBMITTED_KEY = "submitted"
export const APPROVED_KEY = "approved"
export const VOTING_KEY = "voting"
export const COMPLETED_KEY = "completed"
export const CANCELLED_KEY = "cancelled"
export const INPROGRESS_KEY = "inprogress"
export const FAILED_KEY = "failed"

export const SEARCH_QUERY_STRING_KEY = "search"
export const STATUS_QUERY_STRING_KEY = "status"
export const CATEGORIES_QUERY_STRING_KEY = "categories"
export const ORDER_BY_QUERY_STRING_KEY = "order"
export const PAGE_QUERY_STRING_KEY = 'page'

export const REQUESTED_ORDER_BY_FIELD = "requested"
export const CREATED_ORDER_BY_FIELD = "created"
export const ASCENDANT_ORDER_BY_MODE = "asc"
export const DESCENDANT_ORDER_BY_MODE = "desc"
export const SEPARATOR_ORDER_BY = ":"

export const EOSIO_TOKEN_CODE = "eosio.token"
export const TRANSFER_ACTION = "transfer"

export const OIG_CODE = "oig"
export const REGISTER_VOTER_ACTION = "regvoter"

export const DECIDE_CODE = "decide"
export const DECIDE_SCOPE = "decide"
export const BALLOTS_TABLE = "ballots"
export const VOTERS_TABLE = "voters"
export const SYNC_ACTION = "sync"
export const CAST_VOTE_ACTION = "castvote"

export const LABS_CODE = 'labs'
export const LABS_SCOPE = 'labs'
export const ACCOUNTS_TABLE = 'accounts'
export const CONFIG_TABLE = 'config'
export const PROFILES_TABLE = 'profiles'
export const PROPOSALS_TABLE = "proposals"
export const NAME_KEY_TYPE = 'name'
export const PROPOSALS_TABLE_STATUS_INDEXPOSITION = "fourth"
export const CANCEL_PROPOSAL_ACTION = "cancelprop"
export const REVIEW_PROPOSAL_ACTION = "reviewprop"
export const DELETE_PROPOSAL_ACTION = "deleteprop"
export const SET_REVIEWER_ACTION = "setreviewer"
export const BEGIN_VOTING_ACTION = "beginvoting"
export const END_VOTING_ACTION = "endvoting"


// Links
export const PROPOSALS_LINK = "/proposals"
export const DRAFT_PROPOSAL_LINK = PROPOSALS_LINK + "/draft"
export const ACCOUNT_PORTAL_LINK = "/account"
export const DEFAULT_PROPOSAL_IMAGE_URL = 'https://wax.io/uploads/press-assets/wax-primary-logo.png'

export const PROPOSALS_STATUS_KEYS = [
    DRAFTING_KEY,
    SUBMITTED_KEY,
    APPROVED_KEY,
    VOTING_KEY,
    COMPLETED_KEY,
    CANCELLED_KEY,
    INPROGRESS_KEY,
    FAILED_KEY,
]

export const READABLE_PROPOSAL_STATUS = {
    [DRAFTING_KEY]:   "Drafting",
    [SUBMITTED_KEY]:  "In Review",
    [APPROVED_KEY]:   "Approved",
    [VOTING_KEY]:     "Voting",
    [COMPLETED_KEY]:  "Completed",
    [CANCELLED_KEY]:  "Cancelled",
    [INPROGRESS_KEY]: "In Progress",
    [FAILED_KEY]:     "Failed",
}

export const PROPOSAL_QUERY_ARGS_DICT = {
    [DRAFTING_KEY]:   {bound: DRAFTING_KEY,   indexPosition: PROPOSALS_TABLE_STATUS_INDEXPOSITION},
    [SUBMITTED_KEY]:  {bound: SUBMITTED_KEY,  indexPosition: PROPOSALS_TABLE_STATUS_INDEXPOSITION},
    [APPROVED_KEY]:   {bound: APPROVED_KEY,   indexPosition: PROPOSALS_TABLE_STATUS_INDEXPOSITION},
    [VOTING_KEY]:     {bound: VOTING_KEY,     indexPosition: PROPOSALS_TABLE_STATUS_INDEXPOSITION},
    [COMPLETED_KEY]:  {bound: COMPLETED_KEY,  indexPosition: PROPOSALS_TABLE_STATUS_INDEXPOSITION},
    [CANCELLED_KEY]:  {bound: CANCELLED_KEY,  indexPosition: PROPOSALS_TABLE_STATUS_INDEXPOSITION},
    [INPROGRESS_KEY]: {bound: INPROGRESS_KEY, indexPosition: PROPOSALS_TABLE_STATUS_INDEXPOSITION},
    [FAILED_KEY]:     {bound: FAILED_KEY,     indexPosition: PROPOSALS_TABLE_STATUS_INDEXPOSITION},
}

export const PROPOSAL_ALL_QUERY_ARGS_LIST = [
    PROPOSAL_QUERY_ARGS_DICT[DRAFTING_KEY],
    PROPOSAL_QUERY_ARGS_DICT[SUBMITTED_KEY],
    PROPOSAL_QUERY_ARGS_DICT[APPROVED_KEY],
    PROPOSAL_QUERY_ARGS_DICT[VOTING_KEY],
    PROPOSAL_QUERY_ARGS_DICT[COMPLETED_KEY],
    PROPOSAL_QUERY_ARGS_DICT[CANCELLED_KEY],
    PROPOSAL_QUERY_ARGS_DICT[INPROGRESS_KEY],
    PROPOSAL_QUERY_ARGS_DICT[FAILED_KEY],
]


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
