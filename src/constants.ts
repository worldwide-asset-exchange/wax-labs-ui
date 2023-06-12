export const { WAX_RPC, WAX_PROTOCOL, WAX_HOST, WAX_PORT, APP_NAME, LABS_CONTRACT_ACCOUNT } = import.meta.env;

export const TOKEN_SYMBOL = 'WAX';

export const PLACEHOLDER_IMAGE = 'https://wax.nyc3.cdn.digitaloceanspaces.com/default-wax-image.svg';

export const DELPHIORACLE_CONTRACT_ACCOUNT = 'delphioracle';
export const DELPHIORACLE_WAXPUSD_PAIR = 'waxpusd';
export const DELPHIORACLE_DATAPOINTS_TABLE = 'datapoints';
export const DELPHIORACLE_KEY_TYPE = 'i64';

export const EOSIO_TOKEN_CODE = 'eosio.token';

export const SAVINGS_ACCOUNT = 'eosio.saving';

export enum Actions {
  ADD_CATEGORY = 'addcategory',
  CANCEL_PROPOSAL = 'cancelprop',
  DRAFT_PROPOSAL = 'draftprop',
  REVIEW_PROPOSAL = 'reviewprop',
  DELETE_PROPOSAL = 'deleteprop',
  SUBMIT_PROPOSAL = 'submitprop',
  EDIT_PROFILE = 'editprofile',
  EDIT_PROPOSAL = 'editprop',
  SET_ADMIN = 'setadmin',
  SET_MAX_REQUESTED = 'setmaxusd',
  SET_MIN_REQUESTED = 'setminusd',
  SET_REVIEWER = 'setreviewer',
  SET_VOTING_DURATION = 'setduration',
  REMOVE_CATEGORY = 'rmvcategory',
  REMOVE_DELIVERABLE = 'rmvdeliv',
  REMOVE_PROFILE = 'rmvprofile',
  SKIP_VOTING = 'skipvoting',
  NEW_DELIVERABLE = 'newdeliv',
  NEW_PROFILE = 'newprofile',
  BEGIN_VOTING = 'beginvoting',
  END_VOTING = 'endvoting',
  REVIEW_DELIVERABLE = 'reviewdeliv',
  SUBMIT_REPORT = 'submitreport',
  WITHDRAW = 'withdraw',
  CLAIM_FUNDS = 'claimfunds',
}

export enum Tables {
  ACCOUNTS = 'accounts',
  PROPOSAL_COMMENTS = 'pcomments',
  DELIVERABLES_COMMENTS = 'dcomments',
  CONFIG = 'config',
  MD_BODIES = 'mdbodies',
  DELIVERABLES = 'deliverables',
  PROFILES = 'profiles',
  PROPOSALS = 'proposals',
}

export enum ProposalStatusKey {
  DRAFTING = 1,
  SUBMITTED = 2,
  DELIVERABLE_IN_PROGRESS = 2,
  APPROVED = 3,
  REPORTED = 3,
  VOTING = 4,
  ACCEPTED = 4,
  REJECTED = 5,
  PROPOSAL_IN_PROGRESS = 5,
  FAILED = 6,
  CLAIMED = 6,
  CANCELLED = 7,
  COMPLETED = 8,
  FAILED_DRAFT = 9,
}

export enum ProposalStatus {
  STATUS = 'status',
  PROPOSAL_ID = 'proposal_id',
  CATEGORY = 'category',
  PROPOSER = 'proposer',
  REVIEWER = 'reviewer',
  BALLOT = 'ballot_name',
}

export enum ProposalFilterType {
  DEFAULT = 'DEFAULT',
  BY_STAT_CAT = 'BY_STAT_CAT',
  BY_CAT_STAT = 'BY_CAT_STAT',
  BY_PROPOSER_STAT = 'BY_PROPOSER_STAT',
  BY_REVIEWER_STAT = 'BY_REVIEWER_STAT',
  BY_BALLOT = 'BY_BALLOT',
}

const I64 = 'i64';
const I128 = 'i128';

export const INDEX_POSITION: Record<ProposalFilterType, number> = {
  [ProposalFilterType.DEFAULT]: 1,
  [ProposalFilterType.BY_STAT_CAT]: 2,
  [ProposalFilterType.BY_CAT_STAT]: 3,
  [ProposalFilterType.BY_PROPOSER_STAT]: 4,
  [ProposalFilterType.BY_REVIEWER_STAT]: 5,
  [ProposalFilterType.BY_BALLOT]: 6,
};

export const BYTE_SIZE: Record<ProposalFilterType, number> = {
  [ProposalFilterType.DEFAULT]: 8,
  [ProposalFilterType.BY_STAT_CAT]: 8,
  [ProposalFilterType.BY_CAT_STAT]: 8,
  [ProposalFilterType.BY_PROPOSER_STAT]: 16,
  [ProposalFilterType.BY_REVIEWER_STAT]: 16,
  [ProposalFilterType.BY_BALLOT]: 8,
};

export const KEY_TYPE: Record<ProposalFilterType, string> = {
  [ProposalFilterType.DEFAULT]: I64,
  [ProposalFilterType.BY_STAT_CAT]: I64,
  [ProposalFilterType.BY_CAT_STAT]: I64,
  [ProposalFilterType.BY_PROPOSER_STAT]: I128,
  [ProposalFilterType.BY_REVIEWER_STAT]: I128,
  [ProposalFilterType.BY_BALLOT]: I64,
};

export const PATTERN: Record<ProposalFilterType, { key: ProposalStatus; byteSize: number }[]> = {
  [ProposalFilterType.DEFAULT]: [{ key: ProposalStatus.PROPOSAL_ID, byteSize: 8 }],
  [ProposalFilterType.BY_STAT_CAT]: [
    { key: ProposalStatus.STATUS, byteSize: 1 },
    { key: ProposalStatus.CATEGORY, byteSize: 1 },
    { key: ProposalStatus.PROPOSAL_ID, byteSize: 6 },
  ],
  [ProposalFilterType.BY_CAT_STAT]: [
    { key: ProposalStatus.CATEGORY, byteSize: 1 },
    { key: ProposalStatus.STATUS, byteSize: 1 },
    { key: ProposalStatus.PROPOSAL_ID, byteSize: 6 },
  ],
  [ProposalFilterType.BY_PROPOSER_STAT]: [
    { key: ProposalStatus.PROPOSER, byteSize: 8 },
    { key: ProposalStatus.STATUS, byteSize: 1 },
    { key: ProposalStatus.PROPOSAL_ID, byteSize: 7 },
  ],
  [ProposalFilterType.BY_REVIEWER_STAT]: [
    { key: ProposalStatus.REVIEWER, byteSize: 8 },
    { key: ProposalStatus.STATUS, byteSize: 1 },
    { key: ProposalStatus.PROPOSAL_ID, byteSize: 7 },
  ],
  [ProposalFilterType.BY_BALLOT]: [{ key: ProposalStatus.BALLOT, byteSize: 8 }],
};

export const PROPOSAL_INDEXES = {};
