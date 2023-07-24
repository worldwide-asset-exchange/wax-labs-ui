import { Currency, USDCurrency, WAXCurrency } from '@/api/models/common.ts';
import { ProposalStatusKey } from '@/constants.ts';

export interface Deliverables {
  deliverable_id?: number;
  status: ProposalStatusKey;
  // The amount of money requested, can be in USD or WAX
  requested: WAXCurrency | USDCurrency;
  requested_amount?: number;
  currency?: Currency;
  recipient: string;
  small_description: string;
  days_to_complete: number;
  claimable_wax?: string;
  review_time?: string;
}
