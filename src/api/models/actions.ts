export interface Withdraw {
  account_owner: string;
  quantity: string;
}

export interface Profile {
  wax_account: string;
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
  proposal_id: string;
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
  requested_amount: string;
  recipient: string;
  small_description: string;
  days_to_complete: string;
}
