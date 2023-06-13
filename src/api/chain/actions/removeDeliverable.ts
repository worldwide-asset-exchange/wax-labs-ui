import createRemoveDeliverableAction, {
  RemoveDeliverableAction,
} from '@/api/chain/actions/create/removeDeliverableAction.ts';

import { execute } from './execute';

export async function removeDeliverable({ deliverableId, proposalId, activeUser }: RemoveDeliverableAction) {
  return await execute(activeUser, [createRemoveDeliverableAction({ deliverableId, proposalId, activeUser })]);
}
