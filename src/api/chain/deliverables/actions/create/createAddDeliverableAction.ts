import { Action, SessionProps } from '@/api/models';
import { AddDeliverable } from '@/api/models/actions.ts';
import { USDCurrency } from '@/api/models/common.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateAddDeliverableAction extends SessionProps {
  deliverableId: number;
  proposalId: number;
  daysToComplete: number;
  requestedAmount: number;
  recipient: string;
  smallDescription: string;
}

export default function createAddDeliverableAction({
  deliverableId,
  proposalId,
  daysToComplete,
  requestedAmount,
  smallDescription,
  recipient,
  session,
}: CreateAddDeliverableAction): Action<AddDeliverable> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.NEW_DELIVERABLE,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      deliverable_id: deliverableId,
      proposal_id: proposalId,
      days_to_complete: daysToComplete,
      small_description: smallDescription,
      requested_amount: `${requestedAmount.toFixed(4)} USD` as USDCurrency,
      recipient,
    },
  };
}
