export interface Proposal {
  proposal_id: string;
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
}

export interface ProposalContent {
  content: string;
  proposal_id: number;
}

export interface EditProposalRequest {
  proposal_id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  estimated_time: number;
  content: string;
  deliverables: string;
  road_map: string;
}

export type NewProposalRequest = Omit<EditProposalRequest, 'proposal_id'>;
