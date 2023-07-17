import { Action, SessionProps } from '@/api/models';
import { RemoveDeliverable } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateRemoveDeliverableAction extends SessionProps {
  deliverableId: number;
  proposalId: number;
}

export default function createRemoveDeliverableAction({
  deliverableId,
  proposalId,
  session,
}: CreateRemoveDeliverableAction): Action<RemoveDeliverable> {
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
    },
  };
}
