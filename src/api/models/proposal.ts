export interface Proposal {
  proposal_id: number;
  image_url: string;
  title: string;
  description: string;
  proposer: string;
  total_requested_funds: string;
  status: string;
  deliverables: number;
  category: string;
  categories: Record<string, string>;
  vote_end_time: string;
  update_ts: string;
}

export interface ProposalContent {
  content: string;
  proposal_id: number;
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
