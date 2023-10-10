import { IndexPosition } from '@/api/models/common.ts';

export const {
  VITE_WAX_RPC: WAX_RPC,
  VITE_WAX_PROTOCOL: WAX_PROTOCOL,
  VITE_WAX_HOST: WAX_HOST,
  VITE_WAX_PORT: WAX_PORT,
  VITE_APP_NAME: APP_NAME,
  VITE_LABS_CONTRACT_ACCOUNT: LABS_CONTRACT_ACCOUNT,
  VITE_WAX_CHAINID: WAX_CHAIN_ID,
  VITE_API_URL: API_URL,
} = import.meta.env;

const I64 = 'i64';
const I128 = 'i128';

export const DRAFT_PROP_AMOUNT = 100;
export const BEGIN_VOTING_AMOUNT = 10;

export const TOKEN_SYMBOL = 'WAX';

export const PLACEHOLDER_IMAGE = 'https://wax.nyc3.cdn.digitaloceanspaces.com/default-wax-image.svg';

export const DELPHIORACLE_CONTRACT_ACCOUNT = 'delphioracle';
export const DELPHIORACLE_WAXPUSD_PAIR = 'waxpusd';
export const DELPHIORACLE_DATAPOINTS_TABLE = 'datapoints';
export const DELPHIORACLE_KEY_TYPE = I64;

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
  TRANSFER = 'transfer',
  CAST_VOTE = 'castvote',
  REG_VOTER = 'regvoter',
  SYNC = 'sync',
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
  VOTERS = 'voters',
  BALLOTS = 'ballots',
}

export enum ProposalStatusKey {
  DRAFTING = 1,
  SUBMITTED = 2,
  APPROVED = 3,
  VOTING = 4,
  IN_PROGRESS = 5,
  FAILED = 6,
  CANCELLED = 7,
  COMPLETED = 8,
  FAILED_DRAFT = 9,
}

export enum DeliverableStatusKey {
  DRAFTING = 1,
  IN_PROGRESS = 2,
  REPORTED = 3,
  ACCEPTED = 4,
  REJECTED = 5,
  CLAIMED = 6,
}

export const ProposalStatusKeyName: Record<string, ProposalStatusKey> = {
  'filters.drafting': ProposalStatusKey.DRAFTING,
  'filters.inReview': ProposalStatusKey.SUBMITTED,
  'filters.approved': ProposalStatusKey.APPROVED,
  'filters.voting': ProposalStatusKey.VOTING,
  'filters.inProgress': ProposalStatusKey.IN_PROGRESS,
  'filters.failed': ProposalStatusKey.FAILED,
  'filters.cancelled': ProposalStatusKey.CANCELLED,
  'filters.completed': ProposalStatusKey.COMPLETED,
  'filters.failedDraft': ProposalStatusKey.FAILED_DRAFT,
};

export enum ProposalStatus2 {
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

export enum ProposalStatus {
  DRAFTING = 'in drafting', //
  REVIEW = 'in review', //
  APPROVED = 'approved', //
  VOTING = 'in voting', //
  IN_PROGRESS = 'in progress', //
  CANCELLED = 'cancelled', //
  REJECTED = 'rejected', //
  COMPLETE = 'completed', //
  FAILED_DRAFT = 'to be improved', //
}

export enum DeliverableStatus {
  DRAFTING = 'in drafting', //,
  IN_PROGRESS = 'in progress', //,
  REPORTED = 'reported', //
  ACCEPTED = 'accepted', //
  REJECTED = 'rejected', //
  CLAIMED = 'claimed', //
}

export enum NotificationType {
  PROPOSAL_END_VOTING,
  ADMIN_PROPOSAL_END_VOTING,
  START_VOTING,
  PROPOSAL_IN_PROGRESS,
  DELIVERABLES_TO_REVIEW,
  CLAIM_DELIVERABLE,
  REJECTED_DELIVERABLE,
  REVIEW_PENDING,
}

export const INDEX_POSITION: Record<ProposalFilterType, IndexPosition> = {
  [ProposalFilterType.DEFAULT]: 'primary',
  [ProposalFilterType.BY_STAT_CAT]: 'secondary',
  [ProposalFilterType.BY_CAT_STAT]: 'tertiary',
  [ProposalFilterType.BY_PROPOSER_STAT]: 'fourth',
  [ProposalFilterType.BY_REVIEWER_STAT]: 'fifth',
  [ProposalFilterType.BY_BALLOT]: 'sixth',
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

export const PATTERN: Record<ProposalFilterType, { key: ProposalStatus2; byteSize: number }[]> = {
  [ProposalFilterType.DEFAULT]: [{ key: ProposalStatus2.PROPOSAL_ID, byteSize: 8 }],
  [ProposalFilterType.BY_STAT_CAT]: [
    { key: ProposalStatus2.STATUS, byteSize: 1 },
    { key: ProposalStatus2.CATEGORY, byteSize: 1 },
    { key: ProposalStatus2.PROPOSAL_ID, byteSize: 6 },
  ],
  [ProposalFilterType.BY_CAT_STAT]: [
    { key: ProposalStatus2.CATEGORY, byteSize: 1 },
    { key: ProposalStatus2.STATUS, byteSize: 1 },
    { key: ProposalStatus2.PROPOSAL_ID, byteSize: 6 },
  ],
  [ProposalFilterType.BY_PROPOSER_STAT]: [
    { key: ProposalStatus2.PROPOSER, byteSize: 8 },
    { key: ProposalStatus2.STATUS, byteSize: 1 },
    { key: ProposalStatus2.PROPOSAL_ID, byteSize: 7 },
  ],
  [ProposalFilterType.BY_REVIEWER_STAT]: [
    { key: ProposalStatus2.REVIEWER, byteSize: 8 },
    { key: ProposalStatus2.STATUS, byteSize: 1 },
    { key: ProposalStatus2.PROPOSAL_ID, byteSize: 7 },
  ],
  [ProposalFilterType.BY_BALLOT]: [{ key: ProposalStatus2.BALLOT, byteSize: 8 }],
};

export enum SortBy {
  CREATED_LAST,
  CREATED_FIRST,
  MIN_WAX_REQUESTED,
  MAX_WAX_REQUESTED,
  LAST_UPDATED,
}

export const ProposalFilter: Record<string, SortBy> = {
  'sortByOptions.createdLast': SortBy.CREATED_LAST,
  'sortByOptions.createdFirst': SortBy.CREATED_FIRST,
  'sortByOptions.minWaxRequested': SortBy.MIN_WAX_REQUESTED,
  'sortByOptions.maxWaxRequested': SortBy.MAX_WAX_REQUESTED,
  'sortByOptions.lastUpdated': SortBy.LAST_UPDATED,
};

export enum Whose {
  ALL_PROPOSALS,
  MY_PROPOSALS,
  PROPOSALS_TO_REVIEW,
}

export const WhoseFilter: Record<string, Whose> = {
  allProposals: Whose.ALL_PROPOSALS,
  myProposals: Whose.MY_PROPOSALS,
  proposalsToReview: Whose.PROPOSALS_TO_REVIEW,
};

export const DECIDE_CONTRACT_ACCOUNT = 'decide';
export const OIG_CODE = 'oig';
