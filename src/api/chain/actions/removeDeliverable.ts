import createRemoveDeliverableAction, {
  CreateRemoveDeliverableAction,
} from '@/api/chain/actions/create/createRemoveDeliverableAction.ts';

import { execute } from './execute';

export async function removeDeliverable({ deliverableId, proposalId, activeUser }: CreateRemoveDeliverableAction) {
  return await execute(activeUser, [createRemoveDeliverableAction({ deliverableId, proposalId, activeUser })]);
}
