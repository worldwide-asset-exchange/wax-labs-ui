import { execute } from '@/api/chain/actions';
import createRemoveDeliverableAction, {
  CreateRemoveDeliverableAction,
} from '@/api/chain/deliverables/actions/create/createRemoveDeliverableAction.ts';

export async function removeDeliverable({ deliverableId, proposalId, session }: CreateRemoveDeliverableAction) {
  return await execute(session, [createRemoveDeliverableAction({ deliverableId, proposalId, session })]);
}
