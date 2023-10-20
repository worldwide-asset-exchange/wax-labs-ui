import { execute } from '@/api/chain/actions';
import createEditProposalAction, {
  CreateEditProposalAction,
} from '@/api/chain/proposals/actions/create/createEditProposalAction.ts';

export async function editProposal({ session, proposal }: CreateEditProposalAction) {
  return await execute(session, [
    createEditProposalAction({
      session,
      proposal,
    }),
  ]);
}
