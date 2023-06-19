import createAddDeliverableAction, {
  CreateAddDeliverableAction,
} from '@/api/chain/actions/create/createAddDeliverableAction.ts';

import { execute } from './execute';

export async function removeDeliverable({
  deliverableId,
  proposalId,
  activeUser,
  recipient,
  requestedAmount,
  smallDescription,
  daysToComplete,
}: CreateAddDeliverableAction) {
  return await execute(activeUser, [
    createAddDeliverableAction({
      deliverableId,
      proposalId,
      activeUser,
      recipient,
      requestedAmount,
      smallDescription,
      daysToComplete,
    }),
  ]);
}
