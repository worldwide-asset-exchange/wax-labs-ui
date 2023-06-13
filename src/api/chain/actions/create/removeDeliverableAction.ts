import { WaxUser } from '@eosdacio/ual-wax';

import { Action } from '@/api/models';
import { RemoveDeliverable } from '@/api/models/actions';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants';

export interface RemoveDeliverableAction {
  deliverableId: number;
  proposalId: number;
  activeUser: WaxUser;
}

export default function createRemoveDeliverableAction({
  deliverableId,
  proposalId,
  activeUser: { accountName, requestPermission },
}: RemoveDeliverableAction): Action<RemoveDeliverable> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.REMOVE_DELIVERABLE,
    authorization: [
      {
        actor: accountName,
        permission: requestPermission,
      },
    ],
    data: {
      deliverable_id: deliverableId,
      proposal_id: proposalId,
    },
  };
}
