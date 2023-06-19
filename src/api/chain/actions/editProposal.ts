import createEditProposalAction, {
  CreateEditProposalAction,
} from '@/api/chain/actions/create/createEditProposalAction.ts';

import { execute } from './execute';

export async function editProposal({ activeUser, proposal }: CreateEditProposalAction) {
  return await execute(activeUser, [
    createEditProposalAction({
      activeUser,
      proposal,
    }),
  ]);
}
