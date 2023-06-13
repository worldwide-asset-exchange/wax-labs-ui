import createAddDeliverableAction, { AddDeliverableAction } from '@/api/chain/actions/create/addDeliverableAction.ts';

import { execute } from './execute';

export async function removeDeliverable({
  deliverableId,
  proposalId,
  activeUser,
  recipient,
  requestedAmount,
  smallDescription,
  daysToComplete,
}: AddDeliverableAction) {
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
