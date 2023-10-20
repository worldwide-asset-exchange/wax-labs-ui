import { Action, SessionProps } from '@/api/models';
import { EditDeliverable } from '@/api/models/actions.ts';
import { WAXCurrency } from '@/api/models/common.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateEditDeliverableAction extends SessionProps {
  deliverableId: number;
  proposalId: number;
  newRequestedAmount: WAXCurrency;
  newRecipient: string;
  smallDescription: string;
  daysToComplete: number;
}

export default function createEditDeliverableAction({
  session,
  deliverableId,
  proposalId,
  newRequestedAmount,
  newRecipient,
  smallDescription,
  daysToComplete,
}: CreateEditDeliverableAction): Action<EditDeliverable> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.REMOVE_DELIVERABLE,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      deliverable_id: deliverableId,
      proposal_id: proposalId,
      new_recipient: newRecipient,
      new_requested_amount: newRequestedAmount,
      small_description: smallDescription,
      days_to_complete: daysToComplete,
    },
  };
}
