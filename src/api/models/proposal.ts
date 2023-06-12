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
