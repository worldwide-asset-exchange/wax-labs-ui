import createEditProposalAction, { EditProposalAction } from '@/api/chain/actions/create/editProposalAction.ts';

import { execute } from './execute';

export async function editProposal({ activeUser, proposal }: EditProposalAction) {
  return await execute(activeUser, [
    createEditProposalAction({
      activeUser,
      proposal,
    }),
  ]);
}
