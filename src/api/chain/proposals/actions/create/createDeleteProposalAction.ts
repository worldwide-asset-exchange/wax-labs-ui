import { Action, SessionProps } from '@/api/models';
import { GenericProposal } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateDeleteProposalAction extends SessionProps {
  proposalId: number;
}

export default function createDeleteProposalAction({
  session,
  proposalId,
}: CreateDeleteProposalAction): Action<GenericProposal> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.DELETE_PROPOSAL,
    authorization: [
      {
        actor: session.actor.toString(),
        permission: session.permission.toString(),
      },
    ],
    data: {
      proposal_id: proposalId,
    },
  };
}
