import { execute } from '@/api/chain/actions';
import createRemoveDeliverableAction, {
  CreateRemoveDeliverableAction,
} from '@/api/chain/deliverables/actions/create/createRemoveDeliverableAction.ts';

export async function removeDeliverable({ deliverableId, proposalId, activeUser }: CreateRemoveDeliverableAction) {
  return await execute(activeUser, [createRemoveDeliverableAction({ deliverableId, proposalId, activeUser })]);
}
