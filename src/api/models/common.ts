// Format: 1,2300.00 WAX
import { NotificationType, ProposalStatusKey } from '@/constants.ts';

export type WAXCurrency = string;

// Format: 1,2300.00 USD
export type USDCurrency = string;

export type Currency = 'WAX' | 'USD';

export interface DeliverablesStatusToCheck {
  notificationType: NotificationType;
  proposalStatusKey: ProposalStatusKey;
}

export type IndexPosition =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'fourth'
  | 'fifth'
  | 'sixth'
  | 'seventh'
  | 'eighth'
  | 'ninth'
  | 'tenth'
  | undefined;
