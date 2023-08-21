import { execute } from '@/api/chain/actions';
import createEditDeliverableAction, {
  CreateEditDeliverableAction,
} from '@/api/chain/deliverables/actions/create/createEditDeliverableAction.ts';

export async function editDeliverable({
  session,
  deliverableId,
  proposalId,
  newRequestedAmount,
  newRecipient,
  smallDescription,
  daysToComplete,
}: CreateEditDeliverableAction) {
  return await execute(session, [
    createEditDeliverableAction({
      session,
      deliverableId,
      proposalId,
      newRequestedAmount,
      newRecipient,
      smallDescription,
      daysToComplete,
    }),
  ]);
}
