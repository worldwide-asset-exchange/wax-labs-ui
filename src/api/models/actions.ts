import { WAXCurrency } from '@/api/models/common.ts';

export interface Withdraw {
  account_owner: string;
  quantity: string;
}

export interface Profile {
  full_name: string;
  country: string;
  bio: string;
  image_url: string;
  website: string;
  contact: string;
  group_name: string;
  wax_account?: string;
}

export interface DeleteCategory {
  category_name: string;
}

export interface NewCategory {
  new_category: string;
}

export interface MinRequested {
  new_min_requested: string;
}

export interface MaxRequested {
  new_max_requested: string;
}

export interface SetAdmin {
  new_admin: string;
}

export interface TransferFunds {
  from: string;
  to: string;
  quantity: string;
  memo: string;
}

export interface EditProposal {
  proposal_id: number;
  title: string;
  description: string;
  mdbody: string;
  category: string;
  image_url: string;
  estimated_time: number;
  road_map: string;
}

export interface CreateProposal extends Omit<EditProposal, 'proposal_id'> {
  proposer: string;
  deliverables_count: number;
}

export interface RemoveDeliverable {
  proposal_id: number;
  deliverable_id: number;
}

export interface AddDeliverable extends RemoveDeliverable {
  requested_amount: WAXCurrency;
  recipient: string;
  small_description: string;
  days_to_complete: number;
}

export interface EditDeliverable extends RemoveDeliverable {
  new_requested_amount: WAXCurrency;
  new_recipient: string;
  small_description: string;
  days_to_complete: number;
}

export interface GenericProposal {
  proposal_id: number;
}

export interface GenericProposalWithMemo extends GenericProposal {
  memo: string;
}

export interface VotingDuration {
  new_vote_duration: number;
}

export interface ReviewProposal {
  proposal_id: number;
  approve: boolean;
  draft: boolean;
  memo: string;
}

export interface NewReviewer {
  proposal_id: number;
  deliverable_id: number;
  new_reviewer: string;
}

export interface BeginVoting extends GenericProposal {
  ballot_name: string;
}

export type EndVoting = GenericProposal;

export interface ReviewDeliverable {
  proposal_id: number;
  deliverable_id: number;
  accept: boolean;
  memo: string;
}

export interface SubmitReport extends Omit<ReviewDeliverable, 'accept' | 'memo'> {
  proposal_id: number;
  deliverable_id: number;
  report: string;
}

export type ClaimFunds = Omit<ReviewDeliverable, 'accept' | 'memo'>;
