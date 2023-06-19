import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { AddDeliverable } from '@/api/models/actions';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants';

export interface CreateAddDeliverableAction {
  deliverableId: number;
  proposalId: number;
  daysToComplete: string;
  requestedAmount: string;
  recipient: string;
  smallDescription: string;
  activeUser: WaxUser;
}

export default function createAddDeliverableAction({
  deliverableId,
  proposalId,
  daysToComplete,
  requestedAmount,
  smallDescription,
  recipient,
  activeUser: { accountName, requestPermission },
}: CreateAddDeliverableAction): Action<AddDeliverable> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.NEW_DELIVERABLE,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      deliverable_id: deliverableId,
      proposal_id: proposalId,
      days_to_complete: daysToComplete,
      small_description: smallDescription,
      requested_amount: requestedAmount,
      recipient,
    },
  };
}
