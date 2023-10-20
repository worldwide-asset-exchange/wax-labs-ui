// Format: 1,2300.00 WAX
import { DeliverableStatusKey, NotificationType } from '@/constants.ts';

export type WAXCurrency = `${number} WAX`;

export type USDCurrency = `${number} USD`;

export type Currency = 'WAX' | 'USD';

export interface DeliverablesStatusToCheck {
  notificationType: NotificationType;
  deliverableStatusKey: DeliverableStatusKey;
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
