import { execute } from '@/api/chain/actions';
import createAddDeliverableAction, {
  CreateAddDeliverableAction,
} from '@/api/chain/deliverables/actions/create/createAddDeliverableAction.ts';

export async function addDeliverable({
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
