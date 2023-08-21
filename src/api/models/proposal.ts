import { WAXCurrency } from '@/api/models/common.ts';
import { BallotOptions } from '@/api/models/voting.ts';
import { ProposalStatusKey } from '@/constants.ts';

export interface Proposal {
  proposal_id: number;
  proposer: string;
  category: number;
  status: ProposalStatusKey;
  ballot_name: string;
  title: string;
  description: string;
  image_url: string;
  estimated_time: number;
  total_requested_funds: WAXCurrency;
  to_be_paid_funds: WAXCurrency;
  total_paid_funds: WAXCurrency;
  remaining_funds: WAXCurrency;
  deliverables: number;
  deliverables_completed: number;
  reviewer: string;
  ballot_results: BallotOptions[];
  update_ts: string;
  vote_end_time: string;
  road_map: string;
  categories?: Record<string, string>;
}

export interface ProposalContent {
  content: string;
  proposal_id: number;
}

export interface ProposalComment {
  status_comment: string;
  proposal_id: number;
}

export interface DeliverableComment {
  status_comment: string;
  deliverable_id: number;
}

export interface EditProposalRequest {
  proposal_id: number;
  title: string;
  category: string;
  description: string;
  image_url: string;
  estimated_time: number;
  content: string;
  road_map: string;
}

export interface NewProposalRequest extends Omit<EditProposalRequest, 'proposal_id'> {
  deliverables: number;
}
