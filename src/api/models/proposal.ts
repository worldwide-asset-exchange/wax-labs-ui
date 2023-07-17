import { ProposalStatusKey } from '@/constants.ts';

export interface Proposal {
  proposal_id: number;
  image_url: string;
  title: string;
  description: string;
  proposer: string;
  total_requested_funds: string;
  status: ProposalStatusKey;
  deliverables: number;
  deliverables_completed: number;
  category: number;
  categories: Record<string, string>;
  vote_end_time: string;
  update_ts: string;
  road_map: string;
  reviewer: string;
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
