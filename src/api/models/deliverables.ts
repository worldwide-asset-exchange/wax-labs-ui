import { Currency, USDCurrency, WAXCurrency } from '@/api/models/common.ts';
import { ProposalStatusKey } from '@/constants.ts';

export interface Deliverables {
  deliverable_id?: number;
  status: ProposalStatusKey;
  requested: WAXCurrency | USDCurrency;
  recipient: string;
  report: string;
  review_time?: number;
  small_description: string;
  days_to_complete: number;
  claimable_wax?: string;

  // Custom fields
  requested_amount?: number;
  currency?: Currency;
}
