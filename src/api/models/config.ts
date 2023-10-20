import { WAXCurrency } from '@/api/models/common.ts';

export interface Config {
  //name of contract
  contract_name: string;
  //semver compliant contract version
  contract_version: string;
  //account that can approve proposals for voting
  admin_acct: string;
  //required permission for admin actions
  admin_auth: string;
  //last proposal id created
  last_proposal_id: number;
  //total available funding for proposals
  available_funds: WAXCurrency;
  //total funding reserved by approved proposals
  reserved_funds: WAXCurrency;
  //total deposited funds made by accounts
  deposited_funds: WAXCurrency;
  //total lifetime funding paid
  paid_funds: WAXCurrency;
  //length of voting period on a proposal in seconds (default is 14 days)
  vote_duration: number;
  //percent of votes to pass quorum
  quorum_threshold: number;
  //percent of yes votes to approve
  yes_threshold: number;
  //minimum total reqeuested amount for proposals (default is 1k WAX)
  min_requested: WAXCurrency;
  //maximum total reqeuested amount for proposals (default is 500k WAX)
  max_requested: WAXCurrency;
  categories: string[];
  // list of categories unavailable for new proposals
  cat_deprecated: string[];
}
