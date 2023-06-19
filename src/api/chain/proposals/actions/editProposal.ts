import { execute } from '@/api/chain/actions';
import createEditProposalAction, {
  CreateEditProposalAction,
} from '@/api/chain/proposals/actions/create/createEditProposalAction.ts';

export async function editProposal({ activeUser, proposal }: CreateEditProposalAction) {
  return await execute(activeUser, [
    createEditProposalAction({
      activeUser,
      proposal,
    }),
  ]);
}
