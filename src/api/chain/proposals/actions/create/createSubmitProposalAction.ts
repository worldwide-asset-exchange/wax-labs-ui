import { Action, SessionProps } from '@/api/models';
import { GenericProposal } from '@/api/models/actions.ts';
import { Actions, LABS_CONTRACT_ACCOUNT } from '@/constants.ts';

export interface CreateSubmitProposalAction extends SessionProps {
  proposalId: number;
}

export default function createSubmitProposalAction({
  session,
  proposalId,
}: CreateSubmitProposalAction): Action<GenericProposal> {
  return {
    account: LABS_CONTRACT_ACCOUNT,
    name: Actions.SUBMIT_PROPOSAL,
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
